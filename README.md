# MealPrep — Family Meal Planning App

A mobile app for busy families to plan meals for the week, manage recipes, and coordinate family dietary needs.

---

## Live Preview

> **One-time setup required (2 minutes):**
> 1. Go to this repo on GitHub → **Settings** → **Pages**
> 2. Under *Source*, select **GitHub Actions**
> 3. Click Save
>
> After that, every push automatically deploys a live web preview. The URL will be:
> `https://june1220.github.io/mealprepapp`

---

## Features

- **Weekly Planner** — Tap any meal slot to assign a recipe. Swipe between days. See the whole week at a glance with colour-coded pip indicators.
- **Recipe Library** — Browse, search, and filter 10 built-in recipes. Add your own with a simple form.
- **Today's Meals** — Home screen shows exactly what's for breakfast, lunch, and dinner today — no digging required.
- **Family Profiles** — Add family members with dietary restrictions (gluten-free, vegetarian, nut-free, etc.)
- **Serving Scaler** — Recipe detail automatically scales ingredient quantities when you change servings.
- **Offline First** — Everything is saved locally on the device. Works without internet.

---

## App Screens

| Screen | What it does |
|---|---|
| Home | Today's meals + week summary + favourite recipes |
| Planner | Assign meals to any day, mark as cooked |
| Recipes | Browse/search/filter recipe library, add new recipes |
| Family | Manage family members and dietary preferences |

---

## Running Locally

### On your phone (easiest)

1. Install **Expo Go** — [iOS](https://apps.apple.com/app/expo-go/id982107779) · [Android](https://play.google.com/store/apps/details?id=host.exp.exponent)
2. Clone and start:
   ```bash
   git clone https://github.com/june1220/mealprepapp.git
   cd mealprepapp
   git checkout claude/meal-prep-app-design-vvpwn
   npm install
   npx expo start
   ```
3. Scan the QR code with your phone camera (iPhone) or Expo Go app (Android)

### In your browser (no phone needed)

```bash
npm install
npx expo start --web
```

Then press `w` or click **Open in Browser**.

### Using GitHub Codespaces (no local install)

1. Open the repo on GitHub
2. Click **Code** → **Codespaces** → **Create codespace**
3. In the terminal that opens:
   ```bash
   npm install
   npx expo start --web
   ```
4. Click **Open in Browser** when the popup appears

---

## Tech Stack

| | |
|---|---|
| Framework | React Native + Expo (iOS, Android, Web) |
| Navigation | Expo Router v4 (file-based) |
| Styling | NativeWind v4 (Tailwind CSS for React Native) |
| State | Zustand with AsyncStorage persistence |
| Lists | Shopify FlashList |
| Fonts | Inter (Google Fonts) |

---

## Design Decisions

This app was designed to fix 7 common problems with meal prep apps:

1. **Too many taps** → Recipe picker opens as a bottom sheet directly from the meal slot. Max 2 taps to assign a meal.
2. **Unusable weekly grid on small screens** → Horizontal swipe between days instead of a squished 7-column table.
3. **Blank empty state** → 10 seed recipes load automatically so there's something to work with immediately.
4. **Single-user thinking** → Family members and dietary restrictions are modelled from the start.
5. **No visual hierarchy** → Recipe cards put the image first, name second, metadata small.
6. **Breaks without internet** → All data is stored locally. No spinners, no failures.
7. **"What's for dinner?" buried** → Today's meals are the very first thing on the home screen.
