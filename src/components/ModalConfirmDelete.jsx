import { useState } from "react";
import { motion } from "framer-motion";
import { AlertTriangle } from "lucide-react";

export default function ModalConfirmDelete({
  setConfirmDelete,
  deleteLancamento,
  confirmDelete,
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleDelete = async () => {
    try {
      setLoading(true);
      setError("");

      await deleteLancamento(confirmDelete);

      setConfirmDelete(null);
    } catch (err) {
      console.error(err);
      setError("Erro ao excluir. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-zinc-900 p-6 rounded-2xl shadow-2xl w-full max-w-sm border border-zinc-800"
      >
        {/* HEADER */}
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-red-500/10 text-red-400 p-2 rounded-full">
            <AlertTriangle size={18} />
          </div>
          <h3 className="text-sm font-semibold text-white">
            Confirmar exclusão
          </h3>
        </div>

        {/* TEXTO */}
        <p className="mb-4 text-sm text-zinc-400 leading-relaxed">
          Essa ação não pode ser desfeita. Deseja realmente excluir este
          lançamento?
        </p>

        {/* ERRO */}
        {error && (
          <div className="mb-3 text-sm text-red-400 bg-red-500/10 border border-red-500/20 px-3 py-2 rounded-lg">
            {error}
          </div>
        )}

        {/* BOTÕES */}
        <div className="flex justify-end gap-2">
          <button
            disabled={loading}
            onClick={() => setConfirmDelete(null)}
            className="px-4 py-2 bg-zinc-700 rounded-lg hover:bg-zinc-600 transition disabled:opacity-50"
          >
            Cancelar
          </button>

          <button
            onClick={handleDelete}
            disabled={loading}
            className="
              px-4 py-2 bg-red-500 rounded-lg hover:bg-red-600 
              transition flex items-center gap-2
              disabled:opacity-50
            "
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              "Excluir"
            )}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
