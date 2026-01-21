const fetch = require('node-fetch');

exports.handler = async function(event, context) {
  // CORS Headers
  const headers = {
    "Access-Control-Allow-Origin": "*", // oder GitHub Pages URL z. B. "https://schutzenverein-hustedt-von-1919-e-v.github.io"
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "POST, OPTIONS"
  };

  // Preflight request abfangen
  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 200, headers };
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed', headers };
  }

  try {
    const { name, email } = JSON.parse(event.body);

    const SEATABLE_API_URL = 'https://cloud.seatable.io/api/v2.1/workspaces/97343/dtables/070b5738-b3fd-4306-a72c-065134dd6fae/rows/';
    const SEATABLE_API_TOKEN = process.env.SEATABLE_API_TOKEN;
    const TABLE_NAME = 'Table1';

    const payload = {
      table_name_or_id: TABLE_NAME,
      rows: [
        { "Name": name, "E-Mail": email }
      ]
    };

    const response = await fetch(SEATABLE_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Token ${SEATABLE_API_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errText = await response.text();
      return { statusCode: response.status, body: JSON.stringify({ error: errText }), headers };
    }

    return { statusCode: 200, body: JSON.stringify({ success: true }), headers };

  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: err.message }), headers };
  }
};
