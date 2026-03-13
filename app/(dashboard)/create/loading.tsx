import { Skeleton } from "@/components/ui/skeleton";

export default function CreateLoading() {
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="text-center">
        <Skeleton className="h-8 w-64 mx-auto mb-2" />
        <Skeleton className="h-5 w-80 mx-auto" />
      </div>
      <Skeleton className="h-10 w-64 mx-auto" />
      <Skeleton className="h-48 w-full rounded-xl" />
      <Skeleton className="h-12 w-40 mx-auto" />
    </div>
  );
}
