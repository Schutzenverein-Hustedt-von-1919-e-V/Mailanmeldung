const fetch = (...args) =>
  import('node-fetch').then(({ default: fetch }) => fetch(...args));

exports.handler = async function (event) {

  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Content-Type": "application/json"
  };

  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 200, headers, body: "{}" };
  }

  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: "Method not allowed" })
    };
  }

  try {
    const { name, email } = JSON.parse(event.body);

    const BASE_UUID = "070b5738-b3fd-4306-a72c-065134dd6fae";
    const TABLE_NAME = "Table1";
    const TOKEN = process.env.SEATABLE_API_TOKEN;

    const response = await fetch(
      `https://cloud.seatable.io/api-gateway/api/v2/dtables/${BASE_UUID}/rows/`,
      {
        method: "POST",
        headers: {
          "Authorization": `Token ${TOKEN}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          table_name: TABLE_NAME,
          rows: [
            {
              "Name": name,
              "E-Mail": email
            }
          ]
        })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("SeaTable error:", data);
      throw new Error(JSON.stringify(data));
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ success: true })
    };

  } catch (err) {
    console.error("Function error:", err);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: "Server error", details: err.message })
    };
  }
};
