import { useState } from "react";
import { Pencil, X } from "lucide-react";
import { CADASTROS, INITIAL_FORM } from "../Constants";
import ModalCadastro from "../components/ModalCadastro";
import ButtonsLancamento from "../components/ButtonsLancamento";
import TabelaLancamentos from "../components/TabelaLancamentos";
import ModalConfirmDelete from "../components/ModalConfirmDelete";

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
  hidePaid,
  setHidePaid,
  showToast,
}) {
  const [isSorted, setIsSorted] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null);

  return (
    <div className="mx-auto px-6 py-6">
      <ButtonsLancamento
        setIsSorted={setIsSorted}
        setHidePaid={setHidePaid}
        setShowModal={setShowModal}
        setForm={setForm}
        isSorted={isSorted}
      />

      <TabelaLancamentos
        updateLancamento={updateLancamento}
        deleteLancamento={deleteLancamento}
        setEditingId={setEditingId}
        setForm={setForm}
        setShowModal={setShowModal}
        hidePaid={hidePaid}
        lancamentos={lancamentos}
        isSorted={isSorted}
        showToast={showToast}
        setConfirmDelete={setConfirmDelete}
      />

      {showModal && (
        <ModalCadastro
          form={form}
          setForm={setForm}
          editingId={editingId}
          setShowModal={setShowModal}
          handleConfirm={handleConfirm}
        />
      )}

      {confirmDelete && (
        <ModalConfirmDelete
          setConfirmDelete={setConfirmDelete}
          deleteLancamento={deleteLancamento}
          confirmDelete={confirmDelete}
          showToast={showToast}
        />
      )}
    </div>
  );
}
