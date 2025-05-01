import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="container py-8 max-w-6xl">
      <div className="flex items-center mb-6">
        <Skeleton className="h-10 w-20 mr-4" />
        <Skeleton className="h-10 w-64" />
      </div>

      <Skeleton className="w-full h-[200px] mb-8" />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <Skeleton className="w-full h-[400px]" />
          <Skeleton className="w-full h-[300px]" />
        </div>
        <div className="lg:col-span-2">
          <Skeleton className="w-full h-[600px]" />
        </div>
      </div>
    </div>
  )
}

