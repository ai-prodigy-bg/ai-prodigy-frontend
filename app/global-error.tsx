"use client" // Error components must be Client Components

import { useEffect } from "react"
import ErrorCat from "../components/ErrorCat"

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error)
  }, [error])

  return (
    <html>
      <body>
        <div className="min-h-screen bg-background">
          <ErrorCat
            title="Critical Error"
            message="Something went seriously wrong. Our cat is working hard to fix this!"
            showRetry={true}
            onRetry={reset}
            size="xl"
          />
        </div>
      </body>
    </html>
  )
}
