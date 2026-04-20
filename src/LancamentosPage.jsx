import { Pencil, X, Check } from "lucide-react";
import { CADASTROS, INITIAL_FORM } from "./Constants";
import { formatBRL, parseBRL } from "./Utils";

export default function LancamentosPage({
  lancamentos,
  updateLancamento,
  showModal,
  setShowModal,
  form,
  setForm,
  handleConfirm,
  setEditingId,
  editingId,
  deleteLancamento,
}) {
  const getRowStatus = (l) => {
    if (l.status === "Pago") return "normal";

    const today = new Date().toISOString().split("T")[0];

    if (!l.dataVencimento) return "normal";

    if (l.dataVencimento < today) return "vencido";
    if (l.dataVencimento === today) return "hoje";

    return "normal";
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-6">
      <div className="flex justify-between mb-4">
        <h2>Lançamentos</h2>
        <button
          onClick={() => setShowModal(true)}
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
    ${(() => {
      const status = getRowStatus(l);

      if (status === "vencido") {
        return "bg-red-500/10 border-l-2 border-red-500";
      }

      if (status === "hoje") {
        return "bg-yellow-400/10 border-l-2 border-yellow-400";
      }

      return "odd:bg-zinc-950 even:bg-zinc-900/50 hover:bg-zinc-800";
    })()}
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
      {showModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-zinc-900 w-full max-w-lg rounded-2xl border border-zinc-800 shadow-2xl p-6 animate-fadeIn">
            {/* HEADER */}
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-white">
                {editingId ? "Editar lançamento" : "Novo lançamento"}
              </h2>
              <p className="text-sm text-zinc-400">Preencha os dados abaixo</p>
            </div>

            {/* FORM */}
            <div className="space-y-4">
              {/* Data */}
              <div>
                <label className="label">Data de vencimento</label>
                <input
                  type="date"
                  value={form.dataVencimento}
                  onChange={(e) =>
                    setForm({ ...form, dataVencimento: e.target.value })
                  }
                  className="input"
                />
              </div>

              {/* Descrição */}
              <div>
                <label className="label">Descrição</label>
                <select
                  value={form.descricao}
                  onChange={(e) =>
                    setForm({ ...form, descricao: e.target.value })
                  }
                  className="input"
                >
                  <option value="">Selecione</option>
                  {CADASTROS.map((c) => (
                    <option key={c.id} value={c.descricao}>
                      {c.descricao}
                    </option>
                  ))}
                </select>
              </div>

              {/* Valor */}
              <div>
                <label className="label">Valor</label>
                <input
                  value={form.valor}
                  onChange={(e) => {
                    const raw = e.target.value.replace(/\D/g, "");
                    const formatted = raw
                      ? (Number(raw) / 100).toLocaleString("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        })
                      : "";

                    setForm({ ...form, valor: formatted });
                  }}
                  className="input"
                  placeholder="R$ 0,00"
                />
              </div>

              {/* Status */}
              <div>
                <label className="label">Status</label>
                <select
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value })}
                  className="input"
                >
                  <option>Previsto</option>
                  <option>Pago</option>
                </select>
              </div>

              {/* Parcelado */}
              <div className="bg-zinc-800/50 p-3 rounded-xl border border-zinc-700">
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={form.parcelado}
                    onChange={(e) =>
                      setForm({ ...form, parcelado: e.target.checked })
                    }
                  />
                  Pagamento parcelado
                </label>

                {form.parcelado && (
                  <div className="flex gap-2 mt-3">
                    <input
                      placeholder="Pagas"
                      value={form.parcelasPagas}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          parcelasPagas: e.target.value
                            .replace(/\D/g, "")
                            .slice(0, 2),
                        })
                      }
                      className="input"
                    />
                    <input
                      placeholder="Total"
                      value={form.parcelasTotais}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          parcelasTotais: e.target.value
                            .replace(/\D/g, "")
                            .slice(0, 2),
                        })
                      }
                      className="input"
                    />
                  </div>
                )}
              </div>

              {/* Observações */}
              <div>
                <label className="label">Observações</label>
                <input
                  value={form.obs}
                  onChange={(e) => setForm({ ...form, obs: e.target.value })}
                  className="input"
                  placeholder="Opcional..."
                />
              </div>
            </div>

            {/* FOOTER */}
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => {
                  setShowModal(false);
                  setForm(INITIAL_FORM);
                }}
                className="px-4 py-2 rounded-xl bg-red-500 hover:bg-red-600 transition shadow-lg"
              >
                Cancelar
              </button>

              <button
                onClick={handleConfirm}
                className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 transition shadow-lg"
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
