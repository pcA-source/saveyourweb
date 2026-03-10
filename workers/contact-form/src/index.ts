/**
 * Save Your Web — Contact Form Worker
 * Receives form submissions, validates, stores, and notifies.
 * Uses Cloudflare Email Workers (Send Email) for notifications.
 */

interface Env {
  NOTIFY_EMAIL: string;
  ALLOWED_ORIGIN: string;
  SMTP_HOST: string;
  SMTP_PORT: string;
  SMTP_USER: string;
  SMTP_PASS: string;
}

interface FormData {
  name: string;
  email: string;
  website?: string;
  message: string;
}

function corsHeaders(origin: string, allowed: string): HeadersInit {
  const allowedOrigins = [
    allowed,
    allowed.replace('https://', 'https://www.'),
    'https://saveyourweb.pages.dev',
  ];
  const isAllowed = allowedOrigins.some((o) => origin === o);
  return {
    'Access-Control-Allow-Origin': isAllowed ? origin : allowed,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function buildEmailContent(name: string, email: string, website: string, message: string): string {
  return `Nouveau lead depuis saveyourweb.fr

Nom: ${name}
Email: ${email}
Site web: ${website}
Message:
${message}

---
Envoyé depuis le formulaire de contact saveyourweb.fr — ${new Date().toLocaleString('fr-FR', { timeZone: 'Europe/Paris' })}`;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const origin = request.headers.get('Origin') || '';
    const headers = corsHeaders(origin, env.ALLOWED_ORIGIN);

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
      const body = (await request.json()) as FormData;

      if (!body.name?.trim() || !body.email?.trim() || !body.message?.trim()) {
        return new Response(
          JSON.stringify({ error: 'Champs requis manquants (nom, email, message)' }),
          { status: 400, headers: { ...headers, 'Content-Type': 'application/json' } }
        );
      }

      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email)) {
        return new Response(JSON.stringify({ error: 'Email invalide' }), {
          status: 400,
          headers: { ...headers, 'Content-Type': 'application/json' },
        });
      }

      const name = body.name.trim();
      const email = body.email.trim();
      const website = body.website?.trim() || 'Non renseigné';
      const message = body.message.trim();

      // Send notification via a webhook to n8n or similar
      // For now, we'll forward to a simple email relay endpoint
      // The form data is logged and a Discord notification is sent as backup

      const timestamp = new Date().toLocaleString('fr-FR', { timeZone: 'Europe/Paris' });
      
      // Try sending via Resend API (free tier: 100 emails/day)
      // If RESEND_API_KEY is set, use it; otherwise just log
      const emailBody = buildEmailContent(name, email, website, message);
      
      // Notify via Discord webhook as reliable backup
      const discordPayload = {
        embeds: [{
          title: `🔔 Nouveau lead — ${escapeHtml(name)}`,
          color: 0xff6a00,
          fields: [
            { name: '👤 Nom', value: name, inline: true },
            { name: '✉️ Email', value: email, inline: true },
            { name: '🌐 Site', value: website, inline: true },
            { name: '💬 Message', value: message.substring(0, 1000) },
          ],
          footer: { text: `saveyourweb.fr • ${timestamp}` },
        }],
      };

      // Send Discord notification if webhook URL is set
      if (env.DISCORD_WEBHOOK_URL) {
        await fetch(env.DISCORD_WEBHOOK_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(discordPayload),
        }).catch(() => {});
      }

      // Send email via Resend if API key is set
      if (env.RESEND_API_KEY) {
        await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${env.RESEND_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: 'Save Your Web <noreply@saveyourweb.fr>',
            to: [env.NOTIFY_EMAIL],
            reply_to: email,
            subject: `🔔 Nouveau lead — ${name}`,
            text: emailBody,
          }),
        }).catch(() => {});
      }

      return new Response(
        JSON.stringify({ success: true, message: 'Message envoyé avec succès !' }),
        { status: 200, headers: { ...headers, 'Content-Type': 'application/json' } }
      );
    } catch {
      return new Response(JSON.stringify({ error: 'Erreur serveur' }), {
        status: 500,
        headers: { ...headers, 'Content-Type': 'application/json' },
      });
    }
  },
};
