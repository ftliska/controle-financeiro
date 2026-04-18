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

export default function App() {
  const [page, setPage] = useState("home");
  const [year] = useState(2026);

  const months = [
    "Jan",
    "Fev",
    "Mar",
    "Abr",
    "Mai",
    "Jun",
    "Jul",
    "Ago",
    "Set",
    "Out",
    "Nov",
    "Dez",
  ];

  const [lancamentos, setLancamentos] = useState([]);

  const addLancamento = () => {
    setLancamentos([
      ...lancamentos,
      {
        id: Date.now(),
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

  const updateLancamento = (index, field, value) => {
    setLancamentos((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: value } : item)),
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

  const renderTabelaHome = (titulo, color, dataset) => {
    const categorias = Object.keys(dataset);

    return (
      <div className="mb-8">
        <h2 className={`text-lg font-semibold mb-2 ${color}`}>{titulo}</h2>

        <div className="border border-zinc-800 rounded-xl overflow-hidden">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-zinc-900">
              <tr>
                <th className="p-2 text-left border-b border-zinc-800">
                  Categoria
                </th>
                {months.map((m) => (
                  <th key={m} className="p-2 border-b border-zinc-800">
                    {m}
                  </th>
                ))}
                <th className="p-2 border-b border-zinc-800">Total</th>
              </tr>
            </thead>

            <tbody>
              {categorias.map((cat) => {
                const valores = dataset[cat];
                const total = valores.reduce((a, b) => a + b, 0);

                return (
                  <tr
                    key={cat}
                    className="odd:bg-zinc-950 even:bg-zinc-900/50 hover:bg-zinc-800 transition"
                  >
                    <td className="p-2">{cat}</td>

                    {valores.map((v, i) => (
                      <td key={i} className="text-center p-2">
                        {format(v)}
                      </td>
                    ))}

                    <td className="text-center font-semibold p-2">
                      {format(total)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const HomePage = () => (
    <div className="max-w-7xl mx-auto px-6 py-6">
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-zinc-900 p-5 rounded-2xl shadow-lg border border-zinc-800 hover:scale-[1.02] transition">
          <p className="flex items-center gap-2 text-sm text-zinc-400">
            <ArrowUpRight className="text-emerald-400" size={18} />
            Entradas
          </p>
          <p className="text-2xl font-semibold text-emerald-400 mt-2">
            {format(summary.entradas)}
          </p>
        </div>

        <div className="bg-zinc-900 p-5 rounded-2xl shadow-lg border border-zinc-800 hover:scale-[1.02] transition">
          <p className="flex items-center gap-2 text-sm text-zinc-400">
            <ArrowDownRight className="text-red-400" size={18} />
            Saídas
          </p>
          <p className="text-2xl font-semibold text-red-400 mt-2">
            {format(summary.saidas)}
          </p>
        </div>

        <div className="bg-zinc-900 p-5 rounded-2xl shadow-lg border border-zinc-800 hover:scale-[1.02] transition">
          <p className="flex items-center gap-2 text-sm text-zinc-400">
            <PiggyBank className="text-blue-400" size={18} />
            Economias
          </p>
          <p className="text-2xl font-semibold text-blue-400 mt-2">
            {format(summary.economias)}
          </p>
        </div>
      </div>

      {renderTabelaHome("Entradas", "text-emerald-400", processData.entradas)}
      {renderTabelaHome("Saídas", "text-red-400", processData.saidas)}
      {renderTabelaHome("Economias", "text-blue-400", processData.economias)}
    </div>
  );

  const LancamentosPage = () => (
    <div className="max-w-7xl mx-auto px-6 py-6">
      <div className="flex justify-between mb-4">
        <h2>Lançamentos</h2>
        <button
          onClick={addLancamento}
          className="bg-emerald-500 hover:bg-emerald-600 transition px-4 py-2 rounded-lg shadow"
        >
          + Novo
        </button>
      </div>

      <div className="border border-zinc-800 rounded-xl overflow-hidden">
        <table className="w-full text-sm border-collapse">
          <thead className="bg-zinc-900">
            <tr>
              <th className="p-2 border-b border-zinc-800">Data Lançamento</th>
              <th className="p-2 border-b border-zinc-800">Data Vencimento</th>
              <th className="p-2 border-b border-zinc-800">Descrição</th>
              <th className="p-2 border-b border-zinc-800">Categoria</th>
              <th className="p-2 border-b border-zinc-800">Lançamento</th>
              <th className="p-2 border-b border-zinc-800">Valor</th>
              <th className="p-2 border-b border-zinc-800">Status</th>
              <th className="p-2 border-b border-zinc-800">Obs</th>
            </tr>
          </thead>
          <tbody>
            {lancamentos.map((l, i) => (
              <tr
                key={l.id}
                className="odd:bg-zinc-950 even:bg-zinc-900/50 hover:bg-zinc-800 transition"
              >
                <td className="p-2">
                  <input
                    type="date"
                    value={l.dataLancamento}
                    onChange={(e) =>
                      updateLancamento(l.id, "dataLancamento", e.target.value)
                    }
                    className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </td>
                <td className="p-2">
                  <input
                    type="date"
                    value={l.dataVencimento}
                    onChange={(e) =>
                      updateLancamento(l.id, "dataVencimento", e.target.value)
                    }
                    className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </td>
                <td className="p-2">
                  <input
                    value={l.descricao}
                    onChange={(e) =>
                      updateLancamento(l.id, "descricao", e.target.value)
                    }
                    className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </td>
                <td className="p-2">
                  <input
                    value={l.categoria}
                    onChange={(e) =>
                      updateLancamento(l.id, "categoria", e.target.value)
                    }
                    className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </td>
                <td className="p-2">
                  <select
                    value={l.tipo}
                    onChange={(e) =>
                      updateLancamento(l.id, "tipo", e.target.value)
                    }
                    className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-2 py-1 focus:ring-2 focus:ring-emerald-500"
                  >
                    <option>Receita</option>
                    <option>Despesa</option>
                    <option>Investimento</option>
                  </select>
                </td>
                <td className="p-2">
                  <input
                    value={l.valor}
                    onChange={(e) => {
                      const raw = e.target.value.replace(/\D/g, "");
                      const formatted = (Number(raw) / 100).toLocaleString(
                        "pt-BR",
                        {
                          style: "currency",
                          currency: "BRL",
                        },
                      );

                      updateLancamento(l.id, "valor", formatted);
                    }}
                    className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </td>
                <td className="p-2">
                  <select
                    value={l.status}
                    onChange={(e) =>
                      updateLancamento(l.id, "status", e.target.value)
                    }
                    className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-2 py-1 focus:ring-2 focus:ring-emerald-500"
                  >
                    <option>Previsto</option>
                    <option>Pago</option>
                  </select>
                </td>
                <td className="p-2">
                  <input
                    value={l.obs}
                    onChange={(e) =>
                      updateLancamento(l.id, "obs", e.target.value)
                    }
                    className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-2 py-1 focus:ring-2 focus:ring-emerald-500"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

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

      {page === "home" && <HomePage />}
      {page === "lancamentos" && <LancamentosPage />}
    </div>
  );
}
