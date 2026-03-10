/**
 * Save Your Web — Contact Form Worker
 * Receives form submissions, validates, stores, and notifies.
 * Uses Cloudflare Email Workers (Send Email) for notifications.
 */

interface Env {
  NOTIFY_EMAIL: string;
  ALLOWED_ORIGIN: string;
  DISCORD_WEBHOOK_URL: string;
  DISCORD_DEVIS_WEBHOOK_URL?: string;
  RESEND_API_KEY?: string;
  QONTO_ORG_SLUG: string;
  QONTO_SECRET_KEY: string;
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
      const body = await request.json() as any;

      // Handle devis validation
      if (body.type === 'devis_validation') {
        const timestamp = new Date().toLocaleString('fr-FR', { timeZone: 'Europe/Paris' });
        const toursList = (body.modules_tours || []).join('\n');
        const lrList = (body.modules_lr || []).join('\n');

        // Build Qonto quote items from selected modules
        const qontoItems: any[] = [];
        for (const mod of (body.modules_detail || [])) {
          if (mod.setup > 0) {
            qontoItems.push({
              title: `${mod.label} (Setup)`,
              description: (mod.details || []).join(', ').substring(0, 1800),
              quantity: '1', unit: 'forfait',
              unit_price: { value: mod.setup.toFixed(2), currency: 'EUR' },
              vat_rate: '0.20', currency: 'EUR',
            });
          }
          if (mod.monthly > 0) {
            qontoItems.push({
              title: `${mod.label} (Mensuel)`,
              description: `Accompagnement mensuel — ${mod.sublabel || ''}`.substring(0, 1800),
              quantity: '1', unit: 'mois',
              unit_price: { value: mod.monthly.toFixed(2), currency: 'EUR' },
              vat_rate: '0.20', currency: 'EUR',
            });
          }
        }

        // Create quote on Qonto if we have items and credentials
        let qontoQuote: any = null;
        if (qontoItems.length > 0 && env.QONTO_ORG_SLUG && env.QONTO_SECRET_KEY && body.qonto_client_id) {
          const today = new Date().toISOString().split('T')[0];
          const expiry = new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0];
          
          try {
            const qRes = await fetch('https://thirdparty.qonto.com/v2/quotes', {
              method: 'POST',
              headers: {
                'Authorization': `${env.QONTO_ORG_SLUG}:${env.QONTO_SECRET_KEY}`,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                client_id: body.qonto_client_id,
                issue_date: today,
                expiry_date: expiry,
                currency: 'EUR',
                terms_and_conditions: 'Devis valable 30 jours. Sans engagement, résiliable avec 30 jours de préavis. Budget publicitaire non inclus.',
                header: body.qonto_header || 'Proposition commerciale — Save Your Web',
                items: qontoItems,
              }),
            });
            const qData = await qRes.json() as any;
            qontoQuote = qData.quote || null;
          } catch (e) {
            // Qonto failed, continue with Discord notification
          }
        }
        
        // Discord notification
        const qontoInfo = qontoQuote 
          ? `\n📄 **Devis Qonto créé** : ${qontoQuote.number} (${qontoQuote.status}) — ${qontoQuote.total_amount?.value || '?'}€ TTC`
          : (qontoItems.length > 0 ? '\n⚠️ Devis Qonto non créé (credentials manquants ou erreur)' : '');

        const discordPayload = {
          embeds: [{
            title: `✅ Devis validé — ${body.client || 'Client'}`,
            color: 0x22c55e,
            fields: [
              ...(toursList ? [{ name: '📍 Tours', value: toursList, inline: false }] : []),
              ...(lrList ? [{ name: '📍 La Rochelle', value: lrList, inline: false }] : []),
              { name: '💰 Setup total', value: `${body.total_setup || 0} € HT`, inline: true },
              { name: '📆 Mensuel total', value: `${body.total_monthly || 0} € HT/mois`, inline: true },
              ...(qontoQuote ? [{ name: '📄 Qonto', value: `Devis **${qontoQuote.number}** créé — ${qontoQuote.total_amount?.value || '?'}€ TTC`, inline: false }] : []),
            ],
            footer: { text: `Devis ${body.devis || ''} • ${timestamp}` },
          }],
        };

        const devisWebhook = env.DISCORD_DEVIS_WEBHOOK_URL || env.DISCORD_WEBHOOK_URL;
        if (devisWebhook) {
          await fetch(devisWebhook, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(discordPayload),
          }).catch(() => {});
        }

        return new Response(
          JSON.stringify({ 
            success: true, 
            qonto_quote: qontoQuote ? { id: qontoQuote.id, number: qontoQuote.number, status: qontoQuote.status } : null 
          }),
          { status: 200, headers: { ...headers, 'Content-Type': 'application/json' } }
        );
      }

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
