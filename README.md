# 🚀 SpaceOS — Space Dashboard

A responsive, space-themed dashboard built with **React + Vite + Tailwind CSS** featuring live ISS tracking, space & tech news, an AI chatbot, and analytics.

---

## ✨ Features

| Feature | Status |
|---|---|
| 🛰️ ISS Live Tracker (every 15s, Haversine speed, Leaflet map) | Phase 2 |
| 📰 News Dashboard (space + tech, cache, search, sort) | Phase 2 |
| 🤖 AI Chatbot (Mistral-7B via Hugging Face) | Phase 2 |
| 📊 Charts (Recharts speed line + news pie) | Phase 2 |
| 🌙 Dark / Light mode (localStorage) | ✅ Done |
| 📱 Mobile responsive layout | ✅ Done |
| 🔔 Toast notifications | ✅ Done |
| ⚡ Clean folder structure & hooks | ✅ Done |

---

## 📁 Folder Structure

```
src/
├── components/         # Reusable UI components
│   ├── ISSCard.jsx       — Stat card for ISS data
│   ├── NewsCard.jsx      — News article card
│   ├── ChatWindow.jsx    — Floating chatbot widget
│   └── ChartContainer.jsx — Chart wrapper
├── pages/              # Route-level pages
│   ├── ISSTracker.jsx
│   ├── NewsDashboard.jsx
│   ├── Chatbot.jsx
│   └── Charts.jsx
├── layouts/            # Shared layout components
│   ├── MainLayout.jsx
│   ├── Navbar.jsx
│   └── Sidebar.jsx
├── hooks/              # Custom React hooks
│   ├── useISSData.js     — ISS fetch + Haversine speed
│   └── useNewsData.js    — News fetch + 15min cache
├── context/            # React context providers
│   ├── ThemeContext.jsx   — Dark/light mode
│   └── ToastContext.jsx   — Toast notifications
├── utils/
│   └── distance.js       — Haversine formula + helpers
└── index.css           # Global styles + design tokens
```

---

## 🔑 Environment Variables

### Where to get your keys

#### 1. News API Key
1. Go to [https://newsapi.org/register](https://newsapi.org/register)
2. Sign up for a free account
3. Copy the API key from your dashboard

#### 2. Hugging Face Token
1. Sign up or log in at [https://huggingface.co](https://huggingface.co)
2. Go to **Settings → Access Tokens** → [https://huggingface.co/settings/tokens](https://huggingface.co/settings/tokens)
3. Click **New token** → Role: `Read` → Create
4. Copy the token (starts with `hf_...`)

#### Where to paste the token in code
The token is used in `src/pages/Chatbot.jsx` inside the API call:
```js
headers: {
  Authorization: `Bearer ${import.meta.env.VITE_AI_TOKEN}`,
  'Content-Type': 'application/json',
}
```

### Setup locally

```bash
# 1. Copy the example env file
cp .env.example .env

# 2. Edit .env and fill in your keys
nano .env   # or open in your editor
```

Your `.env` should look like:
```env
VITE_NEWS_API_KEY=abc123yourkeyhere
VITE_AI_TOKEN=hf_yourhuggingfacetoken
```

---

## 🚀 Local Development

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

App runs at → **http://localhost:5173**

---

## ☁️ Deploy to Vercel

### Option 1 — Vercel CLI
```bash
npm install -g vercel
vercel login
vercel --prod
```

### Option 2 — Vercel Dashboard (GitHub)
1. Push your code to a GitHub repository
2. Go to [https://vercel.com/new](https://vercel.com/new)
3. Import your GitHub repository
4. **Add Environment Variables** in the Vercel dashboard:
   - Go to your project → **Settings → Environment Variables**
   - Add `VITE_NEWS_API_KEY` → paste your News API key
   - Add `VITE_AI_TOKEN` → paste your Hugging Face token
   - Click **Save**
5. Click **Deploy**

> ⚠️ **Important:** Never commit your `.env` file. It is already listed in `.gitignore`.

### How to add env variables in Vercel
```
Vercel Dashboard
  └── Your Project
        └── Settings
              └── Environment Variables
                    ├── Name:  VITE_NEWS_API_KEY  │ Value: your_key
                    └── Name:  VITE_AI_TOKEN      │ Value: hf_your_token
```
After adding variables, **redeploy** the project for changes to take effect.

---

## 🧩 Tech Stack

| Library | Purpose |
|---|---|
| React 18 | UI framework |
| Vite 6 | Build tool |
| Tailwind CSS v4 | Styling |
| React Router v6 | Client-side routing |
| Lucide React | Icons |
| Leaflet + react-leaflet | ISS map (Phase 2) |
| Recharts | Charts (Phase 2) |
| Hugging Face Inference API | AI chatbot |
| NewsAPI.org | News articles |
| Open Notify API | ISS position + crew |

---

## 📜 License

MIT — free to use and modify.
