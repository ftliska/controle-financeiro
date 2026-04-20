import { Home, List, Settings, Wallet, User, LogOut } from "lucide-react";
import { useState } from "react";

export default function NavbarHeader({ setPage, user, onLogout }) {
  const [activeUnderline, setActiveUnderline] = useState(0);
  const [hoveredUnderline, setHoveredUnderline] = useState(null);

  const navItems = [
    { page: "home", icon: Home, label: "Home" },
    { page: "lancamentos", icon: List, label: "Lançamentos" },
    { page: "cadastro", icon: Settings, label: "Cadastro" },
  ];

  return (
    <div className="flex items-center justify-between p-4 border-b border-zinc-800">
      <div className="flex gap-4 items-center">
        <Wallet />
        <h1>Controle Financeiro</h1>
        <nav className="flex gap-6 ml-6 text-sm text-zinc-400 relative">
          {navItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <span
                key={index}
                onClick={() => {
                  setPage(item.page);
                  setActiveUnderline(index);
                }}
                onMouseEnter={() => setHoveredUnderline(index)}
                onMouseLeave={() => setHoveredUnderline(null)}
                className="flex items-center gap-1 hover:text-white cursor-pointer relative py-2"
              >
                <Icon size={16} />
                {item.label}
                <div
                  className={`absolute bottom-0 left-0 right-0 h-0.5 bg-white transition-transform duration-300 origin-left ${
                    hoveredUnderline === index || activeUnderline === index
                      ? "scale-x-100"
                      : "scale-x-0"
                  }`}
                />
              </span>
            );
          })}
        </nav>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-3 rounded-2xl border border-zinc-800 bg-zinc-950/50 px-3 py-2 text-sm text-white">
          <User size={18} className="text-sky-400" />
          <div className="leading-tight">
            <div className="font-medium">{user?.email || "Usuário"}</div>
            <div className="text-xs text-zinc-500">Logado</div>
          </div>
        </div>

        <button
          onClick={onLogout}
          className="rounded-full border border-zinc-700 bg-zinc-900/80 px-4 py-2 text-xs text-zinc-300 transition hover:border-sky-400 hover:text-white"
        >
          <LogOut size={16} />
          Sair
        </button>
      </div>
    </div>
  );
}
