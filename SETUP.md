# FitForge — Setup Guide

## Step 1: Create a Supabase project

1. Go to https://supabase.com and create a free account
2. Click **New project** — choose a name like "fitforge"
3. After the project is created, go to **Settings → API**
4. Copy your **Project URL** and **anon public** key

## Step 2: Set up the database

1. In your Supabase dashboard, click **SQL Editor**
2. Paste the entire contents of `supabase/schema.sql`
3. Click **Run** — this creates all tables and Row Level Security policies

## Step 3: Get Nutritionix API credentials

1. Go to https://developer.nutritionix.com
2. Sign up for a free account
3. Create an application — you'll get an **App ID** and **API Key**
4. Free tier: 500 API calls/day (plenty for personal use)

## Step 4: Configure environment variables

Edit `.env.local` with your real credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=https://yourproject.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
NEXT_PUBLIC_NUTRITIONIX_APP_ID=your_app_id
NUTRITIONIX_API_KEY=your_api_key
```

## Step 5: Run locally

```bash
# Make sure you have Node 22 installed (nvm was already set up)
export NVM_DIR="$HOME/.nvm" && [ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"

cd ~/fitforge
npm run dev
# → Open http://localhost:3000
```

## Step 6: Deploy to Vercel (access from anywhere)

1. Push to GitHub:
   ```bash
   git add -A
   git commit -m "Initial FitForge app"
   # Create a repo on github.com, then:
   git remote add origin https://github.com/YOUR_USERNAME/fitforge.git
   git push -u origin main
   ```

2. Go to https://vercel.com → **Add New Project** → import your GitHub repo

3. In **Environment Variables**, add the same 4 variables from your `.env.local`

4. Click **Deploy** — you'll get a URL like `https://fitforge-abc123.vercel.app`

5. In Supabase → **Authentication → URL Configuration**, add your Vercel URL to:
   - **Site URL**: `https://yourapp.vercel.app`
   - **Redirect URLs**: `https://yourapp.vercel.app/**`

---

## Feature Tour

| Feature | Where |
|---|---|
| Create account / Sign in | `/auth/register` or `/auth/login` |
| Onboarding (goal, diet, equipment) | `/onboarding` — auto-redirected after signup |
| Dashboard (macros, today's workout, water) | `/dashboard` |
| Log food (Nutritionix search) | `/food` |
| Start/track workouts | `/workout` |
| Progress charts (weight, calories, workouts) | `/progress` |
| Update profile & recalculate macros | `/profile` |

## Plant-Based & Pescatarian Support

- Dietary preference is captured during onboarding
- Dashboard shows tailored protein source suggestions
- Macro calculations account for plant-based protein needs (higher targets)
- Workout recovery nutrition tips reflect your dietary preference

## Macro Calculation Method

- **TDEE**: Mifflin-St Jeor equation × activity multiplier
- **Goal adjustments**:
  - Lose weight / Burn fat: TDEE − 500 kcal
  - Gain muscle: TDEE + 300 kcal
  - Build strength: TDEE + 150 kcal
- **Protein**: 1.8–2.2g/kg (higher for muscle/strength goals)
- **Fat**: 25–28% of calories
- **Carbs**: Remaining calories
- **Fiber**: 14g per 1,000 kcal (DRI standard)
