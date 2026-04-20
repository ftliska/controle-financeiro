import { ArrowUpRight, ArrowDownRight, PiggyBank } from "lucide-react";
import { MONTHS } from "./Constants";
import { formatBRL } from "./Utils";

const renderTabelaHome = (titulo, color, dataset, getIcon, tipo) => {
  const categorias = Object.keys(dataset).sort((a, b) =>
    a.localeCompare(b, "pt-BR"),
  );

  const monthTotals = MONTHS.map((_, monthIndex) => {
    return categorias.reduce((sum, cat) => {
      return sum + (dataset[cat]?.[monthIndex] || 0);
    }, 0);
  });

  const grandTotal = monthTotals.reduce((a, b) => a + b, 0);

  return (
    <div className="mb-8">
      <h2 className={`text-lg font-semibold mb-2 ${color}`}>{titulo}</h2>

      <div className="border border-[#3d4047] rounded-xl shadow-inner overflow-hidden">
        <table className="w-full text-xs table-fixed border-collapse">
          <thead className="bg-[#22242b]">
            <tr>
              <th className="p-2 text-left w-[160px] border-b border-[#3d4047]"></th>

              {MONTHS.map((m) => (
                <th
                  key={m}
                  className="p-1 text-center w-[70px] border-b border-[#3d4047]"
                >
                  {m}
                </th>
              ))}

              <th className="p-2 w-[110px] text-center border-b border-[#3d4047]">
                Total
              </th>
            </tr>
          </thead>

          <tbody>
            {categorias.map((cat) => {
              const valores = dataset[cat];
              const total = valores.reduce((a, b) => a + b, 0);
              const Icon = getIcon(cat, tipo);

              return (
                <tr
                  key={cat}
                  className="odd:bg-zinc-950 even:bg-zinc-900/50 hover:bg-zinc-800 transition"
                >
                  {/* Categoria */}
                  <td className="p-2">
                    <div className="flex items-center gap-2">
                      <Icon size={16} className="text-zinc-400" />
                      <span className="truncate">{cat}</span>
                    </div>
                  </td>

                  {/* Meses */}
                  {valores.map((v, i) => (
                    <td
                      key={i}
                      className="p-1 text-center whitespace-nowrap font-mono"
                    >
                      {formatBRL(v)}
                    </td>
                  ))}

                  {/* Total linha */}
                  <td className="p-2 text-center font-semibold whitespace-nowrap">
                    {formatBRL(total)}
                  </td>
                </tr>
              );
            })}
          </tbody>

          <tfoot className="bg-[#1a1c22] border-t border-[#3d4047]">
            <tr>
              <td className="p-2 text-center font-semibold">Total</td>

              {monthTotals.map((total, i) => (
                <td
                  key={i}
                  className="p-1 text-center font-semibold whitespace-nowrap font-mono"
                >
                  {formatBRL(total)}
                </td>
              ))}

              <td className="p-2 text-center font-bold whitespace-nowrap">
                {formatBRL(grandTotal)}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};

export default function HomePage({ summary, processData, getIcon }) {
  return (
    <div className="max-w-7xl mx-auto px-6 py-6">
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

      {renderTabelaHome(
        "Entradas",
        "text-emerald-400",
        processData.entradas,
        getIcon,
        "Receita",
      )}
      {renderTabelaHome(
        "Saídas",
        "text-red-400",
        processData.saidas,
        getIcon,
        "Despesa",
      )}
      {renderTabelaHome(
        "Economias",
        "text-blue-400",
        processData.economias,
        getIcon,
        "Investimento",
      )}
    </div>
  );
}
