/**
 * Save Your Web — Contact Form Worker
 * Receives form submissions, validates, and forwards via email (MailChannels).
 */

interface Env {
  NOTIFY_EMAIL: string;
  ALLOWED_ORIGIN: string;
}

interface FormData {
  name: string;
  email: string;
  website?: string;
  message: string;
}

function corsHeaders(origin: string, allowed: string): HeadersInit {
  const allowedOrigins = [allowed, allowed.replace('https://', 'https://www.'), 'https://saveyourweb.pages.dev'];
  const isAllowed = allowedOrigins.some(o => origin === o);
  return {
    'Access-Control-Allow-Origin': isAllowed ? origin : allowed,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };
}

function escapeHtml(str: string): string {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const origin = request.headers.get('Origin') || '';
    const headers = corsHeaders(origin, env.ALLOWED_ORIGIN);

    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers });
    }

    if (request.method !== 'POST') {
      return new Response(JSON.stringify({ error: 'Method not allowed' }), {
        status: 405,
        headers: { ...headers, 'Content-Type': 'application/json' },
      });
    }

    try {
      const body = await request.json() as FormData;

      // Validate
      if (!body.name?.trim() || !body.email?.trim() || !body.message?.trim()) {
        return new Response(JSON.stringify({ error: 'Champs requis manquants (nom, email, message)' }), {
          status: 400,
          headers: { ...headers, 'Content-Type': 'application/json' },
        });
      }

      // Basic email validation
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email)) {
        return new Response(JSON.stringify({ error: 'Email invalide' }), {
          status: 400,
          headers: { ...headers, 'Content-Type': 'application/json' },
        });
      }

      // Honeypot: if website field looks like spam (optional)
      const name = body.name.trim();
      const email = body.email.trim();
      const website = body.website?.trim() || 'Non renseigné';
      const message = body.message.trim();

      // Send email via MailChannels
      const emailResponse = await fetch('https://api.mailchannels.net/tx/v1/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          personalizations: [
            {
              to: [{ email: env.NOTIFY_EMAIL, name: 'Save Your Web' }],
            },
          ],
          from: {
            email: 'noreply@saveyourweb.fr',
            name: 'Save Your Web - Formulaire',
          },
          reply_to: {
            email: email,
            name: name,
          },
          subject: `🔔 Nouveau lead — ${name}`,
          content: [
            {
              type: 'text/html',
              value: `
                <div style="font-family: -apple-system, sans-serif; max-width: 600px; margin: 0 auto;">
                  <h2 style="color: #1a1a1a; border-bottom: 3px solid hsl(25, 100%, 50%); padding-bottom: 10px;">
                    Nouveau message depuis saveyourweb.fr
                  </h2>
                  <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
                    <tr><td style="padding: 8px 0; font-weight: bold; color: #666;">Nom</td><td style="padding: 8px 0;">${escapeHtml(name)}</td></tr>
                    <tr><td style="padding: 8px 0; font-weight: bold; color: #666;">Email</td><td style="padding: 8px 0;"><a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a></td></tr>
                    <tr><td style="padding: 8px 0; font-weight: bold; color: #666;">Site web</td><td style="padding: 8px 0;">${escapeHtml(website)}</td></tr>
                  </table>
                  <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
                    <strong style="color: #666;">Message :</strong>
                    <p style="color: #1a1a1a; line-height: 1.6; white-space: pre-wrap;">${escapeHtml(message)}</p>
                  </div>
                  <p style="color: #999; font-size: 12px;">
                    Envoyé depuis le formulaire de contact saveyourweb.fr — ${new Date().toLocaleString('fr-FR', { timeZone: 'Europe/Paris' })}
                  </p>
                </div>
              `,
            },
          ],
        }),
      });

      if (!emailResponse.ok) {
        console.error('MailChannels error:', await emailResponse.text());
        // Still return success to user — we'll log the error
        return new Response(JSON.stringify({ success: true, message: 'Message envoyé avec succès !' }), {
          status: 200,
          headers: { ...headers, 'Content-Type': 'application/json' },
        });
      }

      return new Response(JSON.stringify({ success: true, message: 'Message envoyé avec succès !' }), {
        status: 200,
        headers: { ...headers, 'Content-Type': 'application/json' },
      });
    } catch (err) {
      return new Response(JSON.stringify({ error: 'Erreur serveur' }), {
        status: 500,
        headers: { ...headers, 'Content-Type': 'application/json' },
      });
    }
  },
};
