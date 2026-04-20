import { CADASTROS, INITIAL_FORM } from "../Constants";

export default function ModalCadastro({
  form,
  setForm,
  editingId,
  setShowModal,
  handleConfirm,
}) {
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn">
      <div className="bg-zinc-900 w-full max-w-lg rounded-2xl border border-zinc-800 shadow-2xl p-6 animate-scaleIn">
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
              onChange={(e) => setForm({ ...form, descricao: e.target.value })}
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
              value={
                form.valor
                  ? `R$ ${(Number(form.valor) / 100).toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                  : ""
              }
              onChange={(e) => {
                const numeric = e.target.value.replace(/\D/g, "");
                setForm({ ...form, valor: numeric });
              }}
              onBlur={() => {
                if (!form.valor) {
                  setForm({ ...form, valor: "" });
                }
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

            <div
              className={`transition-all duration-300 ease-out ${
                form.parcelado
                  ? "max-h-24 opacity-100 mt-3 overflow-visible"
                  : "max-h-0 opacity-0 mt-0 overflow-hidden"
              }`}
              aria-hidden={!form.parcelado}
            >
              <div className="flex gap-2">
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
                  className="input text-center !w-20 flex-shrink-0"
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
                  className="input text-center !w-20 flex-shrink-0"
                />
              </div>
            </div>
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
  );
}
