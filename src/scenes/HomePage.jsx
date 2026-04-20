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
  );
}
