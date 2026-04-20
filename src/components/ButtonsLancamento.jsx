import { Pencil, X, Check, Plus, EyeOff, Eye, ArrowUpDown } from "lucide-react";
import { INITIAL_FORM } from "../Constants";

export default function ButtonsLancamento({
  setIsSorted,
  setHidePaid,
  setShowModal,
  setForm,
  isSorted,
}) {
  return (
    <div className="flex gap-2 mb-4">
      {/* Ordenar */}
      <button
        onClick={() => setIsSorted((prev) => !prev)}
        className="flex items-center gap-2 bg-zinc-800 hover:bg-zinc-700 px-3 py-2 rounded-lg text-sm transition"
      >
        <ArrowUpDown size={16} />
        {isSorted ? "Desfazer ordenação" : "Ordenar"}
      </button>

      {/* Ocultar */}
      <button
        onClick={() => setHidePaid(true)}
        className="flex items-center gap-2 bg-zinc-800 hover:bg-zinc-700 px-3 py-2 rounded-lg text-sm transition"
      >
        <EyeOff size={16} />
        Ocultar pagos
      </button>

      {/* Exibir */}
      <button
        onClick={() => setHidePaid(false)}
        className="flex items-center gap-2 bg-zinc-800 hover:bg-zinc-700 px-3 py-2 rounded-lg text-sm transition"
      >
        <Eye size={16} />
        Exibir todos
      </button>

      {/* Novo */}
      <button
        onClick={() => {
          setForm(INITIAL_FORM);
          setShowModal(true);
        }}
        className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 px-4 py-2 rounded-lg text-sm font-medium transition ml-auto"
      >
        <Plus size={16} />
        Adicionar lançamento
      </button>
    </div>
  );
}
