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
    <title>Global AI Job Scout | 2026 Edition</title>
    <style>
        :root { --primary: #38bdf8; --bg: #020617; --accent: #22c55e; }
        body { font-family: 'Inter', sans-serif; background: var(--bg); color: white; margin: 0; padding: 20px; display: flex; flex-direction: column; align-items: center; min-height: 100vh; }
        
        .container { background: rgba(30, 41, 59, 0.5); backdrop-filter: blur(12px); padding: 40px; border-radius: 28px; box-shadow: 0 25px 50px rgba(0,0,0,0.6); text-align: center; max-width: 600px; width: 100%; border: 1px solid rgba(255,255,255,0.05); margin-top: 20px; }
        
        .status-bar { display: inline-flex; align-items: center; background: rgba(34, 197, 94, 0.1); padding: 6px 16px; border-radius: 50px; margin-bottom: 20px; border: 1px solid rgba(34, 197, 94, 0.2); }
        .dot { height: 8px; width: 8px; background-color: var(--accent); border-radius: 50%; display: inline-block; margin-right: 10px; box-shadow: 0 0 10px var(--accent); animation: pulse 1.5s infinite; }
        @keyframes pulse { 0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.7); } 70% { transform: scale(1); box-shadow: 0 0 0 10px rgba(34, 197, 94, 0); } 100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(34, 197, 94, 0); } }
        
        h1 { font-size: 2.2rem; background: linear-gradient(to right, #fff, #94a3b8); -webkit-background-clip: text; -webkit-text-fill-color: transparent; margin: 0; }
        p { color: #94a3b8; font-size: 14px; margin: 10px 0 30px; }

        .filters { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 30px; }
        .input-group { text-align: left; }
        label { font-size: 11px; color: var(--primary); font-weight: bold; letter-spacing: 1px; text-transform: uppercase; margin-left: 5px; }
        select { background: #1e293b; border: 1px solid #334155; color: white; padding: 12px; border-radius: 12px; width: 100%; margin-top: 8px; font-size: 14px; cursor: pointer; transition: 0.3s; }
        select:focus { border-color: var(--primary); outline: none; }

        .btn { background: #fff; color: #000; border: none; padding: 16px; border-radius: 12px; font-weight: 800; cursor: pointer; width: 100%; font-size: 16px; transition: 0.3s; }
        .btn:hover { background: var(--primary); color: #fff; transform: translateY(-2px); }

        #results { margin-top: 30px; text-align: left; background: rgba(15, 23, 42, 0.9); padding: 25px; border-radius: 18px; display: none; border: 1px solid #334155; box-shadow: inset 0 2px 4px rgba(0,0,0,0.3); }
        .apply-btn { background: var(--primary); color: #020617; padding: 8px 18px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 13px; display: inline-block; margin-top: 10px; transition: 0.2s; }
        .apply-btn:hover { opacity: 0.9; }

        footer { margin-top: auto; padding: 50px 0 20px; text-align: center; width: 100%; border-top: 1px solid rgba(255,255,255,0.05); }
        .footer-links { margin-bottom: 10px; }
        .footer-links a { color: #64748b; text-decoration: none; font-size: 12px; margin: 0 15px; transition: 0.3s; }
        .footer-links a:hover { color: var(--primary); }
        .copy { color: #475569; font-size: 11px; }

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
        <p>AI-Powered Real-Time Opportunity Scanner for 2026</p>
        
        <div class="filters">
            <div class="input-group">
                <label>Geography</label>
                <select id="country">
                    <option value="Worldwide">Worldwide</option>
                    <option value="Pakistan">Pakistan 🇵🇰</option>
                    <option value="United States">USA 🇺🇸</option>
                    <option value="United Kingdom">UK 🇬🇧</option>
                    <option value="UAE">UAE 🇦🇪</option>
                </select>
            </div>
            <div class="input-group">
                <label>Work Mode</label>
                <select id="jobType">
                    <option value="Remote">Remote (Online)</option>
                    <option value="On-site">Physical (Office)</option>
                    <option value="Hybrid">Hybrid</option>
                </select>
            </div>
        </div>

        <button class="btn" id="scanBtn" onclick="scanJobs()">Scan Live Market</button>
        <div id="loader" class="loader"></div>
        <div id="results"></div>
    </div>

    <footer>
        <div class="footer-links">
            <a href="#">Privacy</a>
            <a href="#">Terms</a>
            <a href="#">Compliance</a>
            <a href="#">API Status</a>
        </div>
        <p class="copy">© 2026 Global Job Scout. Powered by Advanced AI Core. All Rights Reserved.</p>
    </footer>

    <script>
        function formatResponse(text) {
            let formatted = text.replace(/\\*\\*(.*?)\\*\\*/g, '<b style="color:var(--primary)">$1</b>');
            formatted = formatted.replace(/(https?:\\/\\/[^\\s\\)\\]]+)/g, '<a href="$1" target="_blank" class="apply-btn">View Opportunity →</a>');
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
            btn.innerText = 'Analyzing Market...';

            try {
                const response = await fetch('/api/scan?country=' + country + '&type=' + type);
                const data = await response.json();
                resDiv.style.display = 'block';
                resDiv.innerHTML = formatResponse(data.ai_response);
            } catch (e) {
                resDiv.style.display = 'block';
                resDiv.innerHTML = '⚠️ Engine Error: Verification Failed.';
            } finally {
                loader.style.display = 'none';
                btn.disabled = false;
                btn.innerText = 'Scan Live Market';
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
      messages: [{ role: "user", content: "Provide 3 high-paying verified " + type + " jobs in " + country + " for 2026. Give: **Role**, **Company**, **Salary**, and a LinkedIn Search Link. No intro, just the list." }],
      model: "llama-3.1-8b-instant",
    });
    res.json({ ai_response: completion.choices[0].message.content });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log('Scout Active on ' + PORT));

module.exports = app;
                 
