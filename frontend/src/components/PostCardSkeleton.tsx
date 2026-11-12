export default function PostCardSkeleton() {
  return (
    <div className="card overflow-hidden">
      {/* Image skeleton */}
      <div className="aspect-[4/3] skeleton" />

      {/* Content */}
      <div className="p-3 space-y-2">
        <div className="skeleton h-3 w-20 rounded" />
        <div className="skeleton h-4 w-full rounded" />
        <div className="skeleton h-4 w-3/4 rounded" />
        <div className="skeleton h-6 w-24 rounded mt-1" />
        <div className="flex justify-between mt-2">
          <div className="skeleton h-3 w-20 rounded" />
          <div className="skeleton h-3 w-16 rounded" />
        </div>
      </div>
    </div>
  )
}
