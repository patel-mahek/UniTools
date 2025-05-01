import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="container py-8 max-w-6xl">
      <div className="flex items-center mb-6">
        <Skeleton className="h-10 w-10 rounded-md mr-4" />
        <Skeleton className="h-10 w-64 rounded-md" />
      </div>

      <Skeleton className="h-40 w-full rounded-md mb-8" />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="space-y-6">
          <Skeleton className="h-[400px] w-full rounded-md" />
        </div>
        <div className="lg:col-span-2">
          <Skeleton className="h-[500px] w-full rounded-md" />
        </div>
      </div>
    </div>
  )
}

