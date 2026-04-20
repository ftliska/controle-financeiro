import { Pencil, X, Check } from "lucide-react";
import { CADASTROS } from "./Constants";
import { formatBRL, parseBRL } from "./Utils";

export default function LancamentosPage({
  lancamentos,
  updateLancamento,
  addLancamento,
  toggleEdit,
  deleteLancamento,
  saveLancamento,
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
        <table className="w-full text-sm border-collapse table-fixed">
          <thead className="bg-zinc-900">
            <tr>
              <th className="p-2 text-center w-[120px] border-b border-zinc-800">
                Data Lançamento
              </th>
              <th className="p-2 text-center w-[120px] border-b border-zinc-800">
                Data Vencimento
              </th>
              <th className="p-2 text-center w-[120px] border-b border-zinc-800">
                Descrição
              </th>
              <th className="p-2 text-center w-[120px] border-b border-zinc-800">
                Categoria
              </th>
              <th className="p-2 text-center w-[120px] border-b border-zinc-800">
                Lançamento
              </th>
              <th className="p-2 text-center w-[120px] border-b border-zinc-800">
                Valor
              </th>
              <th className="p-2 text-center w-[120px] border-b border-zinc-800">
                Status
              </th>
              <th className="p-2 text-center w-[120px] border-b border-zinc-800">
                Obs
              </th>
              <th className="p-2 text-center w-[120px] border-b border-zinc-800">
                Ações
              </th>
            </tr>
          </thead>
          <tbody>
            {lancamentos
              .filter((l) => l && l.id)
              .map((l) => (
                <tr
                  key={l.id}
                  className={`
    transition
    ${
      l.isEditing
        ? "bg-zinc-800"
        : "odd:bg-zinc-950 even:bg-zinc-900/50 hover:bg-zinc-800"
    }
  `}
                >
                  <td className="p-2">
                    <input
                      type="date"
                      value={l.dataLancamento || ""}
                      onChange={(e) =>
                        updateLancamento(l.id, "dataLancamento", e.target.value)
                      }
                      className="w-full whitespace-nowrap bg-zinc-900 border border-zinc-700 rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      disabled={!l.isEditing}
                    />
                  </td>
                  <td className="p-2">
                    <input
                      type="date"
                      value={l.dataVencimento || ""}
                      onChange={(e) =>
                        updateLancamento(l.id, "dataVencimento", e.target.value)
                      }
                      className="w-full whitespace-nowrap bg-zinc-900 border border-zinc-700 rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      disabled={!l.isEditing}
                    />
                  </td>
                  <td className="p-2">
                    <select
                      disabled={!l.isEditing}
                      value={l.descricao || ""}
                      onChange={(e) => {
                        const selected = CADASTROS.find(
                          (c) => c.descricao === e.target.value,
                        );

                        updateLancamento(l.id, "descricao", selected.descricao);
                        updateLancamento(l.id, "categoria", selected.categoria);
                        updateLancamento(l.id, "tipo", selected.tipo);
                      }}
                      className="w-full whitespace-nowrap bg-zinc-900 border border-zinc-700 rounded-lg px-2 py-1"
                    >
                      <option value="">Selecione</option>
                      {CADASTROS.map((c) => (
                        <option key={c.id} value={c.descricao}>
                          {c.descricao}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="p-2">
                    <input
                      value={l.categoria || ""}
                      className="w-full whitespace-nowrap bg-zinc-900 border border-zinc-700 rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      disabled
                    />
                  </td>
                  <td className="p-2">
                    <input
                      value={l.tipo || ""}
                      className="w-full whitespace-nowrap bg-zinc-900 border border-zinc-700 rounded-lg px-2 py-1 focus:ring-2 focus:ring-emerald-500"
                      disabled
                    />
                  </td>
                  <td className="p-2">
                    <input
                      disabled={!l.isEditing}
                      value={l.valor !== "" ? formatBRL(l.valor) : ""}
                      onChange={(e) => {
                        const parsed = parseBRL(e.target.value);
                        updateLancamento(l.id, "valor", parsed);
                      }}
                      className="w-full whitespace-nowrap bg-zinc-900 border border-zinc-700 rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </td>
                  <td className="p-2">
                    <select
                      value={l.status || "Previsto"}
                      onChange={(e) =>
                        updateLancamento(l.id, "status", e.target.value)
                      }
                      className="w-full whitespace-nowrap bg-zinc-900 border border-zinc-700 rounded-lg px-2 py-1 focus:ring-2 focus:ring-emerald-500"
                      disabled={!l.isEditing}
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
                      className="w-full whitespace-nowrap bg-zinc-900 border border-zinc-700 rounded-lg px-2 py-1 focus:ring-2 focus:ring-emerald-500"
                      disabled={!l.isEditing}
                    />
                  </td>
                  <td className="p-2">
                    <div className="flex items-center justify-center gap-3 text-zinc-400">
                      {l.isEditing ? (
                        <button onClick={() => saveLancamento(l.id)}>
                          <Check
                            size={16}
                            className="text-emerald-400 hover:scale-110"
                          />
                        </button>
                      ) : (
                        <button onClick={() => toggleEdit(l.id)}>
                          <Pencil
                            size={16}
                            className="text-yellow-400 hover:scale-110"
                          />
                        </button>
                      )}

                      <button onClick={() => deleteLancamento(l.id)}>
                        <X size={16} className="text-red-400 hover:scale-110" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
