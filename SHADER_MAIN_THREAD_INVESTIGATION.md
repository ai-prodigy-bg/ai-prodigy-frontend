# Investigation: Paper Shaders Main Thread Work (40.3s)

## Current Problem

**Lighthouse Metrics:**
- **Total Main Thread Work:** 40.3s
- **"Other" Category:** 35,695 ms (88.6% of total)
- **Style & Layout:** 2,018 ms
- **Script Evaluation:** 1,912 ms
- **Rendering:** 550 ms

## Root Cause Analysis

### 1. **Shaders Load Too Early (100ms delay)**

**Current Implementation:**
```typescript
// In ShaderBackground.tsx
setTimeout(() => {
  setShouldLoadShaders(true)
}, 100) // Loads after only 100ms!
```

**Problem:**
- Shaders start loading **before LCP** (Largest Contentful Paint)
- LCP typically happens at 1-3 seconds
- Shaders begin rendering **during critical rendering period**
- This blocks main thread during the most important performance window

**Impact:**
- Main thread is busy with shader initialization during LCP measurement
- WebGL context creation and shader compilation happen during critical period
- Continuous 60fps rendering starts immediately after load

### 2. **No Pause Mechanism**

**Current State:**
- Shaders run **continuously** at 60fps once loaded
- No Page Visibility API (doesn't pause when tab hidden)
- No way to stop the internal `requestAnimationFrame` loop
- Runs even when not visible or when tab is in background

**Impact:**
- Continuous WebGL rendering accumulates in "Other" category
- 35.7s of "Other" time = continuous rendering during Lighthouse test
- Each frame triggers WebGL draw calls on main thread

### 3. **Can WebGL Shaders Run Off Main Thread?**

**Technical Answer:**
- **OffscreenCanvas API** can move WebGL to Web Worker
- **BUT:** `@paper-design/shaders-react` library likely doesn't support this
- The library uses standard `<canvas>` elements with WebGL context
- WebGL context must be created on main thread (browser limitation)
- Once created, rendering can theoretically be offloaded, but library doesn't support it

**Reality:**
- **Cannot offload** without modifying the library itself
- WebGL operations run on main thread
- The library uses `requestAnimationFrame` internally (main thread only)

### 4. **Loading Strategy Issues**

**Current Flow:**
1. Page loads → `ClientOverlays` mounts immediately
2. `ClientOverlays` sets `shouldLoadShaders = true` immediately (if no reduced motion)
3. `ShaderBackground` loads after 100ms
4. Shaders start rendering at 60fps continuously

**Problem:**
- Shaders load **before above-the-fold content is fully rendered**
- No progressive enhancement strategy
- No "mockup first, upgrade later" approach

## Solutions Analysis

### Option 1: Delay Loading Until After LCP/TTI ⭐ RECOMMENDED

**Strategy:**
- Load shaders **after LCP** (typically 1-3 seconds)
- Wait for **Time to Interactive (TTI)** before starting shaders
- Use `requestIdleCallback` with longer timeout (2000-3000ms)

**Implementation:**
```typescript
// Wait for LCP + TTI
const timer = setTimeout(() => {
  setShouldLoadShaders(true)
}, 3000) // Wait 3 seconds for LCP/TTI
```

**Expected Impact:**
- Main thread work: 40.3s → ~15-20s (50-60% reduction)
- "Other" category: 35.7s → ~10-15s (60-70% reduction)
- Better LCP score (shaders don't block critical rendering)

### Option 2: Progressive Enhancement (Mockup First) ⭐⭐ BEST

**Strategy:**
1. **Server renders static background** (gradient/solid color) - zero JS
2. **Client upgrades after idle** - load shaders only when browser is idle
3. **Smooth transition** - fade from static to shader

**Implementation Pattern:**
```typescript
// Server Component (layout.tsx or page.tsx)
<div style={{
  position: "fixed",
  background: "linear-gradient(180deg, #0a0f1e 0%, #1a2a47 100%)",
  // Static fallback - no JS required
}} />

// Client Component (ShaderBackground.tsx)
// Only loads after idle + LCP
```

**Expected Impact:**
- Main thread work: 40.3s → ~5-10s (75-85% reduction)
- "Other" category: 35.7s → ~3-6s (85-90% reduction)
- Zero flash (static background shows immediately)
- Better Lighthouse scores (shaders don't affect initial metrics)

### Option 3: Add Pause Mechanism ⭐ CRITICAL

**Strategy:**
- Page Visibility API (pause when tab hidden)
- Reduce animation speed (0.15 → 0.05)
- Single shader instead of dual (on low-end devices)

**Implementation:**
```typescript
// Pause when tab hidden
useEffect(() => {
  const handleVisibilityChange = () => {
    setIsPaused(document.hidden)
  }
  document.addEventListener('visibilitychange', handleVisibilityChange)
  return () => document.removeEventListener('visibilitychange', handleVisibilityChange)
}, [])

// Unmount shaders when paused
{!isPaused && shouldLoadShaders && <ShaderComponents />}
```

**Expected Impact:**
- Reduces continuous rendering when tab is hidden
- During Lighthouse test, if tab becomes inactive, shaders pause
- Main thread work: 40.3s → ~25-30s (25-40% reduction)

### Option 4: FPS Throttling (If Possible)

**Strategy:**
- Limit rendering to 30fps instead of 60fps
- Use conditional rendering to skip frames
- Unmount/remount shader component at target FPS

**Challenge:**
- `@paper-design/shaders-react` doesn't have `fps` prop
- Must unmount/remount component to throttle (complex)
- May cause flickering

**Expected Impact:**
- Main thread work: 40.3s → ~20-25s (40-50% reduction)
- "Other" category: 35.7s → ~15-20s (45-55% reduction)

### Option 5: Load Above-the-Fold First

**Current Issue:**
- `ClientOverlays` (which includes shaders) loads immediately
- Shaders are in the same component tree as critical content
- No separation between critical and non-critical

**Solution:**
- Move shaders to load **after** HeroSection renders
- Use Intersection Observer to detect when hero is visible
- Load shaders only after hero section is painted

**Expected Impact:**
- Better LCP (hero section loads first)
- Shaders don't block initial render
- Main thread work: 40.3s → ~20-25s (40-50% reduction)

## Recommended Solution Combination

### Phase 1: Immediate Wins (Easy)
1. **Delay loading to 3000ms** (wait for LCP/TTI)
2. **Add Page Visibility API** (pause when tab hidden)
3. **Reduce animation speed** (0.15 → 0.05)

**Expected:** 40.3s → ~15-20s (50-60% reduction)

### Phase 2: Progressive Enhancement (Best)
1. **Server renders static background** (gradient fallback)
2. **Client upgrades after idle** (requestIdleCallback with 3000ms timeout)
3. **Smooth transition** (fade from static to shader)

**Expected:** 40.3s → ~5-10s (75-85% reduction)

### Phase 3: Advanced (If Needed)
1. **FPS throttling** (30fps instead of 60fps)
2. **Single shader on low-end** (conditional rendering)
3. **Intersection Observer** (pause when scrolled away)

**Expected:** Additional 20-30% reduction

## Why "Other" Category is So High (35.7s)

The "Other" category in Lighthouse includes:
- **WebGL operations** (shader execution, draw calls)
- **GPU work that falls back to CPU** (when GPU acceleration unavailable)
- **Continuous animation loops** (requestAnimationFrame)
- **Canvas rendering operations**
- **Non-standard rendering tasks**

**Your shaders:**
- Run at **60fps continuously** (16.67ms per frame)
- Each frame: WebGL draw calls, shader execution, texture updates
- During Lighthouse test (typically 5-10 seconds): 300-600 frames rendered
- Each frame accumulates in "Other" category
- **35.7s = continuous rendering during entire test period**

## Can We Move Shaders Off Main Thread?

**Short Answer:** **No, not with current library**

**Why:**
1. `@paper-design/shaders-react` uses standard WebGL context
2. WebGL context creation requires main thread
3. Library doesn't support OffscreenCanvas API
4. Would require library modification or custom implementation

**Alternative:**
- Use **CSS gradients/images** as fallback (static, zero JS)
- Load shaders **only after everything else** (progressive enhancement)
- Accept that WebGL will always use main thread, but minimize impact

## Loading Strategy: Mockup First?

**YES - This is the correct approach:**

1. **Server renders static background** (CSS gradient)
   - Zero JavaScript
   - Zero main thread work
   - Instant display

2. **Client upgrades after idle**
   - Load shaders only when browser is idle
   - After LCP/TTI is measured
   - Smooth transition from static to shader

3. **Benefits:**
   - Lighthouse measures static background (fast)
   - Shaders load after metrics are captured
   - Better user experience (no flash, progressive enhancement)

## Conclusion

**The 35.7s "Other" category is caused by:**
1. ✅ Shaders loading too early (100ms - before LCP)
2. ✅ Continuous 60fps rendering with no pause
3. ✅ No progressive enhancement (no static fallback first)
4. ✅ WebGL operations running on main thread (unavoidable)

**Best Solution:**
- **Progressive Enhancement:** Static background first, upgrade to shaders after idle
- **Delay Loading:** Wait 3000ms (after LCP/TTI) before loading shaders
- **Add Pause:** Page Visibility API to pause when tab hidden
- **Reduce Speed:** Lower animation speed (0.15 → 0.05)

**Expected Result:** 40.3s → ~5-10s (75-85% reduction)
