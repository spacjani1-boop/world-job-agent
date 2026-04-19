const express = require('express');
const app = express();
const Groq = require("groq-sdk");

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

app.get('/', (req, res) => {
  res.send('🌍 Ghaffar Bhai, Worldwide AI Agent is LIVE on Vercel!');
});

app.get('/api/scan', async (req, res) => {
  try {
    const completion = await groq.chat.completions.create({
      messages: [{ role: "user", content: "Give me 3 trending remote job titles worldwide for 2026." }],
      model: "llama-3.1-8b-instant",
    });
    res.json({ ai_response: completion.choices[0].message.content });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = app;
