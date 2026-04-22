import { AnimatePresence, motion } from "framer-motion";
import CardsHome from "../components/CardsHome";
import TabelaHome from "../components/TabelaHome";
import SummarySkeleton from "../components/SummarySkeleton";
import TableSkeleton from "../components/TableSkeleton";

export default function HomePage({
  summary,
  processData,
  year,
  setYear,
  getIcon,
  loading,
  summaryPrevYear,
  processDataPrevYear,
}) {
  return (
    <div className="mx-auto px-6 py-6">
      {/* 🔽 CARDS */}
      <AnimatePresence mode="wait">
        <motion.div
          key={loading ? "cards-loading" : `cards-${year}`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
        >
          {loading ? (
            <SummarySkeleton />
          ) : (
            <CardsHome
              summary={summary}
              summaryPrevYear={summaryPrevYear}
              year={year}
              setYear={setYear}
              datasetEntradas={processData.entradas}
              datasetSaidas={processData.saidas}
              datasetEconomias={processData.economias}
              processDataPrevYear={processDataPrevYear}
            />
          )}
        </motion.div>
      </AnimatePresence>

      {/* 🔽 TABELAS */}
      <AnimatePresence mode="wait">
        <motion.div
          key={loading ? "tables-loading" : `tables-${year}`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3, delay: 0.05 }}
          className="space-y-6"
        >
          {loading ? (
            <>
              <TableSkeleton />
              <TableSkeleton />
              <TableSkeleton />
            </>
          ) : (
            <>
              <TabelaHome
                dataset={processData.entradas}
                getIcon={getIcon}
                color="text-emerald-400"
                titulo="Entradas"
                tipo="Receita"
                year={year}
              />

              <TabelaHome
                dataset={processData.saidas}
                getIcon={getIcon}
                color="text-red-400"
                titulo="Saídas"
                tipo="Despesa"
                year={year}
              />

              <TabelaHome
                dataset={processData.economias}
                getIcon={getIcon}
                color="text-blue-400"
                titulo="Economias"
                tipo="Investimento"
                year={year}
              />
            </>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
