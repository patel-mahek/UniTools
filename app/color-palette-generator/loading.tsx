export default function Loading() {
  return (
    <div className="container py-8 max-w-6xl">
      <div className="flex items-center mb-6">
        <div className="h-10 w-10 bg-muted rounded-md animate-pulse mr-4"></div>
        <div className="h-8 w-64 bg-muted rounded-md animate-pulse"></div>
      </div>

      <div className="h-40 w-full bg-muted rounded-xl animate-pulse mb-8"></div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <div className="h-80 w-full bg-muted rounded-xl animate-pulse"></div>
          <div className="h-60 w-full bg-muted rounded-xl animate-pulse"></div>
        </div>
        <div className="lg:col-span-2">
          <div className="h-[600px] w-full bg-muted rounded-xl animate-pulse"></div>
        </div>
      </div>
    </div>
  )
}

