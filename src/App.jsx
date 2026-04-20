import { useState, useMemo, useEffect } from "react";
import { supabase } from "./services/supabase";
import { Home, List, Settings, Wallet } from "lucide-react";
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
  const [authenticated, setAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [isLogin, setIsLogin] = useState(true);
  const [year, setYear] = useState(() => {
    const saved = Number(localStorage.getItem("selectedYear"));
    const current = new Date().getFullYear();

    return saved && saved > 2000 && saved < 2100 ? saved : current;
  });
  const [lancamentos, setLancamentos] = useState(() => {
    const savedLancamentos = localStorage.getItem("lancamentos");
    return savedLancamentos ? JSON.parse(savedLancamentos) : [];
  });
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(INITIAL_FORM);
  const [editingId, setEditingId] = useState(null);
  const [hidePaid, setHidePaid] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    localStorage.setItem("selectedYear", year);
  }, [year]);

  useEffect(() => {
    localStorage.setItem("lancamentos", JSON.stringify(lancamentos));
  }, [lancamentos]);

  useEffect(() => {
    localStorage.setItem("authenticated", authenticated ? "1" : "0");
  }, [authenticated]);

  useEffect(() => {
    if (user) {
      localStorage.setItem("userEmail", user.email);
    } else {
      localStorage.removeItem("userEmail");
    }
  }, [user]);

  useEffect(() => {
    const getSession = async () => {
      const { data } = await supabase.auth.getSession();

      if (data.session) {
        setUser(data.session.user);
        setAuthenticated(true);
      }
    };

    getSession();

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (session) {
          setUser(session.user);
          setAuthenticated(true);
        } else {
          setUser(null);
          setAuthenticated(false);
        }
      },
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  const handleLogin = (email) => {
    setUser({ email });
    setAuthenticated(true);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const handleConfirm = () => {
    try {
      const cadastro = CADASTROS.find((c) => c.descricao === form.descricao);
      if (!cadastro) return;

      const valor = Number(form.valor);
      const hoje = formatDateLocal(new Date());

      if (editingId) {
        setLancamentos((prev) =>
          prev.map((l) =>
            l.id === editingId
              ? {
                  ...l,
                  dataVencimento: form.dataVencimento,
                  descricao: form.descricao,
                  categoria: cadastro.categoria,
                  tipo: cadastro.tipo,
                  valor: valor,
                  status: form.status,
                  obs: form.obs,
                }
              : l,
          ),
        );
      } else {
        const novos = createLancamentos(form, cadastro, valor, hoje);
        setLancamentos((prev) => [...prev, ...novos]);
      }

      showToast(
        `Lançamento ${editingId ? "atualizado" : "criado"} com sucesso!`,
      );
      setEditingId(null);
      setShowModal(false);
      setForm(INITIAL_FORM);
    } catch (error) {
      console.error("Erro ao processar o lançamento:", error);
      return;
    }
  };

  const updateLancamento = (id, field, value) => {
    setLancamentos((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: value } : item)),
    );
  };

  const deleteLancamento = (id) => {
    setLancamentos((prev) => prev.filter((l) => l.id !== id));
  };

  const showToast = (message, type = "success") => {
    setToast({ message, type });

    setTimeout(() => {
      setToast(null);
    }, 2500);
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

  if (!authenticated) {
    return isLogin ? (
      <LoginPage
        onLogin={handleLogin}
        onSwitchToSignup={() => setIsLogin(false)}
      />
    ) : (
      <SignupPage
        onLogin={handleLogin}
        onSwitchToLogin={() => setIsLogin(true)}
      />
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
        />
      )}

      {page === "cadastro" && <CadastroPage />}

      {toast && <ToastConfirmacao toast={toast} />}
    </div>
  );
}
