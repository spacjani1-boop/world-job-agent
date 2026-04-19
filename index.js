const express = require('express');
const app = express();
const Groq = require("groq-sdk");

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="description" content="Ghaffar AI - Worldwide Job Agent for Remote and Physical Jobs in 2026.">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Ghaffar AI | Global Job Agent 2026</title>
    <style>
        :root { --primary: #38bdf8; --bg: #0f172a; --card: rgba(30, 41, 59, 0.7); }
        body { font-family: 'Segoe UI', sans-serif; background: var(--bg); color: white; margin: 0; padding: 20px; display: flex; flex-direction: column; align-items: center; min-height: 100vh; }
        
        .container { background: var(--card); backdrop-filter: blur(10px); padding: 40px; border-radius: 24px; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.5); text-align: center; max-width: 700px; width: 100%; border: 1px solid rgba(255,255,255,0.1); }
        
        h1 { color: var(--primary); font-size: 32px; margin-bottom: 10px; text-shadow: 0 0 20px rgba(56, 189, 248, 0.3); }
        .status { color: #22c55e; font-size: 13px; margin-bottom: 30px; letter-spacing: 1px; }

        /* Filters Section */
        .filters { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 25px; text-align: left; }
        label { font-size: 12px; color: #94a3b8; margin-left: 5px; text-transform: uppercase; }
        select, input { background: #1e293b; border: 1px solid #334155; color: white; padding: 12px; border-radius: 10px; width: 100%; margin-top: 5px; outline: none; transition: 0.3s; }
        select:focus { border-color: var(--primary); }

        .btn { background: linear-gradient(135deg, #38bdf8 0%, #1d4ed8 100%); border: none; padding: 16px; border-radius: 12px; color: white; font-weight: bold; cursor: pointer; font-size: 16px; width: 100%; transition: 0.3s; box-shadow: 0 10px 15px -3px rgba(56, 189, 248, 0.3); }
        .btn:hover { transform: translateY(-2px); box-shadow: 0 20px 25px -5px rgba(56, 189, 248, 0.4); }

        #results { margin-top: 30px; text-align: left; background: rgba(15, 23, 42, 0.8); padding: 25px; border-radius: 15px; display: none; border: 1px solid #334155; line-height: 1.8; }
        .job-card { border-bottom: 1px solid #334155; padding-bottom: 15px; margin-bottom: 15px; }
        .apply-btn { background: var(--primary); color: #0f172a; padding: 6px 15px; border-radius: 6px; text-decoration: none; font-weight: 800; font-size: 12px; display: inline-block; margin-top: 8px; }
        
        footer { margin-top: auto; padding: 40px 20px 20px; text-align: center; font-size: 12px; color: #64748b; }
        footer a { color: var(--primary); text-decoration: none; margin: 0 10px; }
        .loader { border: 3px solid #f3f3f3; border-top: 3px solid var(--primary); border-radius: 50%; width: 24px; height: 24px; animation: spin 1s linear infinite; display: none; margin: 20px auto; }
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
    </style>
</head>
<body>
    <div class="container">
        <h1>🌍 Ghaffar Global Agent</h1>
        <div class="status">● AI ENGINE ACTIVE & SECURED</div>
        
        <div class="filters">
            <div>
                <label>Target Country</label>
                <select id="country">
                    <option value="Worldwide">Worldwide</option>
                    <option value="Pakistan">Pakistan 🇵🇰</option>
                    <option value="USA">USA 🇺🇸</option>
                    <option value="UK">UK 🇬🇧</option>
                    <option value="UAE">UAE 🇦🇪</option>
                </select>
            </div>
            <div>
                <label>Job Type</label>
                <select id="jobType">
                    <option value="Remote">Online / Remote</option>
                    <option value="On-site">Physical / Office</option>
                    <option value="Hybrid">Hybrid</option>
                </select>
            </div>
        </div>

        <button class="btn" id="scanBtn" onclick="scanJobs()">Find Verified Opportunities</button>
        
        <div id="loader" class="loader"></div>
        <div id="results"></div>
    </div>

    <footer>
        <p>© 2026 Ghaffar AI Agent. All Rights Reserved.</p>
        <p>
            <a href="#">Privacy Policy</a> | 
            <a href="#">Terms of Service</a> | 
            <a href="#">Contact Support</a>
        </p>
    </footer>

    <script>
        function formatResponse(text) {
            let formatted = text.replace(/\\*\\*(.*?)\\*\\*/g, '<b style="color:#38bdf8">$1</b>');
            formatted = formatted.replace(/(https?:\\/\\/[^\\s\\)\\]]+)/g, '<a href="$1" target="_blank" class="apply-btn">APPLY ON PLATFORM</a>');
            return formatted.replace(/\\n/g, '<br>');
        }

        async function scanJobs() {
            const country = document.getElementById('country').value;
            const jobType = document.getElementById('jobType').value;
            const resDiv = document.getElementById('results');
            const loader = document.getElementById('loader');
            const btn = document.getElementById('scanBtn');
            
            resDiv.style.display = 'none';
            loader.style.display = 'block';
            btn.disabled = true;

            try {
                const response = await fetch(\`/api/scan?country=\${country}&type=\${jobType}\`);
                const data = await response.json();
                resDiv.style.display = 'block';
                resDiv.innerHTML = formatResponse(data.ai_response);
            } catch (e) {
                resDiv.style.display = 'block';
                resDiv.innerHTML = '⚠️ Connection Error. Please try again.';
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
  const { country, type } = req.query;
  try {
    const completion = await groq.chat.completions.create({
      messages: [{ 
        role: "user", 
        content: \`Find 3 verified \${type} jobs in \${country} for 2026. 
        Use data from LinkedIn, Indeed, and Google Jobs. 
        For each, list: **Job Title**, **Company**, **Salary**, and a direct Search URL. 
        Make it look very professional.\` 
      }],
      model: "llama-3.1-8b-instant",
    });
    res.json({ ai_response: completion.choices[0].message.content });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = app;

