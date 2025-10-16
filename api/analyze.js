import fetch from "node-fetch";

export default async function (context, req) {
  try {
    const text = req.body.text;

    if (!text) {
      context.res = {
        status: 400,
        body: { error: "No text provided" }
      };
      return;
    }

    const endpoint = process.env["AZURE_ENDPOINT"];
    const key = process.env["AZURE_KEY"];

    const response = await fetch(`${endpoint}/text/analytics/v3.1/sentiment`, {
      method: "POST",
      headers: {
        "Ocp-Apim-Subscription-Key": key,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        documents: [{ id: "1", language: "en", text }]
      })
    });

    const data = await response.json();

    context.res = {
      status: 200,
      headers: { "Content-Type": "application/json" },
      body: { sentiment: data.documents?.[0]?.sentiment ?? "unknown" }
    };
  } catch (error) {
    context.res = {
      status: 500,
      body: { error: error.message }
    };
  }
}
