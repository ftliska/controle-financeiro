import { ArrowUpRight, ArrowDownRight, PiggyBank } from "lucide-react";
import { MONTHS } from "./Constants";

const format = (v) => (v ? `R$ ${v.toLocaleString("pt-BR")}` : "-");

const renderTabelaHome = (titulo, color, dataset) => {
  const categorias = Object.keys(dataset);

  return (
    <div className="mb-8">
      <h2 className={`text-lg font-semibold mb-2 ${color}`}>{titulo}</h2>

      <div className="border border-zinc-800 rounded-xl overflow-hidden">
        <table className="w-full text-sm border-collapse">
          <thead className="bg-zinc-900">
            <tr>
              <th className="p-2 text-left border-b border-zinc-800">
                Categoria
              </th>
              {MONTHS.map((m) => (
                <th key={m} className="p-2 border-b border-zinc-800">
                  {m}
                </th>
              ))}
              <th className="p-2 border-b border-zinc-800">Total</th>
            </tr>
          </thead>

          <tbody>
            {categorias.map((cat) => {
              const valores = dataset[cat];
              const total = valores.reduce((a, b) => a + b, 0);

              return (
                <tr
                  key={cat}
                  className="odd:bg-zinc-950 even:bg-zinc-900/50 hover:bg-zinc-800 transition"
                >
                  <td className="p-2">{cat}</td>

                  {valores.map((v, i) => (
                    <td key={i} className="text-center p-2">
                      {format(v)}
                    </td>
                  ))}

                  <td className="text-center font-semibold p-2">
                    {format(total)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default function HomePage({ summary, processData }) {
  return (
    <div className="max-w-7xl mx-auto px-6 py-6">
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-zinc-900 p-5 rounded-2xl shadow-lg border border-zinc-800 hover:scale-[1.02] transition">
          <p className="flex items-center gap-2 text-sm text-zinc-400">
            <ArrowUpRight className="text-emerald-400" size={18} />
            Entradas
          </p>
          <p className="text-2xl font-semibold text-emerald-400 mt-2">
            {format(summary.entradas)}
          </p>
        </div>

        <div className="bg-zinc-900 p-5 rounded-2xl shadow-lg border border-zinc-800 hover:scale-[1.02] transition">
          <p className="flex items-center gap-2 text-sm text-zinc-400">
            <ArrowDownRight className="text-red-400" size={18} />
            Saídas
          </p>
          <p className="text-2xl font-semibold text-red-400 mt-2">
            {format(summary.saidas)}
          </p>
        </div>

        <div className="bg-zinc-900 p-5 rounded-2xl shadow-lg border border-zinc-800 hover:scale-[1.02] transition">
          <p className="flex items-center gap-2 text-sm text-zinc-400">
            <PiggyBank className="text-blue-400" size={18} />
            Economias
          </p>
          <p className="text-2xl font-semibold text-blue-400 mt-2">
            {format(summary.economias)}
          </p>
        </div>
      </div>

      {renderTabelaHome("Entradas", "text-emerald-400", processData.entradas)}
      {renderTabelaHome("Saídas", "text-red-400", processData.saidas)}
      {renderTabelaHome("Economias", "text-blue-400", processData.economias)}
    </div>
  );
}
