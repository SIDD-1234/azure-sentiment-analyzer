import express from "express";
import fetch from "node-fetch";
import dotenv from "dotenv";
dotenv.config();

const app = express();
app.use(express.json());
app.use(express.static("public"));

app.post("/api/analyze", async (req, res) => {
  try {
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
    res.json({ sentiment: data.documents[0].sentiment });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = 3000;
app.listen(PORT, () => console.log(`✅ Server running at http://localhost:${PORT}`));
