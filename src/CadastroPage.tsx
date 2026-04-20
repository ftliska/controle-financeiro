import { CADASTROS } from "./Constants";

export default function CadastroPage() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-6">
      <div className="flex justify-between mb-4">
        <h2>Cadastro</h2>
      </div>

      <div className="border border-zinc-700 rounded-xl overflow-hidden">
        <table className="w-full text-sm border-collapse">
          <thead className="bg-zinc-900">
            <tr>
              <th className="p-2 border-b border-zinc-800">Descrição</th>
              <th className="p-2 border-b border-zinc-800">Categoria</th>
              <th className="p-2 border-b border-zinc-800">Tipo gasto</th>
            </tr>
          </thead>
          <tbody>
            {CADASTROS.map((l) => (
              <tr
                key={l.id}
                className="odd:bg-zinc-950 even:bg-zinc-900/50 hover:bg-zinc-800 transition"
              >
                <td className="w-full px-2 py-1 focus:outline-none focus:ring-2 focus:ring-emerald-500">
                  {l.descricao}
                </td>
                <td className="w-full px-2 py-1 focus:outline-none focus:ring-2 focus:ring-emerald-500">
                  {l.categoria}
                </td>
                <td className="w-full px-2 py-1 focus:outline-none focus:ring-2 focus:ring-emerald-500">
                  {l.tipo}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
