# Knee Rehab Tracker
**Hemophilia A — Right Knee Stabilization Protocol**

A 4-week rehab tracker built with Next.js + Tailwind, deployable to Vercel in minutes.

## Features
- 5 daily exercises with animated GIF tutorials
- Pain scale (0–10) with hemophilia-specific bleed warnings
- Session notes per day
- Weekly progress tracking
- Full report page with charts (Recharts)
- All data stored in browser localStorage

---

## Deploy to Vercel (3 steps)

### Option A — Vercel CLI (fastest)
```bash
npm install -g vercel
cd knee-rehab
npm install
vercel
```
Follow the prompts. Done.

### Option B — GitHub + Vercel Dashboard
1. Push this folder to a GitHub repo
2. Go to https://vercel.com/new
3. Import your repo → click Deploy
4. Vercel auto-detects Next.js. No config needed.

---

## Local development
```bash
npm install
npm run dev
# Open http://localhost:3000
```

---

## Project structure
```
src/
  app/
    globals.css       # Dark theme, fonts
    layout.tsx        # Root layout
    page.tsx          # Main tracker UI
  components/
    ExerciseModal.tsx # GIF tutorial modal
    Report.tsx        # Progress report with charts
  lib/
    data.ts           # Exercises, state, calc functions
```

---

## Customising exercises
Edit `src/lib/data.ts` → `EXERCISES` array. Each exercise has:
- `gifUrl` — any public GIF URL (Giphy works)
- `sets`, `detail` — instructions shown in modal
- `warning` — optional red warning shown in modal

---

## Notes
- Data is localStorage only — clearing browser data resets progress
- Designed specifically for Hemophilia A patients; pain warnings trigger at ≥7/10
- Not a substitute for medical advice from your hematologist
