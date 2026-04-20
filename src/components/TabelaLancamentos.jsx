import { Pencil, X } from "lucide-react";
import { CADASTROS } from "../Constants";
import { formatDateLocal, formatBRL, parseBRL } from "../Utils";

export default function TabelaLancamentos({
  updateLancamento,
  deleteLancamento,
  setEditingId,
  setForm,
  setShowModal,
  hidePaid,
  lancamentos,
  isSorted,
}) {
  const getRowStatus = (l) => {
    if (l.status === "Pago") return "normal";

    const today = formatDateLocal(new Date());

    if (!l.dataVencimento) return "normal";

    if (l.dataVencimento < today) return "vencido";
    if (l.dataVencimento === today) return "hoje";

    return "normal";
  };

  const processedLancamentos = [...lancamentos]
    .filter((l) => (hidePaid ? l.status !== "Pago" : true))
    .sort((a, b) => {
      if (!isSorted) return 0;

      const d1 = new Date(a.dataLancamento);
      const d2 = new Date(b.dataLancamento);

      if (d1.getTime() !== d2.getTime()) {
        return d1 - d2;
      }

      const v1 = new Date(a.dataVencimento);
      const v2 = new Date(b.dataVencimento);

      return v1 - v2;
    });

  return (
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
          {processedLancamentos
            .filter((l) => l && l.id)
            .map((l) => (
              <tr
                key={l.id}
                className={`transition ${(() => {
                  const status = getRowStatus(l);

                  if (status === "vencido") {
                    return "bg-red-500/10 border-l-4 border-l-red-500";
                  }

                  if (status === "hoje") {
                    return "bg-yellow-400/10 border-l-4 border-l-yellow-400";
                  }

                  return "odd:bg-zinc-950 even:bg-zinc-900/50 hover:bg-zinc-800";
                })()}`}
              >
                <td className="p-2">
                  <input
                    type="date"
                    value={l.dataLancamento || ""}
                    onChange={(e) =>
                      updateLancamento(l.id, "dataLancamento", e.target.value)
                    }
                    className="w-full whitespace-nowrap bg-zinc-900 border border-zinc-700 rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    disabled
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
                    disabled
                  />
                </td>
                <td className="p-2">
                  <select
                    disabled
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
                    disabled
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
                    disabled
                  />
                </td>
                <td className="p-2">
                  <div className="flex items-center justify-center gap-3 text-zinc-400">
                    <button
                      onClick={() => {
                        setEditingId(l.id);

                        setForm({
                          dataVencimento: l.dataVencimento,
                          descricao: l.descricao,
                          valor: formatBRL(l.valor),
                          status: l.status,
                          parcelado: false,
                          parcelasPagas: "",
                          parcelasTotais: "",
                          obs: l.obs || "",
                        });

                        setShowModal(true);
                      }}
                    >
                      <Pencil
                        size={16}
                        className="text-yellow-400 hover:scale-110"
                      />
                    </button>

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
  );
}
