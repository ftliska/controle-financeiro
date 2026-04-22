import { MONTHS } from "../Constants";
import {
  TrendingUp,
  TrendingDown,
  PiggyBank,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  CircleArrowUp,
  CircleArrowDown,
  HandCoins,
} from "lucide-react";
import Card from "./Card";

export default function CardsHome({
  summary,
  summaryPrevYear,
  setYear,
  year,
  datasetEntradas,
  datasetSaidas,
  datasetEconomias,
  processDataPrevYear,
}) {
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear - 2 + i);

  const getMonthTotals = (dataset) => {
    const categorias = Object.keys(dataset);

    return MONTHS.map((_, monthIndex) =>
      categorias.reduce(
        (sum, cat) => sum + (dataset[cat]?.[monthIndex] || 0),
        0,
      ),
    );
  };

  const entradasMes = getMonthTotals(datasetEntradas);
  const saidasMes = getMonthTotals(datasetSaidas);
  const economiasMes = getMonthTotals(datasetEconomias);

  const entradasMesPrev = getMonthTotals(processDataPrevYear.entradas);
  const saidasMesPrev = getMonthTotals(processDataPrevYear.saidas);
  const economiasMesPrev = getMonthTotals(processDataPrevYear.economias);

  const saldoAtual = summary.entradas - summary.saidas - summary.economias;

  const saldoPrev =
    summaryPrevYear.entradas -
    summaryPrevYear.saidas -
    summaryPrevYear.economias;

  return (
    <>
      {/* SELECT ANO */}
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

      {/* CARDS */}
      <div className="flex justify-center gap-4 mb-6">
        <Card
          title="Entradas"
          value={summary.entradas}
          prevValue={summaryPrevYear.entradas}
          dataset={entradasMes}
          datasetPrev={entradasMesPrev}
          year={year}
          color="#00ad6e"
          type="entradas"
          icon={<CircleArrowUp color="#00ad6e" size={28} />}
        />

        <Card
          title="Saídas"
          value={summary.saidas}
          prevValue={summaryPrevYear.saidas}
          dataset={saidasMes}
          datasetPrev={saidasMesPrev}
          year={year}
          color="#f05a5a"
          type="saidas"
          icon={<CircleArrowDown color="#f05a5a" size={28} />}
        />

        <Card
          title="Economias"
          value={summary.economias}
          prevValue={summaryPrevYear.economias}
          dataset={economiasMes}
          datasetPrev={economiasMesPrev}
          year={year}
          color="#60a5fa"
          type="economias"
          icon={<PiggyBank color="#60a5fa" size={28} />}
        />

        <Card
          title="Saldo"
          value={saldoAtual}
          prevValue={saldoPrev}
          dataset={entradasMes.map(
            (v, i) => v - saidasMes[i] - economiasMes[i],
          )}
          datasetPrev={entradasMesPrev.map(
            (v, i) => v - saidasMesPrev[i] - economiasMesPrev[i],
          )}
          year={year}
          color="#fa8415"
          type="saldo"
          icon={<HandCoins color="#fa8415" size={28} />}
        />
      </div>
    </>
  );
}
