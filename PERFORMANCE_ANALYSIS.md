# Performance Analysis & Optimization Strategy
## AI Prodigy Frontend - Portfolio Website

**Date:** 2025-01-XX  
**Current Status:** Single-page portfolio with excessive JavaScript bundle size  
**Goal:** Reduce JS bundle by 60-80% while maintaining visual design

---

## 🎯 Quick Reference: Recommended Implementation Order

> **Critical:** This order matters! Architecture first, then loading, then cleanup.

### ✅ Step 1: Fix Architecture Boundary (BIGGEST WIN)
- Convert `app/page.tsx` to Server Component
- Render static sections as Server Components
- Only small interactive components are Client Components
- **Rule:** If it can render as plain HTML, it should be Server Component

### ✅ Step 2: Lazy-Load Expensive Effects
- `ShaderBackground` → dynamic import, `ssr: false`
- `LiquidCursor`, `MagneticElements` → dynamic import, `ssr: false`
- Load after first paint (don't block initial render)
- **Extra win:** Only load shaders on desktop + when `prefers-reduced-motion` is off

### ✅ Step 3: Replace Trivial Framer Motion with CSS
- Keep Framer Motion only for complex sequences
- Use CSS for: fades, slide-ins, hover transitions
- **Keep for:** Complex sequences, gestures, layout animations

### ✅ Step 4: Clean Dependencies (After Confirming Bundle)
- Run `next build --analyze` first
- Remove unused libs only after confirming they're bundled
- Fix icon imports (tree-shake properly)

### ⚠️ Watch-Outs:
1. **Layout Shift:** Skeletons must match real section height
2. **SEO:** Don't lazy-load critical content (server-render it)
3. **Hydration:** Guard browser APIs, avoid random/time in render

---

## 🔴 Critical Issues Identified

### 1. **Massive Client-Side Bundle**
- **Problem:** Entire `app/page.tsx` (2,751 lines) is marked `"use client"`
- **Impact:** All code loads upfront, including:
  - All animations (framer-motion)
  - All shader effects (@paper-design/shaders-react)
  - All interactive components
  - All sections (Hero, Projects, Services, About, Contact)
- **Solution:** Convert to Server Components where possible, use dynamic imports for heavy client components

### 2. **Unused Dependencies (Major Bloat)**
The following dependencies are in `package.json` but **NOT USED** in the codebase:

#### Completely Unused Frameworks (Remove Immediately):
- `@remix-run/react` - Remix framework (not Next.js)
- `@sveltejs/kit` - Svelte framework
- `svelte` - Svelte framework
- `vue` - Vue framework
- `vue-router` - Vue router
- **Impact:** These add ~500KB+ to node_modules but zero usage

#### Unused UI Component Libraries:
- `recharts` (2.15.4) - Chart library, no charts in portfolio
- `embla-carousel-react` (8.5.1) - Carousel, not used
- `cmdk` (1.0.4) - Command menu, not used
- `vaul` (0.9.9) - Drawer component, not used
- `react-hook-form` (7.60.0) - Form library, no forms
- `zod` (3.25.67) - Validation, not used
- `@hookform/resolvers` - Form resolvers, not used
- `date-fns` (4.1.0) - Date utilities, not used
- `react-day-picker` (9.8.0) - Date picker, not used
- `react-resizable-panels` (2.1.7) - Resizable panels, not used
- `input-otp` (1.4.1) - OTP input, not used
- `nodemailer` (6.9.8) - Email sending (should be server-side only)
- **Impact:** ~800KB+ of unused JavaScript

#### Unused Radix UI Components:
50+ Radix UI components installed, but **NONE are imported in `page.tsx`**:
- Only used indirectly through shadcn/ui components that aren't even used
- Most UI components in `/components/ui` are never imported
- **Impact:** ~400KB+ of unused component code

### 3. **No Code Splitting**
- **Problem:** Everything loads in one bundle
- **Current Structure:**
  ```tsx
  "use client" // Entire page is client-side
  import { motion, ... } from "framer-motion" // Full library
  import { DotGrid, NeuroNoise } from "@paper-design/shaders-react" // Full library
  ```
- **Solution:** Use `next/dynamic` for:
  - Heavy animations (framer-motion)
  - Shader effects (shaders-react)
  - Interactive components (LiquidCursor, MagneticElements)
  - Below-the-fold sections (Projects, Services, About, Contact)

### 4. **Heavy Libraries Loaded Upfront**

#### Framer Motion (Full Library)
- **Usage:** Used throughout for animations
- **Size:** ~50KB gzipped
- **Problem:** Entire library imported, even for simple animations
- **Solution:** 
  - Use dynamic imports for non-critical animations
  - Consider CSS animations for simple transitions
  - Lazy load animation components

#### @paper-design/shaders-react
- **Usage:** ShaderBackground component (DotGrid, NeuroNoise)
- **Size:** ~30-50KB gzipped
- **Problem:** Loaded immediately, blocks initial render
- **Solution:** Dynamic import with `ssr: false` (shaders are client-only)

#### Lucide React Icons
- **Usage:** Likely only a few icons used
- **Size:** Can be large if importing entire library
- **Solution:** Import only specific icons, or use dynamic imports

### 5. **Inefficient Component Structure**

#### Single Massive File
- **Problem:** `app/page.tsx` is 2,751 lines with all components inline
- **Components Defined:**
  - LiquidCursor
  - ScrollProgress
  - LoadingScreen
  - SmoothScroll
  - FloatingActionButton
  - MagneticElements
  - DrawingSVG
  - ShaderBackground
  - Navigation
  - MixedTypographyText
  - ProjectCard
  - ProjectsSection
  - MorphingNavigation
  - ServiceCard
  - ServicesSection
  - AnimatedAvatar
  - StatCounter
  - AboutSection
  - ContactSection
- **Solution:** Split into separate files, enable tree-shaking

### 6. **Client-Side Only Architecture**
- **Problem:** Everything is `"use client"`, no Server Components
- **Impact:** 
  - No server-side rendering benefits
  - All JavaScript must download before interactivity
  - Larger hydration payload
- **Solution:** Use Server Components for static content, Client Components only for interactivity

### 7. **Image Optimization Disabled**
```js
// next.config.mjs
images: {
  unoptimized: true, // ❌ Disabled optimization!
}
```
- **Problem:** Images not optimized, no WebP/AVIF conversion
- **Solution:** Enable Next.js image optimization or use ImageKit properly

---

## 📊 Estimated Bundle Size Impact

### Current State (Estimated):
- **Framer Motion:** ~50KB
- **Shaders React:** ~40KB
- **Unused Dependencies:** ~800KB (in node_modules, but may affect bundle)
- **Radix UI (unused):** ~400KB
- **Lucide Icons (full):** ~100KB
- **Total Estimated:** ~1.4MB+ JavaScript

### After Optimization (Target):
- **Framer Motion (dynamic):** ~20KB initial, rest lazy-loaded
- **Shaders (dynamic):** ~0KB initial, lazy-loaded
- **Removed unused:** ~800KB saved
- **Radix UI (tree-shaken):** ~50KB (only used components)
- **Lucide Icons (specific):** ~10KB
- **Total Target:** ~200-300KB initial bundle

**Potential Reduction: 70-80%**

---

## ✅ Optimization Strategy (Recommended Order)

> **Important:** This order matters! Fix architecture first, then optimize loading, then clean up dependencies. Doing it backwards can cause hydration issues and layout shifts.

### Phase 1: Fix Architecture Boundary (BIGGEST WIN)
**Priority: CRITICAL | Impact: VERY HIGH | Effort: MEDIUM**

**Goal:** Convert `app/page.tsx` to Server Component, render static content on server, only make interactive parts client-side.

#### 1.1 Convert page.tsx to Server Component
```tsx
// app/page.tsx (Server Component - default export)
export default function HomePage() {
  return (
    <main className="min-h-screen relative overflow-hidden">
      {/* Static sections - Server Components */}
      <HeroSection />
      <ProjectsSection />
      <ServicesSection />
      <AboutSection />
      <ContactSection />
      
      {/* Interactive overlays - Client Components (dynamic) */}
      <ClientOverlays />
    </main>
  )
}
```

#### 1.2 Rule: If it can render as plain HTML, it should be Server Component

**Server Components (Static Content):**
- Hero text content
- Project cards (static data)
- Service descriptions
- About section text
- Contact form structure (form can be client, but structure is server)
- Footer content

**Client Components (Interactive Only):**
- Navigation (interactive menu)
- LanguageSwitcher (interactive)
- LiquidCursor (mouse events)
- MagneticElements (mouse events)
- ScrollProgress (scroll events)
- SmoothScroll (click handlers)
- FloatingActionButton (interactive)
- Form interactions (if any)

#### 1.3 Split Components Properly
```
app/
  page.tsx (Server Component - orchestrates)
  components/
    hero/
      HeroSection.tsx (Server - static content)
      HeroContent.tsx (Client - animations only)
    projects/
      ProjectsSection.tsx (Server - static project data)
      ProjectCard.tsx (Server - static, or Client if interactive)
    services/
      ServicesSection.tsx (Server - static content)
    about/
      AboutSection.tsx (Server - static content)
    contact/
      ContactSection.tsx (Server - form structure)
      ContactForm.tsx (Client - form interactions)
    interactive/
      Navigation.tsx (Client - menu interactions)
      LiquidCursor.tsx (Client - mouse events)
      MagneticElements.tsx (Client - mouse events)
      ScrollProgress.tsx (Client - scroll events)
      SmoothScroll.tsx (Client - click handlers)
      FloatingActionButton.tsx (Client - interactive)
    shaders/
      ShaderBackground.tsx (Client - WebGL, ssr: false)
```

**Expected Savings:**
- Faster initial HTML (server-rendered)
- Smaller hydration payload
- Better SEO (content in HTML)
- ~200-300KB initial JS reduction

### Phase 2: Lazy-Load Expensive Effects
**Priority: HIGH | Impact: HIGH | Effort: LOW**

**Goal:** Don't block initial render with expensive visual effects.

#### 2.1 Dynamic Import ShaderBackground
```tsx
// app/page.tsx or layout
import dynamic from 'next/dynamic'

const ShaderBackground = dynamic(
  () => import('./components/shaders/ShaderBackground'),
  {
    ssr: false, // Shaders are client-only
    loading: () => (
      <div className="fixed inset-0 bg-background z-0" />
    )
  }
)

// Load after first paint
const ShaderBackgroundLazy = dynamic(
  () => import('./components/shaders/ShaderBackground'),
  {
    ssr: false,
    loading: () => null
  }
)

// In component:
useEffect(() => {
  // Load shaders after initial render
  const timer = setTimeout(() => {
    setShowShaders(true)
  }, 100)
  return () => clearTimeout(timer)
}, [])
```

#### 2.2 Dynamic Import Interactive Effects
```tsx
// Only load on desktop and when motion is preferred
const LiquidCursor = dynamic(
  () => import('./components/interactive/LiquidCursor'),
  {
    ssr: false,
    loading: () => null
  }
)

const MagneticElements = dynamic(
  () => import('./components/interactive/MagneticElements'),
  {
    ssr: false,
    loading: () => null
  }
)

// Conditional rendering
{typeof window !== 'undefined' && 
 !window.matchMedia('(prefers-reduced-motion: reduce)').matches &&
 window.innerWidth >= 768 && (
   <>
     <LiquidCursor />
     <MagneticElements />
   </>
 )}
```

#### 2.3 Extra Win: Conditional Shader Loading
```tsx
// Only load shaders on desktop + motion preference
const shouldLoadShaders = 
  typeof window !== 'undefined' &&
  window.innerWidth >= 768 &&
  !window.matchMedia('(prefers-reduced-motion: reduce)').matches

const ShaderBackground = shouldLoadShaders
  ? dynamic(() => import('./components/shaders/ShaderBackground'), {
      ssr: false,
      loading: () => <div className="fixed inset-0 bg-background" />
    })
  : () => <div className="fixed inset-0 bg-background" />
```

**Expected Savings:**
- Faster Time to Interactive
- Better LCP (no shader blocking)
- ~40-50KB initial bundle reduction
- Better performance on mobile (no shaders)

### Phase 3: Replace Trivial Framer Motion with CSS
**Priority: MEDIUM | Impact: MEDIUM | Effort: MEDIUM**

**Goal:** Keep Framer Motion only for complex sequences, use CSS for simple animations.

#### 3.1 Identify Trivial Animations
**Replace with CSS:**
- Simple fades (`opacity: 0 → 1`)
- Slide-ins (`transform: translateY`)
- Hover transitions (`scale`, `opacity`)
- Basic entrance animations

**Keep Framer Motion for:**
- Complex sequences (staggered animations)
- Gesture-based interactions (drag, swipe)
- Layout animations
- Shared element transitions
- Complex spring physics

#### 3.2 CSS Animation Examples
```tsx
// Instead of:
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5 }}
>
  Content
</motion.div>

// Use:
<div className="animate-fade-in-up">
  Content
</div>

// In globals.css:
@keyframes fade-in-up {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in-up {
  animation: fade-in-up 0.5s ease-out;
}
```

#### 3.3 Tailwind Animation Utilities
```tsx
// Use Tailwind's built-in animations
<div className="animate-fade-in">
<div className="animate-slide-up">
<div className="transition-all duration-300 hover:scale-105">
```

**Expected Savings:**
- ~30-50KB from reduced Framer Motion usage
- Better performance (CSS animations run on compositor)
- Smaller bundle for simple animations

### Phase 4: Clean Dependencies (After Confirming Bundle)
**Priority: MEDIUM | Impact: MEDIUM | Effort: LOW**

**⚠️ Important:** Only do this AFTER confirming what's actually bundled. Use `next build --analyze` first!

#### 4.1 Analyze Actual Bundle
```bash
# Install bundle analyzer
pnpm add -D @next/bundle-analyzer

# next.config.mjs
import bundleAnalyzer from '@next/bundle-analyzer'

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
})

export default withBundleAnalyzer(nextConfig)

# Run analysis
ANALYZE=true pnpm build
```

#### 4.2 Remove Unused Dependencies
Only remove what's confirmed unused in bundle:

```bash
# Completely unused frameworks
pnpm remove @remix-run/react @sveltejs/kit svelte vue vue-router

# Unused libraries (confirm first!)
pnpm remove recharts embla-carousel-react cmdk vaul react-hook-form zod @hookform/resolvers date-fns react-day-picker react-resizable-panels input-otp

# Move server-only to devDependencies
pnpm remove nodemailer
pnpm add -D nodemailer  # if needed for scripts
```

#### 4.3 Fix Icon Imports
```tsx
// ❌ Bad - imports entire library
import { Icon1, Icon2, Icon3 } from "lucide-react"

// ✅ Good - tree-shakeable
import Icon1 from "lucide-react/dist/esm/icons/icon1"
import Icon2 from "lucide-react/dist/esm/icons/icon2"

// Or ensure proper tree-shaking in build
```

#### 4.4 Audit Radix UI Components
- Check bundle analyzer for actual Radix imports
- Remove unused Radix packages
- Keep only what's actually bundled

**Expected Savings:**
- ~800KB from unused dependencies
- Smaller node_modules
- Faster installs

#### 2.1 Split Components into Separate Files
```
app/
  page.tsx (Server Component, minimal)
  components/
    hero/
      HeroSection.tsx
      HeroContent.tsx (Client)
    projects/
      ProjectsSection.tsx (Client, dynamic)
    services/
      ServicesSection.tsx (Client, dynamic)
    about/
      AboutSection.tsx (Client, dynamic)
    contact/
      ContactSection.tsx (Client, dynamic)
    interactive/
      LiquidCursor.tsx (Client, dynamic, ssr: false)
      MagneticElements.tsx (Client, dynamic, ssr: false)
      ScrollProgress.tsx (Client, dynamic)
    shaders/
      ShaderBackground.tsx (Client, dynamic, ssr: false)
    navigation/
      Navigation.tsx (Client)
      MorphingNavigation.tsx (Client, dynamic)
```

#### 2.2 Implement Dynamic Imports
```tsx
// app/page.tsx (Server Component)
import dynamic from 'next/dynamic'

// Heavy animations - lazy load
const LiquidCursor = dynamic(() => import('./components/interactive/LiquidCursor'), {
  ssr: false, // Client-only
  loading: () => null
})

const MagneticElements = dynamic(() => import('./components/interactive/MagneticElements'), {
  ssr: false,
  loading: () => null
})

// Shader effects - lazy load (client-only)
const ShaderBackground = dynamic(() => import('./components/shaders/ShaderBackground'), {
  ssr: false,
  loading: () => <div className="fixed inset-0 bg-background" />
})

// Below-the-fold sections - lazy load
const ProjectsSection = dynamic(() => import('./components/projects/ProjectsSection'), {
  loading: () => <ProjectsSectionSkeleton />
})

const ServicesSection = dynamic(() => import('./components/services/ServicesSection'), {
  loading: () => <ServicesSectionSkeleton />
})

const AboutSection = dynamic(() => import('./components/about/AboutSection'), {
  loading: () => <AboutSectionSkeleton />
})

const ContactSection = dynamic(() => import('./components/contact/ContactSection'), {
  loading: () => <ContactSectionSkeleton />
})
```

#### 2.3 Optimize Framer Motion Usage
```tsx
// Instead of importing entire library
import { motion, useInView, useScroll, AnimatePresence } from "framer-motion"

// Use dynamic imports for heavy animation components
const AnimatedSection = dynamic(() => import('./components/AnimatedSection'), {
  loading: () => <StaticSection />
})

// Or use CSS animations for simple cases
// Replace simple framer-motion animations with CSS transitions
```

**Expected Savings: ~300-400KB initial bundle**

### Phase 3: Server Components Architecture
**Priority: MEDIUM | Impact: MEDIUM | Effort: MEDIUM**

#### 3.1 Convert Static Content to Server Components
```tsx
// app/page.tsx (Server Component - default)
export default async function HomePage() {
  return (
    <main>
      {/* Static content - Server Component */}
      <HeroSection />
      
      {/* Client components - dynamic imports */}
      <Suspense fallback={<ProjectsSkeleton />}>
        <ProjectsSection />
      </Suspense>
      
      <Suspense fallback={<ServicesSkeleton />}>
        <ServicesSection />
      </Suspense>
    </main>
  )
}
```

#### 3.2 Identify What Needs to be Client-Side
**Must be Client:**
- LiquidCursor (uses mouse events)
- MagneticElements (uses mouse events)
- ScrollProgress (uses scroll events)
- Navigation (interactive)
- LanguageSwitcher (interactive)
- SmoothScroll (uses click events)
- FloatingActionButton (interactive)
- Form interactions (if any)

**Can be Server:**
- Static text content
- Static images
- Layout structure
- SEO metadata
- Translation loading (can be server-side)

**Expected Savings: Better hydration, faster initial load**

### Phase 4: Optimize Heavy Libraries
**Priority: MEDIUM | Impact: MEDIUM | Effort: LOW**

#### 4.1 Framer Motion
- Use dynamic imports for animation-heavy components
- Consider CSS animations for simple transitions
- Use `m` instead of `motion` for smaller bundle (if available)

#### 4.2 Shader Effects
- Load shaders only on desktop (already conditionally rendered)
- Use `ssr: false` (already client-only)
- Consider loading after initial page load

#### 4.3 Lucide Icons
```tsx
// Instead of:
import { Icon1, Icon2, ... } from "lucide-react"

// Use:
import Icon1 from "lucide-react/dist/esm/icons/icon1"
// Or tree-shake properly
```

**Expected Savings: ~50-100KB**

### Phase 5: Image Optimization
**Priority: LOW | Impact: MEDIUM | Effort: LOW**

```js
// next.config.mjs
images: {
  unoptimized: false, // Enable optimization
  formats: ['image/avif', 'image/webp'],
  deviceSizes: [640, 750, 828, 1080, 1200, 1920],
  imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
}
```

Or use ImageKit properly with Next.js Image component:
```tsx
import Image from 'next/image'

<Image
  src={imageKitUrl}
  alt="..."
  width={800}
  height={600}
  priority // For above-the-fold
  loading="lazy" // For below-the-fold
/>
```

**Expected Savings: Better LCP, reduced bandwidth**

---

## 🎯 Implementation Priority (Correct Order)

### Step 1: Fix Architecture Boundary (BIGGEST WIN)
**Time: 1-2 days | Impact: Very High**

1. ✅ Convert `app/page.tsx` to Server Component
2. ✅ Split components into Server/Client properly
3. ✅ Render static content as Server Components
4. ✅ Keep only interactive parts as Client Components
5. ✅ Test hydration (no mismatches)

**Rule:** If a section can render as plain HTML, it should be Server Component.

### Step 2: Lazy-Load Expensive Effects
**Time: 1 day | Impact: High**

1. ✅ Dynamic import ShaderBackground (ssr: false)
2. ✅ Dynamic import LiquidCursor (ssr: false)
3. ✅ Dynamic import MagneticElements (ssr: false)
4. ✅ Load after first paint (don't block initial render)
5. ✅ Conditional loading (desktop + prefers-reduced-motion)

**Extra Win:** Only load shaders on desktop when motion is preferred.

### Step 3: Replace Trivial Framer Motion with CSS
**Time: 1-2 days | Impact: Medium**

1. ✅ Identify trivial animations (fades, slides, hovers)
2. ✅ Replace with CSS animations/Tailwind utilities
3. ✅ Keep Framer Motion only for complex sequences
4. ✅ Test animation performance

**Keep Framer Motion for:** Complex sequences, gestures, layout animations.

### Step 4: Clean Dependencies (After Confirming Bundle)
**Time: 0.5 day | Impact: Medium**

1. ✅ Run bundle analyzer (`next build --analyze`)
2. ✅ Confirm what's actually bundled
3. ✅ Remove unused dependencies
4. ✅ Fix icon imports (tree-shake properly)
5. ✅ Audit Radix UI (remove unused)

**⚠️ Don't remove until you confirm it's in the bundle!**

---

## 📈 Expected Results

### Before:
- Initial JS Bundle: ~1.4MB
- Time to Interactive: ~3-5s
- First Contentful Paint: ~1.5-2s
- Largest Contentful Paint: ~2-3s

### After:
- Initial JS Bundle: ~200-300KB (70-80% reduction)
- Time to Interactive: ~1-2s (50-60% improvement)
- First Contentful Paint: ~0.8-1.2s (40-50% improvement)
- Largest Contentful Paint: ~1-1.5s (50% improvement)

---

## 🔍 Additional Considerations

### 1. Loading States
- Add proper Suspense boundaries
- Create skeleton loaders for each section
- Ensure no layout shift during loading

### 2. Progressive Enhancement
- Ensure core content works without JavaScript
- Enhance with JavaScript progressively
- Use CSS for simple animations where possible

### 3. Bundle Analysis
- Run `next build --analyze` to see actual bundle sizes
- Use `@next/bundle-analyzer` for detailed analysis
- Monitor bundle size in CI/CD

### 4. Performance Monitoring
- Set up performance budgets
- Monitor Core Web Vitals
- Track bundle size over time

---

## 🚨 Critical Watch-Outs (These Refactors Often Go Wrong)

### 1. Dynamic Imports Can Introduce Layout Shift ⚠️

**Problem:** If you lazy-load a section and it pushes content around, you trade JS gains for CLS (Cumulative Layout Shift).

**Solution:**
- **Reserve space** - Skeletons must match real section height
- Use `min-height` on containers
- Don't lazy-load above-the-fold content
- Test CLS score after changes

```tsx
// ✅ Good - reserves space
<Suspense fallback={<ProjectsSectionSkeleton />}>
  <ProjectsSection />
</Suspense>

// ProjectsSectionSkeleton must match ProjectsSection height
function ProjectsSectionSkeleton() {
  return (
    <section className="min-h-[800px]"> {/* Match real height */}
      {/* Skeleton content */}
    </section>
  )
}
```

### 2. Don't "Lazy Load" Critical Content for SEO ⚠️

**Problem:** If Projects/Services/About are important for SEO, lazy-loading them can hurt rankings.

**Solution:**
- **Server-render content** - Content should be in HTML
- **Only lazy-load interactions** - Enhance with client-side features
- Keep critical content in initial HTML

```tsx
// ✅ Good - Content in HTML, interactions lazy-loaded
<ProjectsSection /> {/* Server Component - content in HTML */}
<ProjectInteractions /> {/* Client Component - lazy-loaded */}

// ❌ Bad - Content lazy-loaded
const ProjectsSection = dynamic(() => import('./ProjectsSection'))
```

### 3. Mixing Server + Client Components Can Create Hydration Mismatches ⚠️

**Problem:** Anything that depends on `window`, random values, time, or screen size can cause hydration errors.

**Solution:**
- **Client-only for browser APIs** - `window`, `document`, `localStorage`
- **Use guards** - Check `typeof window !== 'undefined'`
- **Avoid random/time in render** - Use `useEffect` for client-only logic
- **Match server/client output** - Server and client must render same HTML initially

```tsx
// ❌ Bad - Hydration mismatch
function Component() {
  const isMobile = window.innerWidth < 768 // window not available on server
  return <div>{isMobile ? 'Mobile' : 'Desktop'}</div>
}

// ✅ Good - Client-only with guard
'use client'
function Component() {
  const [isMobile, setIsMobile] = useState(false)
  
  useEffect(() => {
    setIsMobile(window.innerWidth < 768)
  }, [])
  
  return <div>{isMobile ? 'Mobile' : 'Desktop'}</div>
}

// ✅ Better - Server renders default, client enhances
function Component() {
  return (
    <>
      <div className="hidden md:block">Desktop</div>
      <div className="md:hidden">Mobile</div>
      <ClientEnhancement />
    </>
  )
}
```

### 4. Don't Break Visual Design ⚠️

- All optimizations should be invisible to users
- Test on slow networks (3G throttling)
- Ensure animations still feel smooth
- Don't sacrifice UX for bundle size

### 5. Test Hydration Carefully ⚠️

- Check browser console for hydration warnings
- Test with React DevTools
- Verify server/client HTML matches
- Test with JavaScript disabled (should still work)

---

## 📝 Notes

- This is a portfolio website, so initial load time is critical
- Most users will only view the page once (first impression matters)
- Mobile performance is especially important
- Consider using `loading="eager"` for above-the-fold images
- Consider preloading critical resources

---

## Next Steps

1. Review this analysis
2. Prioritize optimizations based on impact/effort
3. Implement changes incrementally
4. Test after each phase
5. Measure and iterate
