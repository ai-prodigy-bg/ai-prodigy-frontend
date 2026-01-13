# Visual Parity Guard (Home Page)

This project tracks visual parity at two checkpoints to ensure performance optimizations do not change the look or timing of the page.

## Option A: Playwright (recommended)

1. Start the app:
   ```bash
   pnpm dev
   ```
2. Run the screenshot script (requires Playwright):
   ```bash
   mkdir -p artifacts
   BASE_URL="http://localhost:3000" node scripts/visual-parity.mjs
   ```
3. Compare the two screenshots:
   - `artifacts/home-0_5s.png`
   - `artifacts/home-3_5s.png`

## Option B: Manual parity check (fallback)

1. Open `http://localhost:3000` in Chrome.
2. Capture screenshots at **0.5s** and **3.5s** after load.
   - Use DevTools → Performance panel to align timing.
3. Save the two images and compare for any visible deltas.
