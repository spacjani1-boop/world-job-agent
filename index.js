const express = require('express');
const app = express();
const Groq = require("groq-sdk");

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Ghaffar AI - Live Job Scanner</title>
    <style>
        body { font-family: 'Segoe UI', sans-serif; background: #0f172a; color: white; display: flex; justify-content: center; align-items: center; min-height: 100vh; margin: 0; padding: 20px; }
        .container { background: #1e293b; padding: 30px; border-radius: 20px; box-shadow: 0 20px 50px rgba(0,0,0,0.5); text-align: center; max-width: 650px; width: 100%; border: 1px solid #334155; }
        h1 { color: #38bdf8; margin-bottom: 5px; font-size: 26px; }
        .status { color: #22c55e; font-size: 14px; margin-bottom: 25px; font-weight: bold; }
        .btn { background: linear-gradient(135deg, #38bdf8 0%, #1d4ed8 100%); border: none; padding: 14px 30px; border-radius: 12px; color: white; font-weight: bold; cursor: pointer; font-size: 16px; transition: 0.3s; width: 100%; margin-bottom: 20px; }
        .btn:hover { transform: scale(1.02); box-shadow: 0 5px 15px rgba(56, 189, 248, 0.4); }
        #results { margin-top: 10px; text-align: left; background: #0f172a; padding: 20px; border-radius: 12px; display: none; border-left: 4px solid #38bdf8; line-height: 1.8; font-size: 15px; }
        .job-link { color: #38bdf8; text-decoration: underline; font-weight: bold; word-break: break-all; }
        .loader { border: 4px solid #f3f3f3; border-top: 4px solid #38bdf8; border-radius: 50%; width: 25px; height: 25px; animation: spin 1s linear infinite; display: none; margin: 20px auto; }
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        b { color: #38bdf8; }
    </style>
</head>
<body>
    <div class="container">
        <h1>🌍 Worldwide Job Agent</h1>
        <div class="status">● AGENT IS LIVE & SCANNING</div>
        <button class="btn" id="scanBtn" onclick="scanJobs()">Scan Live Jobs 2026</button>
        <div id="loader" class="loader"></div>
        <div id="results"></div>
    </div>

    <script>
        function formatResponse(text) {
            // Stars (**) khatam karke bold karna
            let formatted = text.replace(/\\*\\*(.*?)\\*\\*/g, '<b>$1</b>');
            // Links ko clickable banana
            formatted = formatted.replace(/(https?:\\/\\/[^\\s\\)\\]]+)/g, '<a href="$1" target="_blank" class="job-link">Click Here to Apply</a>');
            // New lines ko sahi karna
            return formatted.replace(/\\n/g, '<br>');
        }

        async function scanJobs() {
            const resDiv = document.getElementById('results');
            const loader = document.getElementById('loader');
            const btn = document.getElementById('scanBtn');
            
            resDiv.style.display = 'none';
            loader.style.display = 'block';
            btn.disabled = true;

            try {
                const response = await fetch('/api/scan');
                const data = await response.json();
                resDiv.style.display = 'block';
                resDiv.innerHTML = formatResponse(data.ai_response);
            } catch (e) {
                resDiv.style.display = 'block';
                resDiv.innerHTML = '⚠️ Error: AI Agent connection failed.';
            } finally {
                loader.style.display = 'none';
                btn.disabled = false;
            }
        }
    </script>
</body>
</html>
`;

app.get('/', (req, res) => res.send(htmlContent));

app.get('/api/scan', async (req, res) => {
  try {
    const completion = await groq.chat.completions.create({
      messages: [{ 
        role: "user", 
        content: "Find 3 REAL remote jobs for 2026. Format: **Job Title**, **Company**, **Salary**, and the **Direct URL**. Don't use extra chat, just the list." 
      }],
      model: "llama-3.1-8b-instant",
    });
    res.json({ ai_response: completion.choices[0].message.content });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = app;

