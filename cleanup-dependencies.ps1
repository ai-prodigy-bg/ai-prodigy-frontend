# PowerShell script to remove unused dependencies
# Run this from the ai-prodigy-frontend directory

Write-Host "🧹 Starting dependency cleanup..." -ForegroundColor Cyan

# Step 1: Remove entire frameworks (not Next.js)
Write-Host "`n📦 Step 1: Removing unused frameworks..." -ForegroundColor Yellow
pnpm remove @remix-run/react @sveltejs/kit svelte vue vue-router

# Step 2: Remove UI component dependencies (components/ui folder is unused)
Write-Host "`n📦 Step 2: Removing unused UI component dependencies..." -ForegroundColor Yellow
pnpm remove recharts embla-carousel-react cmdk vaul react-hook-form zod @hookform/resolvers date-fns react-day-picker react-resizable-panels input-otp sonner next-themes lucide-react

# Step 3: Remove all Radix UI packages (50+ packages)
Write-Host "`n📦 Step 3: Removing unused Radix UI packages..." -ForegroundColor Yellow
pnpm remove @radix-ui/react-accordion @radix-ui/react-alert-dialog @radix-ui/react-aspect-ratio @radix-ui/react-avatar @radix-ui/react-checkbox @radix-ui/react-collapsible @radix-ui/react-context-menu @radix-ui/react-dialog @radix-ui/react-dropdown-menu @radix-ui/react-hover-card @radix-ui/react-label @radix-ui/react-menubar @radix-ui/react-navigation-menu @radix-ui/react-popover @radix-ui/react-progress @radix-ui/react-radio-group @radix-ui/react-scroll-area @radix-ui/react-select @radix-ui/react-separator @radix-ui/react-slider @radix-ui/react-slot @radix-ui/react-switch @radix-ui/react-tabs @radix-ui/react-toast @radix-ui/react-toggle @radix-ui/react-toggle-group @radix-ui/react-tooltip

# Step 4: Move nodemailer to devDependencies (if needed for scripts)
Write-Host "`n📦 Step 4: Moving nodemailer to devDependencies..." -ForegroundColor Yellow
pnpm remove nodemailer
pnpm add -D nodemailer @types/nodemailer

# Step 5: Remove @emotion/is-prop-valid (only used by framer-motion, but framer-motion includes it)
Write-Host "`n📦 Step 5: Removing @emotion/is-prop-valid (included in framer-motion)..." -ForegroundColor Yellow
pnpm remove @emotion/is-prop-valid

Write-Host "`n✅ Dependency cleanup complete!" -ForegroundColor Green
Write-Host "`n📊 Next steps:" -ForegroundColor Cyan
Write-Host "1. Run 'pnpm build' to verify the build still works" -ForegroundColor White
Write-Host "2. Run 'ANALYZE=true pnpm build' to see new bundle size" -ForegroundColor White
Write-Host "3. Consider deleting the 'components/ui' folder if you're not using it" -ForegroundColor White
