import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="container py-10">
      <div className="flex flex-col items-center justify-center mb-8">
        <Skeleton className="h-16 w-16 rounded-full" />
        <Skeleton className="h-8 w-64 mt-4" />
        <Skeleton className="h-4 w-96 mt-2" />
      </div>

      <div className="max-w-5xl mx-auto">
        <Skeleton className="h-10 w-full mb-4" />

        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-[300px] w-full" />
            <div className="flex justify-between">
              <Skeleton className="h-10 w-32" />
              <Skeleton className="h-10 w-32" />
            </div>
          </div>

          <div className="space-y-4">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-[300px] w-full" />
            <div className="flex justify-between">
              <Skeleton className="h-10 w-32" />
              <Skeleton className="h-10 w-32" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

