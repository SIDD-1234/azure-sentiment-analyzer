import fetch from "node-fetch";
import dotenv from "dotenv";
dotenv.config();

export default async function (context, req) {
  const text = req.body.text;
  const response = await fetch(`${process.env.AZURE_ENDPOINT}/text/analytics/v3.1/sentiment`, {
    method: "POST",
    headers: {
      "Ocp-Apim-Subscription-Key": process.env.AZURE_KEY,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ documents: [{ id: "1", language: "en", text }] })
  });

  const data = await response.json();
  return { body: JSON.stringify({ sentiment: data.documents[0].sentiment }) };
}
