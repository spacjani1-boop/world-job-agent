const express = require('express');
const app = express();
const Groq = require("groq-sdk");

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// --- FRONTEND DESIGN (HTML/CSS/JS) ---
const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Ghaffar AI - Ultimate Job Agent</title>
    <style>
        body { font-family: 'Segoe UI', sans-serif; background: #0f172a; color: white; display: flex; justify-content: center; align-items: center; min-height: 100vh; margin: 0; padding: 20px; }
        .container { background: #1e293b; padding: 30px; border-radius: 20px; box-shadow: 0 20px 50px rgba(0,0,0,0.5); text-align: center; max-width: 650px; width: 100%; border: 1px solid #334155; }
        h1 { color: #38bdf8; margin-bottom: 5px; font-size: 26px; }
        .status { color: #22c55e; font-size: 14px; margin-bottom: 20px; font-weight: bold; }
        
        /* CV Upload Section */
        .upload-section { background: #0f172a; padding: 15px; border-radius: 12px; margin-bottom: 20px; border: 1px dashed #38bdf8; }
        input[type="file"] { margin: 10px 0; font-size: 12px; }
        
        .btn { background: linear-gradient(135deg, #38bdf8 0%, #1d4ed8 100%); border: none; padding: 14px 30px; border-radius: 12px; color: white; font-weight: bold; cursor: pointer; font-size: 16px; transition: 0.3s; width: 100%; margin-top: 10px; }
        .btn:hover { transform: scale(1.01); box-shadow: 0 5px 15px rgba(56, 189, 248, 0.4); }
        
        #results { margin-
        
