async function analyzeSentiment() {
  const text = document.getElementById("userInput").value.trim();
  if (!text) return alert("Please enter some text!");

  const res = await fetch("/api/analyze", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text })
  });

  const data = await res.json();
  document.getElementById("result").innerText =
    `Sentiment: ${data.sentiment.toUpperCase()}`;
}
