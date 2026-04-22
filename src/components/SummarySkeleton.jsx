import Skeleton from "./Skeleton";

export default function SummarySkeleton() {
  return (
    <div className="grid grid-cols-3 gap-4 mb-6">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="p-4 rounded-2xl bg-[#1A1D26]/60 border border-white/5"
        >
          <Skeleton className="h-4 w-24 mb-3" />
          <Skeleton className="h-8 w-32" />
        </div>
      ))}
    </div>
  );
}
