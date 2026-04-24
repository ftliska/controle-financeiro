import { useState, useMemo, useEffect, useCallback } from "react";
import { supabase } from "./services/supabase";
import HomePage from "./scenes/HomePage";
import LancamentosPage from "./scenes/LancamentosPage";
import CadastroPage from "./scenes/CadastroPage";
import LoginPage from "./scenes/LoginPage";
import SignupPage from "./scenes/SignupPage";
import { INITIAL_FORM } from "./Constants";
import { parseDateLocal } from "./Utils";
import NavbarHeader from "./components/NavbarHeader";
import ToastConfirmacao from "./components/ToastConfirmacao";
import { useLancamentos } from "./hooks/useLancamentos";

export default function App() {
  const [page, setPage] = useState("home");
  const [user, setUser] = useState(null);
  const [isLogin, setIsLogin] = useState(true);
  const [year, setYear] = useState(() => {
    const saved = Number(localStorage.getItem("selectedYear"));
    const current = new Date().getFullYear();
    return saved && saved > 2000 && saved < 2100 ? saved : current;
  });
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(INITIAL_FORM);
  const [editingId, setEditingId] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [hidePaid, setHidePaid] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = useCallback((message, type = "success") => {
    setToast({ message, type });

    setTimeout(() => {
      setToast(null);
    }, 2500);
  }, []);

  const {
    lancamentos,
    loading,
    saving,
    handleConfirm,
    updateLancamento,
    deleteLancamento,
  } = useLancamentos(user, showToast);

  useEffect(() => {
    localStorage.setItem("selectedYear", year);
  }, [year]);

  useEffect(() => {
    const getSession = async () => {
      const { data } = await supabase.auth.getSession();
      setUser(data.session?.user ?? null);
    };

    getSession();

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
      },
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const buildProcessData = useCallback(
    (targetYear) => {
      const data = { entradas: {}, saidas: {}, economias: {} };

      lancamentos.forEach((l) => {
        if (!l.dataVencimento || !l.valor) return;

        const date = parseDateLocal(l.dataVencimento);
        if (!date || date.getFullYear() !== targetYear) return;

        const monthIndex = date.getMonth();
        const categoria = l.descricao || "Sem categoria";
        const valor = Number(l.valor);

        let target;
        if (l.tipo === "Receita") target = data.entradas;
        else if (l.tipo === "Despesa") target = data.saidas;
        else target = data.economias;

        if (!target[categoria]) target[categoria] = Array(12).fill(0);
        target[categoria][monthIndex] += valor;
      });

      return data;
    },
    [lancamentos],
  );

  const processData = useMemo(
    () => buildProcessData(year),
    [buildProcessData, year],
  );

  const processDataPrevYear = useMemo(
    () => buildProcessData(year - 1),
    [buildProcessData, year],
  );

  const summary = useMemo(() => {
    const sum = (obj) =>
      Object.values(obj)
        .flat()
        .reduce((a, b) => a + b, 0);

    return {
      entradas: sum(processData.entradas),
      saidas: sum(processData.saidas),
      economias: sum(processData.economias),
    };
  }, [processData]);

  const summaryPrevYear = useMemo(() => {
    const sum = (obj) =>
      Object.values(obj)
        .flat()
        .reduce((a, b) => a + b, 0);

    return {
      entradas: sum(processDataPrevYear.entradas),
      saidas: sum(processDataPrevYear.saidas),
      economias: sum(processDataPrevYear.economias),
    };
  }, [processDataPrevYear]);

  if (!user) {
    return isLogin ? (
      <LoginPage onSwitchToSignup={() => setIsLogin(false)} />
    ) : (
      <SignupPage onSwitchToLogin={() => setIsLogin(true)} />
    );
  }

  const onConfirm = () => {
    handleConfirm(form, editingId, (initial) => {
      setForm(initial);
      setEditingId(null);
      setShowModal(false);
    });
  };

  return (
    <div className="min-h-screen bg-[#14171F] text-white">
      <NavbarHeader
        setPage={setPage}
        user={user}
        onLogout={handleLogout}
        page={page}
      />

      {page === "home" && (
        <HomePage
          summary={summary}
          processData={processData}
          year={year}
          setYear={setYear}
          loading={loading}
          summaryPrevYear={summaryPrevYear}
          processDataPrevYear={processDataPrevYear}
        />
      )}

      {page === "lancamentos" && (
        <LancamentosPage
          lancamentos={lancamentos}
          updateLancamento={updateLancamento}
          deleteLancamento={deleteLancamento}
          showModal={showModal}
          setShowModal={setShowModal}
          form={form}
          setForm={setForm}
          handleConfirm={onConfirm}
          setEditingId={setEditingId}
          editingId={editingId}
          hidePaid={hidePaid}
          setHidePaid={setHidePaid}
          showToast={showToast}
          saving={saving}
          setConfirmDelete={setConfirmDelete}
          confirmDelete={confirmDelete}
        />
      )}

      {page === "cadastro" && <CadastroPage />}

      {toast && <ToastConfirmacao toast={toast} />}
    </div>
  );
}
