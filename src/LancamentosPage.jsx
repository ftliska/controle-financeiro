export default function LancamentosPage({
  lancamentos,
  updateLancamento,
  addLancamento,
}) {
  return (
    <div className="max-w-7xl mx-auto px-6 py-6">
      <div className="flex justify-between mb-4">
        <h2>Lançamentos</h2>
        <button
          onClick={addLancamento}
          className="bg-emerald-500 hover:bg-emerald-600 transition px-4 py-2 rounded-lg shadow"
        >
          + Novo
        </button>
      </div>

      <div className="border border-zinc-800 rounded-xl overflow-hidden">
        <table className="w-full text-sm border-collapse">
          <thead className="bg-zinc-900">
            <tr>
              <th className="p-2 border-b border-zinc-800">Data Lançamento</th>
              <th className="p-2 border-b border-zinc-800">Data Vencimento</th>
              <th className="p-2 border-b border-zinc-800">Descrição</th>
              <th className="p-2 border-b border-zinc-800">Categoria</th>
              <th className="p-2 border-b border-zinc-800">Lançamento</th>
              <th className="p-2 border-b border-zinc-800">Valor</th>
              <th className="p-2 border-b border-zinc-800">Status</th>
              <th className="p-2 border-b border-zinc-800">Obs</th>
            </tr>
          </thead>
          <tbody>
            {lancamentos
              .filter((l) => l && l.id)
              .map((l) => (
                <tr
                  key={l.id}
                  className="odd:bg-zinc-950 even:bg-zinc-900/50 hover:bg-zinc-800 transition"
                >
                  <td className="p-2">
                    <input
                      type="date"
                      value={l.dataLancamento || ""}
                      onChange={(e) =>
                        updateLancamento(l.id, "dataLancamento", e.target.value)
                      }
                      className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </td>
                  <td className="p-2">
                    <input
                      type="date"
                      value={l.dataVencimento || ""}
                      onChange={(e) =>
                        updateLancamento(l.id, "dataVencimento", e.target.value)
                      }
                      className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </td>
                  <td className="p-2">
                    <input
                      value={l.descricao || ""}
                      onChange={(e) =>
                        updateLancamento(l.id, "descricao", e.target.value)
                      }
                      className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </td>
                  <td className="p-2">
                    <input
                      value={l.categoria || ""}
                      onChange={(e) =>
                        updateLancamento(l.id, "categoria", e.target.value)
                      }
                      className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </td>
                  <td className="p-2">
                    <select
                      value={l.tipo || "Receita"}
                      onChange={(e) =>
                        updateLancamento(l.id, "tipo", e.target.value)
                      }
                      className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-2 py-1 focus:ring-2 focus:ring-emerald-500"
                    >
                      <option>Receita</option>
                      <option>Despesa</option>
                      <option>Investimento</option>
                    </select>
                  </td>
                  <td className="p-2">
                    <input
                      value={l.valor || ""}
                      onChange={(e) =>
                        updateLancamento(l.id, "valor", e.target.value)
                      }
                      className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </td>
                  <td className="p-2">
                    <select
                      value={l.status || "Previsto"}
                      onChange={(e) =>
                        updateLancamento(l.id, "status", e.target.value)
                      }
                      className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-2 py-1 focus:ring-2 focus:ring-emerald-500"
                    >
                      <option>Previsto</option>
                      <option>Pago</option>
                    </select>
                  </td>
                  <td className="p-2">
                    <input
                      value={l.obs || ""}
                      onChange={(e) =>
                        updateLancamento(l.id, "obs", e.target.value)
                      }
                      className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-2 py-1 focus:ring-2 focus:ring-emerald-500"
                    />
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
