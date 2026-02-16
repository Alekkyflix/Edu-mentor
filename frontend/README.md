# EduMentor AI Frontend

> Gamified AI tutoring interface with Nairobi cultural context

![Next.js](https://img.shields.io/badge/Next.js-14-black) ![TypeScript](https://img.shields.io/badge/TypeScript-5-blue) ![Tailwind](https://img.shields.io/badge/Tailwind-3.4-cyan)

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18+ ([Download](https://nodejs.org/))
- **npm** or **yarn**

### Installation

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install
```

### Running Development Server

```bash
npm run dev
```

**Frontend will start at**: [http://localhost:3000](http://localhost:3000)

### Available Pages

| Page | URL | Description |
|------|-----|-------------|
| **Landing** | `/` | Hero, features, phone preview |
| **Chat** | `/chat` | Main learning interface |
| **Dashboard** | `/dashboard` | Progress & achievements |

---

## 🔧 Development Commands

```bash
# Start dev server (with hot reload)
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Lint code
npm run lint
```

---

## 🔌 Backend Connection

The frontend expects the **FastAPI backend** to be running on `http://localhost:8000`.

### Start Backend First

```bash
# In a separate terminal
cd ../backend
python -m uvicorn app.main:app --reload --port 8000
```

### API Proxy Configuration

All `/api/*` requests are automatically proxied to the backend (configured in [`next.config.js`](file:///home/flix/Desktop/Edumentor%20AI/frontend/next.config.js)).

**Example**:
- Frontend calls: `fetch('/api/chat', ...)`
- Proxied to: `http://localhost:8000/chat`

---

## 📦 Dependencies

Key libraries used:

| Library | Purpose |
|---------|---------|
| **Next.js 14** | React framework with App Router |
| **Framer Motion** | Smooth animations (confetti, slides) |
| **Recharts** | Charts (weekly progress, radar) |
| **canvas-confetti** | Achievement celebrations |
| **Lucide React** | Icon library |
| **Tailwind CSS** | Styling with Nairobi theme |

---

## 🎨 Features Overview

### Landing Page (`/`)
- Animated hero with Nairobi sunset gradient
- Phone mockup with live chat preview
- Stats showcase & feature cards

### Chat Interface (`/chat`)
- WhatsApp-style messages
- Voice button with pulse animation
- Real-time **Struggle Meter** (🟢🟡🔴)
- **XP progress bar** with shimmer effect
- **Streak counter** (🔥 7 days)
- **Achievement popups** with confetti 🎉
- Agent switching (Imani → The Professor)

### Dashboard (`/dashboard`)
- Level, XP, streak, rank cards
- Weekly progress chart
- Topic mastery bars
- Achievement gallery (9 badges)
- Recent activity feed

---

## 🎮 Gamification System

| Element | Description |
|---------|-------------|
| **XP & Levels** | Earn XP, unlock levels (currently Level 5) |
| **Streaks** | Daily login tracking (🔥 fire emoji) |
| **Achievements** | "Matatu Master", "M-Pesa Mathematician", etc. |
| **Leaderboard** | Rank among peers (#15) |
| **Confetti** | Celebration animations on milestones |

---

## 🇰🇪 Nairobi Theme

### Color Palette
```css
Sunset Orange: #FF6B35  (Primary CTA)
Matatu Yellow: #FFD23F  (Highlights, badges)
Deep Teal:     #006D77  (Secondary actions)
Charcoal:      #1A1A2E  (Background)
```

### Sheng Phrases
- **"Sasa!"** - What's up?
- **"Twende kazi!"** - Let's work!
- **"Poa"** - Cool, nice
- **"Ebu tufikirie"** - Let's think

### Local Context
- M-Pesa for math examples
- Matatu routes for problem-solving
- Kenyan football references

---

## 📱 Responsive Design

- **Mobile** (<640px): Single column, touch-optimized
- **Tablet** (640-1024px): 2-column grid
- **Desktop** (>1024px): Full 3-column layout

---

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Kill process on port 3000
npx kill-port 3000

# Or use a different port
npm run dev -- -p 3001
```

### Dependencies Not Installing
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Backend API Not Connecting
1. Ensure backend is running on `http://localhost:8000`
2. Check [`next.config.js`](file:///home/flix/Desktop/Edumentor%20AI/frontend/next.config.js) proxy settings
3. Verify CORS is enabled in FastAPI backend

### Build Errors
```bash
# Clean build cache
rm -rf .next
npm run build
```

---

## 📂 Project Structure

```
frontend/
├── app/
│   ├── page.tsx              # Landing page
│   ├── chat/page.tsx         # Chat interface
│   ├── dashboard/page.tsx    # Dashboard
│   ├── globals.css           # Global styles + animations
│   └── layout.tsx            # Root layout
├── public/                   # Static assets
├── tailwind.config.ts        # Tailwind + Nairobi theme
├── next.config.js            # Next.js config + API proxy
├── package.json
└── tsconfig.json
```

---

## 🔮 Next Steps

Once the frontend is running:

1. **Explore the UI**:
   - Landing page animations
   - Chat with voice button
   - Dashboard with charts

2. **Connect to real backend**:
   - Currently uses mock data
   - Wire up actual API calls when backend is ready

3. **Test gamification**:
   - Send messages to trigger achievement popups
   - Watch XP bar fill up
   - See confetti celebrations

---

## ⚡ Production Deployment

### Build Optimized Bundle
```bash
npm run build
```

### Serve Production Build
```bash
npm start
```

Production build includes:
- Minified JS/CSS
- Image optimization
- Code splitting
- Server-side rendering

---

## 📞 Support

- **Issues**: Check browser console for errors
- **Backend**: Ensure FastAPI is running
- **Styling**: Tailwind classes defined in [`globals.css`](file:///home/flix/Desktop/Edumentor%20AI/frontend/app/globals.css)

---

**Built with ❤️ for Nairobi students**
