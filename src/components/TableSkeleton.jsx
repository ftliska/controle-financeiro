import Skeleton from "./Skeleton";

export default function TableSkeleton({ rows = 5, cols = 13 }) {
  return (
    <div className="border border-[#3d4047] rounded-xl overflow-hidden">
      <table className="w-full text-sm table-fixed">
        <thead className="bg-[#22242b]">
          <tr>
            {Array.from({ length: cols }).map((_, i) => (
              <th key={i} className="p-2">
                <Skeleton className="h-4 w-full" />
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {Array.from({ length: rows }).map((_, r) => (
            <tr key={r} className="border-t border-[#3d4047]">
              {Array.from({ length: cols }).map((_, c) => (
                <td key={c} className="p-2">
                  <Skeleton className="h-4 w-full" />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
