const express = require('express');
const app = express();
const Groq = require("groq-sdk");

// Groq API Initialize
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// --- FRONTEND DESIGN ---
const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Global Job Scout | AI Powered</title>
    <style>
        :root { --primary: #38bdf8; --bg: #020617; --accent: #22c55e; }
        body { font-family: 'Inter', sans-serif; background: var(--bg); color: white; margin: 0; padding: 20px; display: flex; flex-direction: column; align-items: center; min-height: 100vh; }
        
        .status-bar { display: inline-flex; align-items: center; background: rgba(34, 197, 94, 0.1); padding: 6px 16px; border-radius: 50px; margin-bottom: 20px; border: 1px solid rgba(34, 197, 94, 0.2); }
        .dot { height: 8px; width: 8px; background-color: var(--accent); border-radius: 50%; display: inline-block; margin-right: 10px; box-shadow: 0 0 10px var(--accent); animation: pulse 1.5s infinite; }
        @keyframes pulse { 0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.7); } 70% { transform: scale(1); box-shadow: 0 0 0 10px rgba(34, 197, 94, 0); } 100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(34, 197, 94, 0); } }
        
        .container { background: rgba(30, 41, 59, 0.5); backdrop-filter: blur(12px); padding: 40px; border-radius: 28px; box-shadow: 0 25px 50px rgba(0,0,0,0.6); text-align: center; max-width: 600px; width: 100%; border: 1px solid rgba(255,255,255,0.05); }
        h1 { font-size: 2.2rem; background: linear-gradient(to right, #fff, #94a3b8); -webkit-background-clip: text; -webkit-text-fill-color: transparent; margin: 0; }
        p { color: #94a3b8; font-size: 14px; margin: 10px 0 30px; }

        .filters { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 30px; }
        .input-group { text-align: left; }
        label { font-size: 11px; color: var(--primary); font-weight: bold; letter-spacing: 1px; text-transform: uppercase; margin-left: 5px; }
        select { background: #1e293b; border: 1px solid #334155; color: white; padding: 12px; border-radius: 12px; width: 100%; margin-top: 8px; cursor: pointer; }

        .btn { background: #fff; color: #000; border: none; padding: 16px; border-radius: 12px; font-weight: 800; cursor: pointer; width: 100%; font-size: 16px; transition: 0.3s; }
        .btn:hover { background: var(--primary); color: #fff; transform: translateY(-2px); }

        #results { margin-top: 30px; text-align: left; background: rgba(15, 23, 42, 0.9); padding: 25px; border-radius: 18px; display: none; border: 1px solid #334155; line-height: 1.8; }
        .apply-btn { background: var(--primary); color: #020617; padding: 8px 18px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 13px; display: inline-block; margin-top: 10px; }
        
        footer { margin-top: auto; padding: 40px 0 20px; text-align: center; font-size: 12px; color: #475569; }
        .loader { border: 2px solid #f3f3f3; border-top: 2px solid var(--primary); border-radius: 50%; width: 20px; height: 20px; animation: spin 0.8s linear infinite; display
        
