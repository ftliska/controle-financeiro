import { useState, useMemo, useEffect } from "react";
import { supabase } from "./services/supabase";
import HomePage from "./scenes/HomePage";
import LancamentosPage from "./scenes/LancamentosPage";
import CadastroPage from "./scenes/CadastroPage";
import LoginPage from "./scenes/LoginPage";
import SignupPage from "./scenes/SignupPage";
import { CADASTROS, INITIAL_FORM } from "./Constants";
import {
  formatDateLocal,
  parseDateLocal,
  createLancamentos,
  getIcon,
} from "./Utils";
import NavbarHeader from "./components/NavbarHeader";
import ToastConfirmacao from "./components/ToastConfirmacao";

export default function App() {
  const [page, setPage] = useState("home");
  const [user, setUser] = useState(null);
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [year, setYear] = useState(() => {
    const saved = Number(localStorage.getItem("selectedYear"));
    const current = new Date().getFullYear();
    return saved && saved > 2000 && saved < 2100 ? saved : current;
  });

  const [lancamentos, setLancamentos] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(INITIAL_FORM);
  const [editingId, setEditingId] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [hidePaid, setHidePaid] = useState(false);
  const [toast, setToast] = useState(null);

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

  const loadLancamentos = async () => {
    if (!user) return;

    setLoading(true);

    const { data, error } = await supabase
      .from("lancamentos")
      .select("*")
      .eq("user_id", user.id)
      .order("data_vencimento", { ascending: true });

    if (error) {
      console.error(error);
      setLoading(false);
      return;
    }

    setLancamentos(
      data.map((l) => ({
        id: l.id,
        dataLancamento: l.data_lancamento,
        dataVencimento: l.data_vencimento,
        descricao: l.descricao,
        categoria: l.categoria,
        tipo: l.tipo,
        valor: l.valor,
        status: l.status,
        obs: l.obs,
      })),
    );

    setLoading(false);
  };

  useEffect(() => {
    if (user) loadLancamentos();
  }, [user]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const handleConfirm = async () => {
    try {
      setSaving(true);

      const cadastro = CADASTROS.find((c) => c.descricao === form.descricao);
      if (!cadastro) return;

      const valor = Number(form.valor);
      const hoje = formatDateLocal(new Date());

      if (editingId) {
        const { error } = await supabase
          .from("lancamentos")
          .update({
            data_vencimento: form.dataVencimento,
            descricao: form.descricao,
            categoria: cadastro.categoria,
            tipo: cadastro.tipo,
            valor: valor,
            status: form.status,
            obs: form.obs,
          })
          .eq("id", editingId);

        if (error) throw error;
      } else {
        const novos = createLancamentos(form, cadastro, valor, hoje).map(
          (l) => ({
            user_id: user.id,
            data_lancamento: l.dataLancamento,
            data_vencimento: l.dataVencimento,
            descricao: l.descricao,
            categoria: l.categoria,
            tipo: l.tipo,
            valor: l.valor,
            status: l.status,
            obs: l.obs,
          }),
        );

        const { error } = await supabase.from("lancamentos").insert(novos);
        if (error) throw error;
      }

      await loadLancamentos();

      showToast(
        `Lançamento ${editingId ? "atualizado" : "criado"} com sucesso!`,
      );

      setEditingId(null);
      setShowModal(false);
      setForm(INITIAL_FORM);
    } catch (error) {
      console.error(error);
      showToast("Erro ao salvar", "error");
    } finally {
      setSaving(false);
    }
  };

  const deleteLancamento = async (id) => {
    const { error } = await supabase.from("lancamentos").delete().eq("id", id);

    if (error) {
      showToast("Erro ao excluir", "error");
      throw error;
    }

    await loadLancamentos();
    showToast("Lançamento excluído com sucesso!");
  };

  const updateLancamento = async (id, field, value) => {
    // 1. Atualiza UI imediatamente (otimista)
    setLancamentos((prev) =>
      prev.map((l) =>
        l.id === id ? { ...l, [field]: value, _updating: true } : l,
      ),
    );

    // 2. Persiste no backend
    const { error } = await supabase
      .from("lancamentos")
      .update({
        [mapField(field)]: value,
      })
      .eq("id", id);

    if (error) {
      console.error(error);
      showToast("Erro ao atualizar", "error");

      // rollback
      await loadLancamentos();
      return;
    }

    // 3. Remove flag de loading
    setLancamentos((prev) =>
      prev.map((l) => (l.id === id ? { ...l, _updating: false } : l)),
    );
  };

  const mapField = (field) => {
    const map = {
      dataLancamento: "data_lancamento",
      dataVencimento: "data_vencimento",
      descricao: "descricao",
      categoria: "categoria",
      tipo: "tipo",
      valor: "valor",
      status: "status",
      obs: "obs",
    };

    return map[field] || field;
  };

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 2500);
  };

  const processData = useMemo(() => {
    const data = { entradas: {}, saidas: {}, economias: {} };

    lancamentos.forEach((l) => {
      if (!l.dataVencimento || !l.valor) return;

      const date = parseDateLocal(l.dataVencimento);
      if (!date || date.getFullYear() !== year) return;

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
  }, [lancamentos, year]);

  const processDataPrevYear = useMemo(() => {
    const data = { entradas: {}, saidas: {}, economias: {} };

    lancamentos.forEach((l) => {
      if (!l.dataVencimento || !l.valor) return;

      const date = parseDateLocal(l.dataVencimento);
      if (!date || date.getFullYear() !== year - 1) return;

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
  }, [lancamentos, year]);

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
          getIcon={getIcon}
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
          handleConfirm={handleConfirm}
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
