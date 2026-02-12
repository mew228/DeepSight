# Deployment Guide to Render (Free Cloud Hosting)

Use this guide to keep your Backend **Always On** and accessible to everyone.

## Step 1: Push Code to GitHub
1. Create a new Repository on GitHub (e.g., `object-detection-backend`).
2. Push your `web-app` folder (or just the backend) to this repository.

## Step 2: Create Web Service on Render
1. Go to [dashboard.render.com](https://dashboard.render.com) and create a free account.
2. Click **New +** -> **Web Service**.
3. Connect your GitHub repository.
4. Configure the service:
   - **Root Directory:** `backend` (Important! Only if you pushed the whole web-app folder)
   - **Runtime:** `Docker`
   - **Instance Type:** `Free`
5. Click **Create Web Service**.

## Step 3: Connect Frontend
1. Once deployed, Render will give you a URL (e.g., `https://my-yolo-app.onrender.com`).
2. Open your local project: `frontend/src/App.jsx`.
3. Update the `API_URL` to point to this new Render link:
   ```javascript
   const API_URL = "https://my-yolo-app.onrender.com"; // Replace with your actual Render URL
   ```
4. Redeploy your frontend to Vercel:
   ```bash
   vercel --prod
   ```

## Why Render?
Vercel is great for websites (Frontend), but AI Backends are too heavy for Vercel's standard functions. Render provides a Docker container environment perfect for running `torch` and `YOLO`.
