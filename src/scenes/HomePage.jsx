import { AnimatePresence, motion } from "framer-motion";
import CardsHome from "../components/CardsHome";
import TabelaHome from "../components/TabelaHome";

export default function HomePage({
  summary,
  processData,
  year,
  setYear,
  getIcon,
}) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={year}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.4 }}
      >
        <div className="mx-auto px-6 py-6">
          <CardsHome
            summary={summary}
            year={year}
            setYear={setYear}
            datasetEntradas={processData.entradas}
            datasetSaidas={processData.saidas}
            datasetEconomias={processData.economias}
          />

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
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
