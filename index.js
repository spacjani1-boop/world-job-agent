const express = require('express');
const app = express();
const Groq = require("groq-sdk");

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="description" content="Ghaffar AI - Global Job Agent">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Ghaffar AI | Job Agent 2026</title>
    <style>
        :root { --primary: #38bdf8; --bg: #0f172a; --card: rgba(30, 41, 59, 0.7); }
        body { font-family: 'Segoe UI', sans-serif; background: var(--bg); color: white; margin: 0; padding: 20px; display: flex; flex-direction: column; align-items: center; min-height: 100vh; }
        .container { background: var(--card); backdrop-filter: blur(10px); padding: 30px; border-radius: 24px; box-shadow: 0 25px 50px rgba(0,0,0,0.5); text-align: center; max-width: 600px; width: 100%; border: 1px solid rgba(255,255,255,0.1); }
        h1 { color: var(--primary); font-size: 28px; margin-bottom: 20px; }
        .filters { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 20px; text-align: left; }
        select { background: #1e293b; border: 1px solid #334155; color: white; padding: 10px; border-radius: 8px; width: 100%; cursor: pointer; }
        .btn { background: linear-gradient(135deg, #38bdf8 0%, #1d4ed8 100%); border: none; padding: 15px; border-radius: 10px; color: white; font-weight: bold; cursor: pointer; width: 100%; }
        #results { margin-top: 20px; text-align: left; background: rgba(15, 23, 42, 0.8); padding: 15px; border-radius: 12px; display: none; border-left: 4px solid var(--primary); font-size: 14px; line-height: 1.6; }
        .apply-btn { background: var(--primary); color: #0f172a; padding: 5px 12px; border-radius: 6px; text-decoration: none; font-weight: bold; font-size: 11px; display: inline-block; margin-top: 5px; }
        footer { margin-top: 40px; font-size: 11px; color: #64748b; }
        .loader { border: 3px solid #f3f3f3; border-top: 3px solid var(--primary); border-radius: 50%; width: 20px; height: 20px; animation: spin 1s linear infinite; display: none; margin: 15px auto; }
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
    </style>
</head>
<body>
    <div class="container">
        <h1>AI job Agent</h1>
        <div class="filters">
            <div>
                <label style="font-size:10px">COUNTRY</label>
                <select id="country">
                    <option value="Worldwide">Worldwide</option>
                    <option value="Pakistan">Pakistan </option>
                    <option value="USA">USA 
                    </option>
                    <option value="UAE">UAE </option>
                </select>
            </div>
            <div>
                <label style="font-size:10px">TYPE</label>
                <select id="jobType">
                    <option value="Remote">Online</option>
                    <option value="On-site">Physical</option>
                </select>
            </div>
        </div>
        <button class="btn" id="scanBtn" onclick="scanJobs()">Scan Market Now</button>
        <div id="loader" class="loader"></div>
        <div id="results"></div>
    </div>
    <footer>© 2026 Ghaffar AI Agent. All Rights Reserved. <br> Privacy Policy | Copyright ©️</footer>

    <script>
        function formatResponse(text) {
            let formatted = text.replace(/\\*\\*(.*?)\\*\\*/g, '<b style="color:#38bdf8">$1</b>');
            formatted = formatted.replace(/(https?:\\/\\/[^\\s\\)\\]]+)/g, '<a href="$1" target="_blank" class="apply-btn">Apply Now →</a>');
            return formatted.replace(/\\n/g, '<br>');
        }
        async function scanJobs() {
            const country = document.getElementById('country').value;
            const type = document.getElementById('jobType').value;
            const resDiv = document.getElementById('results');
            const loader = document.getElementById('loader');
            const btn = document.getElementById('scanBtn');
            resDiv.style.display = 'none';
            loader.style.display = 'block';
            btn.disabled = true;
            try {
                const response = await fetch('/api/scan?country=' + country + '&type=' + type);
                const data = await response.json();
                resDiv.style.display = 'block';
                resDiv.innerHTML = formatResponse(data.ai_response);
            } catch (e) {
                resDiv.style.display = 'block';
                resDiv.innerHTML = '⚠️ Error: AI could not fetch data.';
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
    const { country, type } = req.query;
    const completion = await groq.chat.completions.create({
      messages: [{ role: "user", content: "Find 3 " + type + " jobs in " + country + " for 2026. Give Job Title, Company, and a LinkedIn Search Link." }],
      model: "llama-3.1-8b-instant",
    });
    res.json({ ai_response: completion.choices[0].message.content });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = app;
        
