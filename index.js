const express = require('express');
const app = express();
const Groq = require("groq-sdk");

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// --- FRONTEND DESIGN (HTML/CSS) ---
const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Ghaffar Worldwide AI Agent</title>
    <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: #0f172a; color: white; display: flex; justify-content: center; align-items: center; min-height: 100vh; margin: 0; }
        .container { background: #1e293b; padding: 40px; border-radius: 20px; box-shadow: 0 20px 50px rgba(0,0,0,0.5); text-align: center; max-width: 600px; width: 90%; border: 1px solid #334155; }
        h1 { color: #38bdf8; margin-bottom: 10px; font-size: 28px; }
        p { color: #94a3b8; margin-bottom: 30px; }
        .btn { background: linear-gradient(135deg, #38bdf8 0%, #1d4ed8 100%); border: none; padding: 15px 35px; border-radius: 50px; color: white; font-weight: bold; cursor: pointer; font-size: 18px; transition: 0.3s; box-shadow: 0 5px 15px rgba(56, 189, 248, 0.4); }
        .btn:hover { transform: translateY(-3px); box-shadow: 0 8px 20px rgba(56, 189, 248, 0.6); }
        #results { margin-top: 30px; text-align: left; background: #0f172a; padding: 20px; border-radius: 12px; display: none; border-left: 4px solid #38bdf8; line-height: 1.6; white-space: pre-wrap; font-size: 15px; }
        .loader { border: 4px solid #f3f3f3; border-top: 4px solid #38bdf8; border-radius: 50%; width: 30px; height: 30px; animation: spin 1s linear infinite; display: none; margin: 20px auto; }
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
    </style>
</head>
<body>
    <div class="container">
        <h1>🌍 Ghaffar AI Agent</h1>
        <p>Your Personal Agent Scanning Global Trends for 2026</p>
        <button class="btn" onclick="scanJobs()">Scan Market Now</button>
        <div id="loader" class="loader"></div>
        <div id="results"></div>
    </div>

    <script>
        async function scanJobs() {
            const resDiv = document.getElementById('results');
            const loader = document.getElementById('loader');
            const btn = document.querySelector('.btn');
            
            resDiv.style.display = 'none';
            loader.style.display = 'block';
            btn.disabled = true;
            btn.innerText = 'Scanning...';

            try {
                const response = await fetch('/api/scan');
                const data = await response.json();
                resDiv.style.display = 'block';
                resDiv.innerText = data.ai_response;
            } catch (e) {
                resDiv.style.display = 'block';
                resDiv.innerText = '⚠️ Connection Error: Could not reach AI Agent.';
            } finally {
                loader.style.display = 'none';
                btn.disabled = false;
                btn.innerText = 'Scan Market Now';
            }
        }
    </script>
</body>
</html>
`;

// --- BACKEND ROUTES ---

// Main page route
app.get('/', (req, res) => {
  res.send(htmlContent);
});

// AI logic route
app.get('/api/scan', async (req, res) => {
  try {
    const completion = await groq.chat.completions.create({
      messages: [{ role: "user", content: "Identify the top 3 high-paying remote job sectors for 2026 and why they are growing." }],
      model: "llama-3.1-8b-instant",
    });
    res.json({ ai_response: completion.choices[0].message.content });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = app;
