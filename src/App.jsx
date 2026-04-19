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
      },
    ]);
  };

  const updateLancamento = (id, field, value) => {
    setLancamentos((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: value } : item)),
    );
  };

  const formatCurrencyInput = (value) => {
    const numeric = value.replace(/\D/g, "");
    const number = Number(numeric) / 100;
    return number.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  };

  const parseCurrency = (value) => {
    return Number(value.replace(/[^\d,-]/g, "").replace(",", ".")) || 0;
  };

  const processData = useMemo(() => {
    const data = { entradas: {}, saidas: {}, economias: {} };

    lancamentos.forEach((l) => {
      if (!l.dataVencimento || !l.valor) return;

      const date = new Date(l.dataVencimento);
      if (date.getFullYear() !== year) return;

      const monthIndex = date.getMonth();
      const categoria = l.descricao || "Sem categoria";
      const valor = parseCurrency(l.valor);

      let target;
      if (l.tipo === "Receita") target = data.entradas;
      else if (l.tipo === "Despesa") target = data.saidas;
      else target = data.economias;

      if (!target[categoria]) target[categoria] = Array(12).fill(0);
      target[categoria][monthIndex] += valor;
    });

    return data;
  }, [lancamentos, year]);

  const format = (v) => (v ? `R$ ${v.toLocaleString("pt-BR")}` : "-");

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
    <div className="min-h-screen bg-zinc-950 text-white">
      <div className="flex justify-between p-4 border-b border-zinc-800">
        <div className="flex gap-4 items-center">
          <Wallet />
          <h1>Planejamento</h1>
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
            <span className="flex items-center gap-1 hover:text-white cursor-pointer">
              <Settings size={16} />
              Cadastro
            </span>
          </nav>
        </div>
        <div>Ano: {year}</div>
      </div>

      {page === "home" && (
        <HomePage summary={summary} processData={processData} />
      )}
      {page === "lancamentos" && (
        <LancamentosPage
          lancamentos={lancamentos}
          updateLancamento={updateLancamento}
          addLancamento={addLancamento}
        />
      )}
    </div>
  );
}
