import {
  PiggyBank,
  CircleArrowUp,
  CircleArrowDown,
  HandCoins,
} from "lucide-react";
import Card from "./Card";
import { getMonthTotals, getYears } from "../Utils";

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
          {getYears().map((y) => (
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
          dataset={getMonthTotals(datasetEntradas)}
          datasetPrev={getMonthTotals(processDataPrevYear.entradas)}
          year={year}
          color="#00ad6e"
          type="entradas"
          icon={<CircleArrowUp color="#00ad6e" size={28} />}
        />

        <Card
          title="Saídas"
          value={summary.saidas}
          prevValue={summaryPrevYear.saidas}
          dataset={getMonthTotals(datasetSaidas)}
          datasetPrev={getMonthTotals(processDataPrevYear.saidas)}
          year={year}
          color="#f05a5a"
          type="saidas"
          icon={<CircleArrowDown color="#f05a5a" size={28} />}
        />

        <Card
          title="Economias"
          value={summary.economias}
          prevValue={summaryPrevYear.economias}
          dataset={getMonthTotals(datasetEconomias)}
          datasetPrev={getMonthTotals(processDataPrevYear.economias)}
          year={year}
          color="#60a5fa"
          type="economias"
          icon={<PiggyBank color="#60a5fa" size={28} />}
        />

        <Card
          title="Saldo"
          value={saldoAtual}
          prevValue={saldoPrev}
          dataset={getMonthTotals(datasetEntradas).map(
            (v, i) =>
              v -
              getMonthTotals(datasetSaidas)[i] -
              getMonthTotals(datasetEconomias)[i],
          )}
          datasetPrev={getMonthTotals(processDataPrevYear.entradas).map(
            (v, i) =>
              v -
              getMonthTotals(processDataPrevYear.saidas)[i] -
              getMonthTotals(processDataPrevYear.economias)[i],
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
