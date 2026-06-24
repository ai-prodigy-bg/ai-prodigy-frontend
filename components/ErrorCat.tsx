"use client"

import { useRouter } from "next/navigation"

interface ErrorCatProps {
  title?: string
  message?: string
  showRetry?: boolean
  onRetry?: () => void
  size?: "sm" | "md" | "lg" | "xl"
}

export default function ErrorCat({
  title = "Something went wrong",
  message = "Please try again.",
  showRetry = true,
  onRetry,
  size = "lg",
}: ErrorCatProps) {
  const router = useRouter()

  const sizeConfig = {
    sm: { mark: "h-16 w-16 text-lg", title: "text-2xl", button: "px-4 py-2 text-sm" },
    md: { mark: "h-20 w-20 text-xl", title: "text-3xl", button: "px-5 py-2.5 text-sm" },
    lg: { mark: "h-24 w-24 text-2xl", title: "text-4xl", button: "px-6 py-3 text-sm" },
    xl: { mark: "h-28 w-28 text-3xl", title: "text-5xl", button: "px-8 py-4 text-base" },
  }

  const config = sizeConfig[size]

  const handleRetry = () => {
    if (onRetry) {
      onRetry()
      return
    }

    window.location.reload()
  }

  return (
    <div className="relative flex min-h-[70vh] items-center justify-center overflow-hidden bg-black px-6 py-24 text-center text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] bg-[length:24px_24px] opacity-[0.04]" />
      <div className="relative mx-auto flex max-w-xl flex-col items-center">
        <div className={`${config.mark} mb-8 flex items-center justify-center rounded-[18px] border border-white/10 bg-white/[0.06] font-bold text-white/80`}>
          PC
        </div>

        <p className="mb-5 text-[12px] uppercase tracking-[0.22em] text-white/35">Prodigy Corp</p>
        <h1 className={`${config.title} mb-5 font-normal leading-tight tracking-[-0.03em] text-white`}>{title}</h1>
        <p className="mb-8 max-w-md text-[14px] leading-relaxed text-white/50 sm:text-[15px]">{message}</p>

        <div className="flex flex-col justify-center gap-3 sm:flex-row">
          {showRetry && (
            <button
              type="button"
              onClick={handleRetry}
              className={`${config.button} rounded-full bg-white font-bold text-black transition-colors duration-200 hover:bg-[#e2e2e6]`}
            >
              Try Again
            </button>
          )}

          <button
            type="button"
            onClick={() => router.push("/")}
            className={`${config.button} rounded-full border border-white/15 bg-white/10 font-bold text-white transition-colors duration-200 hover:bg-white/15`}
          >
            Go Home
          </button>
        </div>
      </div>
    </div>
  )
}
