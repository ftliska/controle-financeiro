import { formatBRL } from "../Utils";
import { ArrowUpRight, ArrowDownRight, PiggyBank } from "lucide-react";

export default function CardsHome({ summary, setYear, year }) {
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear - 2 + i);

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Resumo</h2>
        <select
          value={year}
          onChange={(e) => setYear(Number(e.target.value))}
          className="bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
        >
          {years.map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>
      </div>
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-[#22242b] p-5 rounded-2xl shadow-lg border border-[#3d4047] hover:scale-[1.02] transition">
          <p className="flex items-center gap-2 text-sm text-zinc-400">
            <ArrowUpRight className="text-emerald-400" size={18} />
            Entradas
          </p>
          <p className="text-2xl font-semibold text-emerald-400 mt-2">
            {formatBRL(summary.entradas)}
          </p>
        </div>

        <div className="bg-[#22242b] p-5 rounded-2xl shadow-lg border border-[#3d4047] hover:scale-[1.02] transition">
          <p className="flex items-center gap-2 text-sm text-zinc-400">
            <ArrowDownRight className="text-red-400" size={18} />
            Saídas
          </p>
          <p className="text-2xl font-semibold text-red-400 mt-2">
            {formatBRL(summary.saidas)}
          </p>
        </div>

        <div className="bg-[#22242b] p-5 rounded-2xl shadow-lg border border-[#3d4047] hover:scale-[1.02] transition">
          <p className="flex items-center gap-2 text-sm text-zinc-400">
            <PiggyBank className="text-blue-400" size={18} />
            Economias
          </p>
          <p className="text-2xl font-semibold text-blue-400 mt-2">
            {formatBRL(summary.economias)}
          </p>
        </div>
      </div>
    </>
  );
}
