# Dependency Cleanup Report

## Bundle Analysis Results

**Current Bundle Size:**
- Main page: **128 B** ✅ (down from 2,751 lines!)
- First Load JS: **158 kB** ✅

## 🗑️ Dependencies to Remove (Definitely Unused)

### 1. Entire Frameworks (Not Next.js)
These are completely unused and add significant bundle weight:
- `@remix-run/react` - Remix framework
- `@sveltejs/kit` - Svelte framework  
- `svelte` - Svelte framework
- `vue` - Vue framework
- `vue-router` - Vue router

**Impact:** These are large frameworks that shouldn't be in a Next.js project.

### 2. UI Component Libraries (Not Used in Main App)
The `components/ui` folder contains many components that are **never imported** in the main application. These can be removed along with their dependencies:

**UI Components Not Used:**
- All 50+ Radix UI components in `components/ui/` folder
- These are only used internally within the ui folder, not in the actual app

**Dependencies Only Used by Unused UI Components:**
- `recharts` (2.15.4) - Only in `chart.tsx`
- `embla-carousel-react` (8.5.1) - Only in `carousel.tsx`
- `cmdk` (1.0.4) - Only in `command.tsx`
- `vaul` (0.9.9) - Only in `drawer.tsx`
- `react-hook-form` (7.60.0) - Only in `form.tsx`
- `zod` (3.25.67) - Only in `form.tsx`
- `@hookform/resolvers` (3.10.0) - Only in `form.tsx`
- `date-fns` (4.1.0) - Only in `calendar.tsx` and `react-day-picker`
- `react-day-picker` (9.8.0) - Only in `calendar.tsx`
- `react-resizable-panels` (2.1.7) - Only in `resizable.tsx`
- `input-otp` (1.4.1) - Only in `input-otp.tsx`
- `sonner` (1.7.4) - Only in `sonner.tsx` and `toaster.tsx`
- `next-themes` (0.4.6) - Only in `theme-provider.tsx` and `sonner.tsx`

**Radix UI Packages (50+ packages):**
All `@radix-ui/react-*` packages are only used in unused UI components.

### 3. Other Unused Dependencies
- `@emotion/is-prop-valid` - Only used by framer-motion (kept by framer-motion)
- `nodemailer` (6.9.8) - Should be server-side only, not in client bundle
- `@types/nodemailer` - Dev dependency, can keep if needed for scripts

## ✅ Dependencies to Keep

- `framer-motion` - Used extensively for animations
- `@paper-design/shaders-react` - Used in ShaderBackground
- `@vercel/analytics` - Used in layout.tsx
- `lucide-react` - **ONLY used in unused UI components** - Can be removed
- `tailwind-merge`, `clsx`, `class-variance-authority` - Used for styling utilities
- `geist` - Font package
- `autoprefixer`, `postcss`, `tailwindcss` - Build tools

## 📊 Estimated Bundle Size Reduction

**Removing unused dependencies could save:**
- Frameworks: ~500-800 kB
- UI component libraries: ~200-400 kB
- Form/validation libraries: ~100-150 kB
- Chart/carousel libraries: ~150-200 kB

**Total potential savings: ~1-1.5 MB** (uncompressed)

## 🎯 Recommended Actions

### Priority 1: Remove Entire Frameworks
```bash
pnpm remove @remix-run/react @sveltejs/kit svelte vue vue-router
```

### Priority 2: Remove Unused UI Component Dependencies
Since the entire `components/ui` folder is unused, you can:
1. Delete the `components/ui` folder
2. Remove all related dependencies

```bash
# Remove UI component dependencies
pnpm remove recharts embla-carousel-react cmdk vaul react-hook-form zod @hookform/resolvers date-fns react-day-picker react-resizable-panels input-otp sonner next-themes

# Remove all Radix UI packages (50+ packages)
pnpm remove @radix-ui/react-accordion @radix-ui/react-alert-dialog @radix-ui/react-aspect-ratio @radix-ui/react-avatar @radix-ui/react-checkbox @radix-ui/react-collapsible @radix-ui/react-context-menu @radix-ui/react-dialog @radix-ui/react-dropdown-menu @radix-ui/react-hover-card @radix-ui/react-label @radix-ui/react-menubar @radix-ui/react-navigation-menu @radix-ui/react-popover @radix-ui/react-progress @radix-ui/react-radio-group @radix-ui/react-scroll-area @radix-ui/react-select @radix-ui/react-separator @radix-ui/react-slider @radix-ui/react-slot @radix-ui/react-switch @radix-ui/react-tabs @radix-ui/react-toast @radix-ui/react-toggle @radix-ui/react-toggle-group @radix-ui/react-tooltip
```

### Priority 3: Move nodemailer to devDependencies
```bash
pnpm remove nodemailer
pnpm add -D nodemailer @types/nodemailer
```

## ⚠️ Important Notes

1. **Tree-shaking**: Next.js should tree-shake unused code, but removing unused dependencies ensures they're not even installed.

2. **UI Components**: The `components/ui` folder appears to be from shadcn/ui but is completely unused. You can safely delete it if you're not planning to use those components.

3. **lucide-react**: Only used in unused UI components. Can be safely removed. If you need icons later, you can add it back or use a lighter alternative.

4. **After cleanup**: Run `pnpm build` again to see the new bundle size.

## 📈 Expected Results After Cleanup

- **First Load JS**: Should drop from 158 kB to ~100-120 kB
- **Total bundle size**: Significant reduction
- **Installation time**: Faster `pnpm install`
- **Build time**: Slightly faster builds
