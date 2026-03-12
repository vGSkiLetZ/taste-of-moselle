import { cn } from "@/lib/utils";

interface SkeletonProps {
  className?: string;
}

export default function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        "rounded-[var(--radius-badge)] bg-moselle-cream-dark skeleton-shimmer",
        className
      )}
    />
  );
}

export function CardSkeleton() {
  return (
    <div className="bg-moselle-cream rounded-[var(--radius-card)] overflow-hidden card-border-green shadow-[var(--shadow-card)]">
      <Skeleton className="h-48 w-full rounded-none" />
      <div className="p-4 space-y-3">
        <div className="flex items-center justify-between">
          <Skeleton className="h-6 w-20 rounded-full" />
          <Skeleton className="h-6 w-12 rounded-full" />
        </div>
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
      </div>
    </div>
  );
}

export function CardSkeletonGrid({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {Array.from({ length: count }).map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  );
}

export function HeroSkeleton() {
  return (
    <div className="relative h-[40vh] sm:h-[50vh] overflow-hidden">
      <Skeleton className="absolute inset-0 rounded-none" />
      <div className="absolute bottom-6 left-0 right-0 px-4">
        <div className="max-w-4xl mx-auto">
          <Skeleton className="h-8 w-24 rounded-full mb-3" />
          <Skeleton className="h-10 w-3/4 mb-2" />
          <Skeleton className="h-10 w-1/2" />
        </div>
      </div>
    </div>
  );
}

export function ArticleSkeleton() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
      <Skeleton className="h-6 w-48 rounded-full" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-5/6" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-3/4" />
    </div>
  );
}
