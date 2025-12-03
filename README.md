# 🎨 Background Remover - AI-Powered Tool

Remove image backgrounds instantly with AI. Built for monetization with ad placements.

## 🚀 Quick Deploy (5 Minutes)

### Backend → Render.com

1. **Push to GitHub**
   ```bash
   cd backend
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin YOUR_GITHUB_REPO
   git push -u origin main
   ```

2. **Deploy on Render**
   - Go to [Render.com](https://render.com)
   - Click "New +" → "Web Service"
   - Connect your GitHub repo
   - Select `backend` folder as root directory
   - Render will auto-detect `render.yaml`
   - Add environment variables:
     - `RAPIDAPI_KEY`: Your RapidAPI key for Background Removal API
     - `FRONTEND_URL`: Your Vercel URL (add after frontend deploy)
   - Click "Create Web Service"
   - Copy your backend URL (e.g., `https://your-app.onrender.com`)

### Frontend → Vercel

1. **Create `.env` file in frontend folder**
   ```bash
   cd frontend
   echo "VITE_API_URL=https://your-backend-url.onrender.com" > .env
   ```

2. **Deploy on Vercel**
   ```bash
   npm install -g vercel
   cd frontend
   vercel
   ```
   - Follow prompts
   - Select "frontend" as root directory
   - Add environment variable in Vercel dashboard:
     - `VITE_API_URL`: Your Render backend URL
   - Done! Your app is live

3. **Update Backend CORS**
   - Go back to Render dashboard
   - Add `FRONTEND_URL` environment variable with your Vercel URL
   - Redeploy backend

## 💻 Local Development

### Backend

```bash
cd backend
npm install
cp .env.example .env
# Edit .env and add your RAPIDAPI_KEY
npm run dev
```

Backend runs on `http://localhost:4000`

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on `http://localhost:5173`

Create `.env.local` in frontend:
```
VITE_API_URL=http://localhost:4000
```

## 🔑 API Setup

1. Go to [RapidAPI](https://rapidapi.com)
2. Subscribe to "Background Removal" API by api4ai
3. Copy your API key
4. Add to backend `.env` file

## 📁 Project Structure

```
/
├── backend/
│   ├── src/
│   │   └── server.ts          # Express server with background removal API
│   ├── package.json
│   ├── tsconfig.json
│   ├── render.yaml            # Render deployment config
│   └── .env.example
│
├── frontend/
│   ├── src/
│   │   ├── main.tsx
│   │   ├── App.tsx
│   │   ├── lib/
│   │   │   └── api.ts         # API client
│   │   └── components/
│   │       ├── Header.tsx
│   │       ├── ThemeToggle.tsx
│   │       ├── UploadZone.tsx
│   │       ├── ProcessingSpinner.tsx
│   │       ├── BeforeAfterPreview.tsx
│   │       └── DownloadButton.tsx
│   ├── index.html
│   ├── tailwind.config.cjs
│   ├── vite.config.ts
│   └── package.json
│
└── README.md
```

## 💰 Monetization

The app has **4 ad slots** marked with `<!-- ADS HERE -->`:

1. **Top Banner** - Below header
2. **Below Upload** - After upload zone
3. **Between Preview & Download** - High engagement area
4. **Bottom** - Before footer

Replace `<!-- ADS HERE -->` comments with your ad code (Google AdSense, etc.)

## 🎨 Features

- ✅ AI-powered background removal
- ✅ Drag & drop upload
- ✅ Before/After preview
- ✅ Dark mode toggle
- ✅ Mobile responsive
- ✅ Modern UI with Tailwind CSS
- ✅ 4 ad placement slots
- ✅ Fast & optimized

## 🛠️ Tech Stack

**Backend:**
- Node.js 20
- Express + TypeScript
- api4ai Background Removal API
- CORS, Helmet, Rate Limiting

**Frontend:**
- React 18
- Vite
- TypeScript
- Tailwind CSS
- Axios

## 📝 Environment Variables

**Backend (.env):**
```
PORT=4000
RAPIDAPI_KEY=your_rapidapi_key
RAPIDAPI_HOST=background-removal3.p.rapidapi.com
FRONTEND_URL=https://your-vercel-app.vercel.app
```

**Frontend (.env):**
```
VITE_API_URL=https://your-backend.onrender.com
```

## 🚨 Troubleshooting

**CORS Error:**
- Make sure `FRONTEND_URL` is set correctly in backend
- Redeploy backend after changing env vars

**API Error:**
- Check your RapidAPI key is valid
- Verify you have API credits remaining

**Build Error:**
- Run `npm install` in both folders
- Check Node.js version (20.x required)

## 📄 License

MIT

---

Built with ❤️ for rapid MVP deployment
