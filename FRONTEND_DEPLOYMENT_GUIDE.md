# Frontend Deployment Guide

This guide covers everything you need to know about running the Next.js frontend application both locally and in a production environment (like Vercel or Render).

## 1. Local Development 💻

To run the application locally while you are developing:

1. **Install Dependencies:**
   ```bash
   npm install
   ```

2. **Environment Variables:**
   Make sure you have an `.env` or `.env.local` file in the root of your `todo-frontend-app` directory. It should contain the URL of your local backend:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:5000/api
   ```
   *(Adjust the port based on where your backend is running.)*

3. **Start the Development Server:**
   ```bash
   npm run dev
   ```
   The application will be accessible at `http://localhost:3000`.

---

## 2. Production Deployment 🚀

The simplest and most optimized way to deploy a Next.js frontend is via [Vercel](https://vercel.com). However, you can also easily deploy it to Render, Netlify, or any VPS.

### Option A: Deploying to Vercel (Highly Recommended)

Vercel is the creator of Next.js and provides zero-configuration deployments.

1. Create a free account on [Vercel](https://vercel.com/signup).
2. Click **Add New Project** and connect your GitHub repository.
3. Select the `todo-frontend-app` directory as the **Root Directory** (very important if this is a monorepo).
4. Vercel will auto-detect Next.js and pre-configure the build settings:
   - **Framework Preset:** Next.js
   - **Build Command:** `npm run build`
   - **Output Directory:** `.next`
5. **Environment Variables:**
   Add your backend URL under the Environment Variables section:
   - Key: `NEXT_PUBLIC_API_URL`
   - Value: `https://todo-backend-app-j942.onrender.com/api` *(Make sure to include `/api` if your backend routes require it).*
6. Click **Deploy**.

### Option B: Deploying to Render

Render is also a great option to keep everything in one dashboard.

1. Go to your Render Dashboard and click **New+** -> **Static Site** (Wait, Next.js using `App Router` often requires dynamic server-side rendering. If your app only uses client-side rendering or static generation, choose *Static Site*. If it uses Server Actions or SSR, you MUST choose **Web Service**).
   
   *Assuming your Next.js app needs SSR constraints (Web Service):*
2. Connect your GitHub repository.
3. Configure the settings:
   - **Name:** todo-frontend-app
   - **Root Directory:** `./todo-frontend-app` *(Important)*
   - **Environment:** Node
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `npm run start`
4. **Advanced -> Environment Variables:**
   - Key: `NEXT_PUBLIC_API_URL`
   - Value: `https://todo-backend-app-j942.onrender.com/api`
5. Click **Create Web Service**.

---

## 3. Local to Production (and Vice Versa) Summary

The single most critical difference between running locally and running in production is your **Environment Variables**. 

**Local (`.env.local`):**
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```
Whenever you are developing, your frontend is sending API requests to your local `localhost:5000` backend server.

**Production (Vercel/Render Dashboard):**
```env
NEXT_PUBLIC_API_URL=https://todo-backend-app-j942.onrender.com/api
```
When deployed, your frontend is securely bundled and configured to make API requests to your production backend.

### Quick Checklist for Deployment:
1. Ensure all changes are committed and pushed to GitHub.
2. Ensure the remote hosting provider is pointing to `NEXT_PUBLIC_API_URL`.
3. Ensure the exact build script `next build` is executing without TypeScript/ESLint errors locally before you push. You can test your production build locally by running:
   ```bash
   npm run build
   npm run start
   ```
