const express = require('express');
const app = express();
const Groq = require("groq-sdk");

// API Key check
const apiKey = process.env.GROQ_API_KEY;
const groq = new Groq({ apiKey: apiKey });

// --- HTML CONTENT ---
const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Global AI Job Scout</title>
    <style>
        :root { --primary: #38bdf8; --bg: #020617; --accent: #22c55e; }
        body { font-family: 'Inter', sans-serif; background: var(--bg); color: white; margin: 0; padding: 20px; display: flex; flex-direction: column; align-items: center; min-height: 100vh; }
        .status-bar { display: inline-flex; align-items: center; background: rgba(34, 197, 94, 0.1); padding: 6px 16px; border-radius: 50px; margin-bottom: 20px; border: 1px solid rgba(34, 197, 94, 0.2); }
        .dot { height: 8px; width: 8px; background-color: var(--accent); border-radius: 50%; display: inline-block; margin-right: 10px; box-shadow: 0 0 10px var(--accent); animation: pulse 1.5s infinite; }
        @keyframes pulse { 0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.7); } 70% { transform: scale(1); box-shadow: 0 0 0 10px rgba(34, 197, 94, 0); } 100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(34, 197, 94, 0); } }
        .container { background: rgba(30, 41, 59, 0.5); backdrop-filter: blur(12px); padding: 40px; border-radius: 28px; box-shadow: 0 25px 50px rgba(0,0,0,0.6); text-align: center; max-width: 600px; width: 100%; border: 1px solid rgba(255,255,255,0.05); }
        h1 { font-size: 2.2rem; color: #fff; margin: 0; }
        .filters { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin: 30px 0; }
        select { background: #1e293b; border: 1px solid #334155; color: white; padding: 12px; border-radius: 12px; width: 100%; cursor: pointer; }
        .btn { background: #fff; color: #000; border: none; padding: 16px; border-radius: 12px; font-weight: 800; cursor: pointer; width: 100%; font-size: 16px; }
        #results { margin-top: 30px; text-align: left; background: rgba(15, 23, 42, 0.9); padding: 25px; border-radius: 18px; display: none; border-left: 4px solid var(--primary); line-height: 1.8; }
        .apply-btn { background: var(--primary); color: #020617; padding: 8px 18px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 13px; display: inline-block; margin-top: 10px; }
        .loader { border: 2px solid #f3f3f3; border-top: 2px solid var(--primary); border-radius: 50%; width: 20px; height: 20px; animation: spin 0.8s linear infinite; display: none; margin: 20px auto; }
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
    </style>
</head>
<body>
    <div class="status-bar">
        <span class="dot"></span>
        <span style="font-size: 12px; font-weight: bold; color: var(--accent);">SYSTEM ONLINE • GLOBAL SCAN ACTIVE</span>
    </div>
    <div class="container">
        <h1>Global Job Scout</h1>
        <div class="filters">
            <select id="country">
                <option value="Worldwide">Worldwide</option>
                <option value="Pakistan">Pakistan 🇵🇰</option>
                <option value="USA">USA 🇺🇸</option>
            </select>
            <select id="jobType">
                <option value="Remote">Remote</option>
                <option value="On-site">Physical</option>
            </select>
        </div>
        <button class="btn" onclick="scanJobs()">Scan Live Market</button>
        <div id="loader" class="loader"></div>
        <div id="results"></div>
    </div>
    <script>
        function formatResponse(text) {
            var formatted = text.replace(/\\*\\*(.*?)\\*\\*/g, '<b style="color:#38bdf8">$1</b>');
            formatted = formatted.replace(/(https?:\\/\\/[^\\s\\)\\]]+)/g, '<a href="$1" target="_blank" class="apply-btn">View Opportunity →</a>');
            return formatted.replace(/\\n/g, '<br>');
        }
        async function scanJobs() {
            var country = document.getElementById('country').value;
            var type = document.getElementById('jobType').value;
            var resDiv = document.getElementById('results');
            var loader = document.getElementById('loader');
            resDiv.style.display = 'none';
            loader.style.display = 'block';
            try {
                var response = await fetch('/api/scan?country=' + country + '&type=' + type);
                var data = await response.json();
                resDiv.style.display = 'block';
                resDiv.innerHTML = formatResponse(data.ai_response);
            } catch (e) {
                resDiv.style.display = 'block';
                resDiv.innerHTML = '⚠️ Connection Error.';
            } finally {
                loader.style.display = 'none';
            }
        }
    </script>
</body>
</html>
`;

// --- ROUTES ---

app.get('/', function(req, res) {
    res.send(htmlContent);
});

app.get('/api/scan', async function(req, res) {
    try {
        var country = req.query.country;
        var type = req.query.type;
        var prompt = "";

        if (country === "Pakistan") {
            prompt = "List 3 " + type + " jobs in Pakistan from Rozee.pk or STS. Provide: **Title**, **Company**, **Link**.";
        } else {
            prompt = "List 3 " + type + " jobs in " + country + ". Provide: **Title**, **Company**, **Link**.";
        }

        const completion = await groq.chat.completions.create({
            messages: [{ role: "user", content: prompt }],
            model: "llama-3.1-8b-instant",
        });

        res.json({ ai_response: completion.choices[0].message.content });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Hostinger Port Logic
const PORT = process.env.PORT || 8080;
app.listen(PORT, function() {
    console.log("Server listening on port " + PORT);
});

