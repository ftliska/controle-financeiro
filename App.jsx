import { useState, useMemo } from "react";
import { ArrowUpRight, ArrowDownRight, PiggyBank, Home, List, Settings, Wallet } from "lucide-react";

export default function App() {
  const [page, setPage] = useState("home");
  const [year] = useState(2026);

  const months = ["Jan","Fev","Mar","Abr","Mai","Jun","Jul","Ago","Set","Out","Nov","Dez"];

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
      }
    ]);
  };

  const updateLancamento = (index, field, value) => {
    setLancamentos(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const formatCurrencyInput = (value) => {
    const numeric = value.replace(/\D/g, "");
    const number = Number(numeric) / 100;
    return number.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  };

  const parseCurrency = (value) => {
    return Number(value.replace(/[^\d,-]/g, "").replace(",", ".")) || 0;
  };

  const processData = useMemo(() => {
    const data = { entradas: {}, saidas: {}, economias: {} };

    lancamentos.forEach(l => {
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

  const format = (v) => v ? `R$ ${v.toLocaleString("pt-BR")}` : "-";

  const summary = useMemo(()=>{
    const sum = (obj) => Object.values(obj).flat().reduce((a,b)=>a+b,0);
    return {
      entradas: sum(processData.entradas),
      saidas: sum(processData.saidas),
      economias: sum(processData.economias)
    };
  }, [processData]);

  const renderTabelaHome = (titulo, color, dataset) => {
    const categorias = Object.keys(dataset);

    return (
      <div className="mb-8">
        <h2 className={`text-lg font-semibold ${color}`}>{titulo}</h2>
        <table className="w-full text-sm border border-zinc-800">
          <thead className="bg-zinc-800">
            <tr>
              <th>Categoria</th>
              {months.map(m => <th key={m}>{m}</th>)}
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {categorias.map(cat => {
              const valores = dataset[cat];
              const total = valores.reduce((a,b)=>a+b,0);
              return (
                <tr key={cat}>
                  <td>{cat}</td>
                  {valores.map((v,i)=>(<td key={i}>{format(v)}</td>))}
                  <td>{format(total)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  };

  const HomePage = () => (
    <div className="p-6">
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-zinc-900 p-4 rounded">
          <p className="flex gap-2 text-sm"><ArrowUpRight className="text-emerald-400" size={16}/> Entradas</p>
          <p className="text-emerald-400 text-xl">{format(summary.entradas)}</p>
        </div>

        <div className="bg-zinc-900 p-4 rounded">
          <p className="flex gap-2 text-sm"><ArrowDownRight className="text-red-400" size={16}/> Saídas</p>
          <p className="text-red-400 text-xl">{format(summary.saidas)}</p>
        </div>

        <div className="bg-zinc-900 p-4 rounded">
          <p className="flex gap-2 text-sm"><PiggyBank className="text-blue-400" size={16}/> Economias</p>
          <p className="text-blue-400 text-xl">{format(summary.economias)}</p>
        </div>
      </div>

      {renderTabelaHome("Entradas","text-emerald-400",processData.entradas)}
      {renderTabelaHome("Saídas","text-red-400",processData.saidas)}
      {renderTabelaHome("Economias","text-blue-400",processData.economias)}
    </div>
  );

  const LancamentosPage = () => (
    <div className="p-6">
      <div className="flex justify-between mb-4">
        <h2>Lançamentos</h2>
        <button onClick={addLancamento} className="bg-emerald-500 px-3 py-1 rounded">+ Novo</button>
      </div>

      <table className="w-full text-sm border border-zinc-800">
        <thead className="bg-zinc-800">
          <tr>
            <th>Data Lançamento</th>
            <th>Data Vencimento</th>
            <th>Descrição</th>
            <th>Categoria</th>
            <th>Lançamento</th>
            <th>Valor</th>
            <th>Status</th>
            <th>Obs</th>
          </tr>
        </thead>
        <tbody>
          {lancamentos.map((l,i)=>(
            <tr key={l.id} className="border-t border-zinc-800">
              <td><input type="date" value={l.dataLancamento} onChange={e=>updateLancamento(i,"dataLancamento",e.target.value)} className="w-full bg-zinc-900"/></td>
              <td><input type="date" value={l.dataVencimento} onChange={e=>updateLancamento(i,"dataVencimento",e.target.value)} className="w-full bg-zinc-900"/></td>
              <td><input value={l.descricao} onChange={e=>updateLancamento(i,"descricao",e.target.value)} className="w-full bg-zinc-900"/></td>
              <td><input value={l.categoria} onChange={e=>updateLancamento(i,"categoria",e.target.value)} className="w-full bg-zinc-900"/></td>
              <td>
                <select value={l.tipo} onChange={e=>updateLancamento(i,"tipo",e.target.value)} className="w-full bg-zinc-900">
                  <option>Receita</option>
                  <option>Despesa</option>
                  <option>Investimento</option>
                </select>
              </td>
              <td>
                <input
                  value={l.valor}
                  onChange={e=>updateLancamento(i,"valor",e.target.value)}
                  onBlur={e=>updateLancamento(i,"valor",formatCurrencyInput(e.target.value))}
                  className="w-full bg-zinc-900 text-right"
                />
              </td>
              <td>
                <select value={l.status} onChange={e=>updateLancamento(i,"status",e.target.value)} className="w-full bg-zinc-900">
                  <option>Previsto</option>
                  <option>Pago</option>
                </select>
              </td>
              <td><input value={l.obs} onChange={e=>updateLancamento(i,"obs",e.target.value)} className="w-full bg-zinc-900"/></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <div className="flex justify-between p-4 border-b border-zinc-800">
        <div className="flex gap-4 items-center">
          <Wallet />
          <h1>Planejamento</h1>
          <nav className="flex gap-4 ml-6">
            <span onClick={()=>setPage("home")} className="cursor-pointer flex gap-1"><Home size={16}/>Home</span>
            <span onClick={()=>setPage("lancamentos")} className="cursor-pointer flex gap-1"><List size={16}/>Lançamentos</span>
            <span className="flex gap-1"><Settings size={16}/>Cadastro</span>
          </nav>
        </div>
        <div>Ano: {year}</div>
      </div>

      {page === "home" && <HomePage />}
      {page === "lancamentos" && <LancamentosPage />}
    </div>
  );
}
