// Netlify Function: Send form submissions to Telegram
// Triggered by Netlify Forms submission-created event

const https = require('https');

exports.handler = async (event, context) => {
  // Only process form submission events
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method not allowed' };
  }

  try {
    const payload = JSON.parse(event.body);
    const { form_name, data } = payload.payload || payload;

    // Get Telegram credentials from environment variables
    const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
    const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

    if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
      console.error('Missing Telegram credentials');
      return { statusCode: 500, body: 'Missing Telegram configuration' };
    }

    // Format message based on form type
    let message = '';

    if (form_name === 'contact') {
      message = `📩 *New Contact Form Submission*\n\n` +
        `👤 *Name:* ${data.name || 'N/A'}\n` +
        `📧 *Email:* ${data.email || 'N/A'}\n` +
        `📞 *Phone:* ${data.phone || 'N/A'}\n` +
        `📋 *Subject:* ${data.subject || 'N/A'}\n` +
        `📱 *App:* ${data.app || 'N/A'}\n\n` +
        `💬 *Message:*\n${data.message || 'N/A'}`;
    } else if (form_name === 'account-deletion') {
      message = `🗑️ *Account Deletion Request*\n\n` +
        `📧 *Email:* ${data.email || 'N/A'}\n` +
        `📱 *Account Type:* ${data.account_type || 'N/A'}\n` +
        `❓ *Reason:* ${data.reason || 'N/A'}\n\n` +
        `💬 *Feedback:*\n${data.feedback || 'None provided'}`;
    } else {
      // Generic form
      message = `📝 *New Form Submission: ${form_name}*\n\n`;
      for (const [key, value] of Object.entries(data)) {
        if (key !== 'bot-field' && key !== 'form-name') {
          message += `*${key}:* ${value}\n`;
        }
      }
    }

    // Send to Telegram
    const telegramUrl = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;

    const telegramPayload = JSON.stringify({
      chat_id: TELEGRAM_CHAT_ID,
      text: message,
      parse_mode: 'Markdown'
    });

    const response = await new Promise((resolve, reject) => {
      const req = https.request(telegramUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(telegramPayload)
        }
      }, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => resolve({ statusCode: res.statusCode, body: data }));
      });

      req.on('error', reject);
      req.write(telegramPayload);
      req.end();
    });

    console.log('Telegram response:', response.body);

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Notification sent successfully' })
    };

  } catch (error) {
    console.error('Error sending Telegram notification:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to send notification' })
    };
  }
};
