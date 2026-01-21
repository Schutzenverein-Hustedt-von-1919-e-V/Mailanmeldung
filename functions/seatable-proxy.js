const fetch = require('node-fetch');

exports.handler = async function(event, context) {
  // Nur POST erlauben
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method Not Allowed' })
    };
  }

  try {
    // Name & E-Mail aus dem Request auslesen
    const { name, email } = JSON.parse(event.body);

    // SeaTable API
    const SEATABLE_API_URL = 'https://cloud.seatable.io/api/v2.1/workspaces/97343/dtables/070b5738-b3fd-4306-a72c-065134dd6fae/rows/';
    const SEATABLE_API_TOKEN = process.env.SEATABLE_API_TOKEN;
    const TABLE_NAME = 'Table1';

    // Payload für SeaTable
    const payload = {
      table_name_or_id: TABLE_NAME,
      rows: [
        { "Name": name, "E-Mail": email }
      ]
    };

    // POST Request an SeaTable
    const response = await fetch(SEATABLE_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Token ${SEATABLE_API_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    // Prüfen, ob alles ok war
    if (!response.ok) {
      const errText = await response.text();
      return { statusCode: response.status, body: JSON.stringify({ error: errText }) };
    }

    // Erfolg
    return {
      statusCode: 200,
      body: JSON.stringify({ success: true })
    };

  } catch (err) {
    // Fehler abfangen
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message })
    };
  }
};
