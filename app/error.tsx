"use client" // Error components must be Client Components

import { useEffect } from "react"
import ErrorCat from "../components/ErrorCat"

export default function Error({
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
    <div className="min-h-screen bg-background">
      <ErrorCat
        title="Something went wrong!"
        message="Our cat encountered an unexpected error. Don't worry, we're looking into it."
        showRetry={true}
        onRetry={reset}
        size="lg"
      />
    </div>
  )
}
