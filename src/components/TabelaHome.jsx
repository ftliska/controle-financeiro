import { MONTHS } from "../Constants";
import { formatBRL } from "../Utils";
import { motion } from "framer-motion";

export default function TabelaHome({ dataset, getIcon, color, titulo, tipo }) {
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

          <motion.tbody
            initial="hidden"
            animate="visible"
            variants={{
              hidden: {},
              visible: {
                transition: {
                  staggerChildren: 0.04,
                },
              },
            }}
          >
            {categorias.map((cat) => {
              const valores = dataset[cat];
              const total = valores.reduce((a, b) => a + b, 0);
              const Icon = getIcon(cat, tipo);

              return (
                <motion.tr
                  key={cat}
                  variants={{
                    hidden: { opacity: 0, y: 8 },
                    visible: { opacity: 1, y: 0 },
                  }}
                  transition={{ duration: 0.5 }}
                  className="odd:bg-zinc-950 even:bg-zinc-900/50 hover:bg-zinc-800/80 transition-colors duration-200"
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
                </motion.tr>
              );
            })}
          </motion.tbody>

          <tfoot className="bg-[#1a1c22] border-t border-[#3d4047]">
            <motion.tr
              variants={{
                hidden: { opacity: 0, y: 8 },
                visible: { opacity: 1, y: 0 },
              }}
              transition={{ duration: 0.5 }}
            >
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
            </motion.tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}
