import { useState, useMemo, useEffect } from "react";
import {
  ArrowUpRight,
  ArrowDownRight,
  PiggyBank,
  Home,
  List,
  Settings,
  Wallet,
} from "lucide-react";
import HomePage from "./scenes/HomePage";
import LancamentosPage from "./scenes/LancamentosPage";
import CadastroPage from "./scenes/CadastroPage";
import {
  CADASTROS,
  ICONS_BY_DESCRICAO,
  ICONS_BY_TYPE,
  INITIAL_FORM,
} from "./Constants";
import {
  formatDateLocal,
  parseBRL,
  parseDateLocal,
  createLancamentos,
} from "./Utils";

export default function App() {
  const [page, setPage] = useState("home");
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

  useEffect(() => {
    localStorage.setItem("selectedYear", year);
  }, [year]);

  useEffect(() => {
    localStorage.setItem("lancamentos", JSON.stringify(lancamentos));
  }, [lancamentos]);

  useEffect(() => {
    localStorage.setItem("lancamentos", JSON.stringify(lancamentos));
  }, [lancamentos]);

  const handleConfirm = () => {
    try {
      const cadastro = CADASTROS.find((c) => c.descricao === form.descricao);
      if (!cadastro) return;

      const valor = parseBRL(String(form.valor));
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

  const getIcon = (descricao, tipo) => {
    // prioridade: ícone específico
    if (ICONS_BY_DESCRICAO[descricao]) {
      return ICONS_BY_DESCRICAO[descricao];
    }

    // fallback: tipo
    return ICONS_BY_TYPE[tipo];
  };

  const processData = useMemo(() => {
    const data = { entradas: {}, saidas: {}, economias: {} };

    lancamentos.forEach((l) => {
      if (!l.dataVencimento || !l.valor) return;

      const date = parseDateLocal(l.dataVencimento);
      if (!date || date.getFullYear() !== year) return;

      const monthIndex = date.getMonth();
      const categoria = l.descricao || "Sem categoria";
      const valor = parseBRL(l.valor);

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

  return (
    <div className="min-h-screen bg-[#14171F] text-white">
      <div className="flex justify-between p-4 border-b border-zinc-800">
        <div className="flex gap-4 items-center">
          <Wallet />
          <h1>Controle Financeiro</h1>
          <nav className="flex gap-6 ml-6 text-sm text-zinc-400">
            <span
              onClick={() => setPage("home")}
              className="flex items-center gap-1 hover:text-white cursor-pointer"
            >
              <Home size={16} />
              Home
            </span>
            <span
              onClick={() => setPage("lancamentos")}
              className="flex items-center gap-1 hover:text-white cursor-pointer"
            >
              <List size={16} />
              Lançamentos
            </span>
            <span
              onClick={() => setPage("cadastro")}
              className="flex items-center gap-1 hover:text-white cursor-pointer"
            >
              <Settings size={16} />
              Cadastro
            </span>
          </nav>
        </div>
      </div>

      {page === "home" && (
        <HomePage
          summary={summary}
          processData={processData}
          getIcon={getIcon}
          year={year}
          setYear={setYear}
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
        />
      )}
      {page === "cadastro" && <CadastroPage />}
    </div>
  );
}
