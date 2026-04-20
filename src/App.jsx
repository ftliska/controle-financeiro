import { useState, useMemo } from "react";
import {
  ArrowUpRight,
  ArrowDownRight,
  PiggyBank,
  Home,
  List,
  Settings,
  Wallet,
} from "lucide-react";
import HomePage from "./HomePage";
import LancamentosPage from "./LancamentosPage";
import CadastroPage from "./CadastroPage";
import { CADASTROS, ICONS_BY_DESCRICAO, ICONS_BY_TYPE } from "./Constants";

export default function App() {
  const [page, setPage] = useState("home");
  const [year] = useState(2026);

  const [lancamentos, setLancamentos] = useState([]);

  const addLancamento = () => {
    setLancamentos((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        dataLancamento: "",
        dataVencimento: "",
        descricao: "",
        categoria: "",
        tipo: "Receita",
        valor: "",
        status: "Previsto",
        obs: "",
        isEditing: true,
        isNew: true,
      },
    ]);
  };

  const toggleEdit = (id) => {
    setLancamentos((prev) =>
      prev.map((l) => (l.id === id ? { ...l, isEditing: !l.isEditing } : l)),
    );
  };

  const deleteLancamento = (id) => {
    setLancamentos((prev) => prev.filter((l) => l.id !== id));
  };

  const updateLancamento = (id, field, value) => {
    setLancamentos((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: value } : item)),
    );
  };

  const saveLancamento = (id) => {
    setLancamentos((prev) =>
      prev.map((l) => {
        if (l.id !== id) return l;

        if (!l.descricao || !l.valor) {
          alert("Preencha descrição e valor");
          return l;
        }

        return { ...l, isEditing: false, isNew: false };
      }),
    );
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

      const date = new Date(l.dataVencimento);
      if (date.getFullYear() !== year) return;

      const monthIndex = date.getMonth();
      const categoria = l.descricao || "Sem categoria";
      const valor = l.valor || 0;

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
        <div>Ano: {year}</div>
      </div>

      {page === "home" && (
        <HomePage
          summary={summary}
          processData={processData}
          getIcon={getIcon}
        />
      )}
      {page === "lancamentos" && (
        <LancamentosPage
          lancamentos={lancamentos}
          updateLancamento={updateLancamento}
          addLancamento={addLancamento}
          toggleEdit={toggleEdit}
          deleteLancamento={deleteLancamento}
          saveLancamento={saveLancamento}
        />
      )}
      {page === "cadastro" && <CadastroPage />}
    </div>
  );
}
