import { Skeleton } from "@/components/ui/skeleton";

export default function ExamPredictorLoading() {
  return (
    <div className="space-y-6 animate-in-up">
      <div>
        <Skeleton className="h-8 w-56" />
        <Skeleton className="h-4 w-80 mt-2" />
      </div>
      <Skeleton className="h-[400px] rounded-xl" />
    </div>
  );
}
