import ErrorCat from "../components/ErrorCat"

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background">
      <ErrorCat
        title="Page not found"
        message="The page you're looking for doesn't exist. Our cat checked everywhere!"
        showRetry={false}
        size="lg"
      />
    </div>
  )
}
