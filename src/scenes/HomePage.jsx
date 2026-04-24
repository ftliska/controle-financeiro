import { AnimatePresence, motion } from "framer-motion";
import CardsHome from "../components/CardsHome";
import TabelaHome from "../components/TabelaHome";
import AccordionSection from "../components/AccordionSection";
import { PiggyBank, TrendingDown, TrendingUp } from "lucide-react";

export default function HomePage({
  summary,
  processData,
  year,
  setYear,
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
          <AccordionSection
            title="Entradas"
            total={summary.entradas}
            icon={<TrendingUp className="text-emerald-400" />}
            color="text-emerald-400"
            defaultOpen={true}
          >
            <TabelaHome
              dataset={processData.entradas}
              color="text-emerald-400"
              titulo="Entradas"
              tipo="Receita"
              year={year}
            />
          </AccordionSection>
          <AccordionSection
            title="Saídas"
            total={summary.saidas}
            icon={<TrendingDown className="text-red-400" />}
            color="text-red-400"
          >
            <TabelaHome
              dataset={processData.saidas}
              color="text-red-400"
              titulo="Saídas"
              tipo="Despesa"
              year={year}
            />
          </AccordionSection>
          <AccordionSection
            title="Economias"
            total={summary.economias}
            icon={<PiggyBank className="text-blue-400" />}
            color="text-blue-400"
          >
            <TabelaHome
              dataset={processData.economias}
              color="text-blue-400"
              titulo="Economias"
              tipo="Investimento"
              year={year}
            />
          </AccordionSection>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
