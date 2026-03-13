import { Skeleton } from "@/components/ui/skeleton";

export default function StudyLoading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6">
      <Skeleton className="h-2 w-full max-w-md" />
      <Skeleton className="h-72 w-full max-w-lg rounded-2xl" />
      <div className="flex gap-3">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-12 w-24 rounded-lg" />
        ))}
      </div>
    </div>
  );
}
