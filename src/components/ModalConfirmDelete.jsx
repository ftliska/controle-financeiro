export default function ModalConfirmDelete({ setConfirmDelete, deleteLancamento, confirmDelete, showToast }) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-zinc-900 p-6 rounded-2xl shadow-xl w-full max-w-sm animate-scaleIn">
        <p className="mb-4 text-sm text-zinc-300">
          Deseja realmente excluir este lançamento?
        </p>

        <div className="flex justify-end gap-2">
          <button
            onClick={() => setConfirmDelete(null)}
            className="px-4 py-2 bg-zinc-700 rounded-lg hover:bg-zinc-600 transition"
          >
            Cancelar
          </button>

          <button
            onClick={() => {
              deleteLancamento(confirmDelete);
              setConfirmDelete(null);
              showToast("Excluído com sucesso!");
            }}
            className="px-4 py-2 bg-red-500 rounded-lg hover:bg-red-600 transition"
          >
            Excluir
          </button>
        </div>
      </div>
    </div>
  );
}
