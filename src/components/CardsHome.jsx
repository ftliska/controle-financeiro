import { MONTHS } from "../Constants";
import { formatBRL, getVariation } from "../Utils";
import {
  ArrowUpRight,
  ArrowDownRight,
  PiggyBank,
  TrendingUp,
  TrendingDown,
  DollarSign,
} from "lucide-react";

const Variation = ({ value }) => {
  if (value === null) return null;

  const isPositive = value >= 0;

  return (
    <div
      className={`flex items-center gap-1 text-xs mt-1 ${
        isPositive ? "text-emerald-400" : "text-red-400"
      }`}
    >
      {isPositive ? <TrendingUp size={14} /> : <TrendingDown size={14} />}

      <span>{Math.abs(value).toFixed(1)}%</span>
    </div>
  );
};

export default function CardsHome({
  summary,
  summaryPrevYear,
  setYear,
  year,
  datasetEntradas,
  datasetSaidas,
  datasetEconomias,
}) {
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear - 2 + i);

  const getMonthTotals = (dataset) => {
    const categorias = Object.keys(dataset);

    return MONTHS.map((_, monthIndex) =>
      categorias.reduce((sum, cat) => {
        return sum + (dataset[cat]?.[monthIndex] || 0);
      }, 0),
    );
  };

  const monthTotalsEntradas = getMonthTotals(datasetEntradas);

  const monthTotalsSaidas = getMonthTotals(datasetSaidas);

  const monthTotalsEconomias = getMonthTotals(datasetEconomias);

  const variationEntradas = getVariation(
    summary.entradas,
    summaryPrevYear.entradas,
  );

  const variationSaidas = getVariation(summary.saidas, summaryPrevYear?.saidas);

  const variationEconomias = getVariation(
    summary.economias,
    summaryPrevYear?.economias,
  );

  const saldo = summary.entradas - summary.saidas - summary.economias;

  const saldoPrev =
    (summaryPrevYear?.entradas || 0) -
    (summaryPrevYear?.saidas || 0) -
    (summaryPrevYear?.economias || 0);

  const variationSaldo = getVariation(saldo, saldoPrev);

  return (
    <>
      <div className="flex justify-center items-center mb-6">
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
      <div className="grid grid-cols-4 gap-2 mb-6">
        <div className="bg-[#22242b] p-5 rounded-2xl shadow-lg border border-[#3d4047]">
          <p className="flex items-center gap-2 text-lg text-zinc-400">
            <TrendingUp className="text-emerald-400" size={24} />
            Entradas
          </p>

          <p className="text-2xl font-semibold text-emerald-400 mt-2">
            {formatBRL(summary.entradas)}
          </p>

          <Variation value={variationEntradas} />
        </div>

        <div className="bg-[#22242b] p-5 rounded-2xl shadow-lg border border-[#3d4047]">
          <p className="flex items-center gap-2 text-lg text-zinc-400">
            <TrendingDown className="text-red-400" size={24} />
            Saídas
          </p>
          <p className="text-2xl font-semibold text-red-400 mt-2">
            {formatBRL(summary.saidas)}
          </p>

          <Variation value={variationSaidas} />
        </div>

        <div className="bg-[#22242b] p-5 rounded-2xl shadow-lg border border-[#3d4047]">
          <p className="flex items-center gap-2 text-lg text-zinc-400">
            <PiggyBank className="text-blue-400" size={24} />
            Economias
          </p>
          <p className="text-2xl font-semibold text-blue-400 mt-2">
            {formatBRL(summary.economias)}
          </p>

          <Variation value={variationEconomias} />
        </div>

        <div className="bg-[#22242b] p-5 rounded-2xl shadow-lg border border-[#3d4047]">
          <p className="flex items-center gap-2 text-lg text-zinc-400">
            <DollarSign className="text-yellow-400" size={24} />
            Saldo
          </p>
          <p className="text-2xl font-semibold text-yellow-400 mt-2">
            {formatBRL(summary.entradas - summary.saidas - summary.economias)}
          </p>

          <Variation value={variationSaldo} />
        </div>
      </div>
      <div className="grid grid-cols-12 gap-1.5 mb-6">
        {MONTHS.map((month, index) => {
          const total =
            monthTotalsEntradas[index] -
            monthTotalsSaidas[index] -
            monthTotalsEconomias[index];

          const isNegative = total < 0;

          return (
            <div
              key={month}
              className="bg-[#22242b] p-2 rounded-2xl shadow-lg border border-[#3d4047]"
            >
              <p className="flex items-center gap-2 text-sm text-zinc-400">
                {isNegative ? (
                  <ArrowDownRight className="text-red-400" size={16} />
                ) : (
                  <ArrowUpRight className="text-emerald-400" size={16} />
                )}
                {month}
              </p>

              <p
                className={`text-x1 mt-1 ${
                  isNegative ? "text-red-400" : "text-emerald-400"
                }`}
              >
                {formatBRL(total)}
              </p>
            </div>
          );
        })}
      </div>
    </>
  );
}
