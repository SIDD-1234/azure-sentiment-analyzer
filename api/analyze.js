import fetch from "node-fetch";

export default async function (context, req) {
  context.log("🔹 Function started");

  try {
    const text = req.body?.text;
    context.log("User text:", text);

    const endpoint = process.env["AZURE_ENDPOINT"];
    const key = process.env["AZURE_KEY"];

    context.log("Endpoint:", endpoint);
    context.log("Key length:", key ? key.length : "MISSING");

    if (!text) throw new Error("No text received");
    if (!endpoint || !key) throw new Error("Missing endpoint or key environment variable");

    const apiUrl = `${endpoint}/text/analytics/v3.1/sentiment`;
    context.log("Calling:", apiUrl);

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Ocp-Apim-Subscription-Key": key,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        documents: [
          { id: "1", language: "en", text }
        ]
      })
    });

    const data = await response.json();
    context.log("API response:", JSON.stringify(data, null, 2));

    const sentiment = data.documents?.[0]?.sentiment || "unknown";
    context.log("Final sentiment:", sentiment);

    context.res = {
      status: 200,
      headers: { "Content-Type": "application/json" },
      body: { sentiment }
    };
  } catch (error) {
    context.log.error("❌ Error:", error.message);
    context.res = {
      status: 500,
      body: { error: error.message }
    };
  }
}
