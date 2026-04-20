import { Home, List, Settings, Wallet } from "lucide-react";
import { useState } from "react";

export default function NavbarHeader({ setPage }) {
  const [activeUnderline, setActiveUnderline] = useState(0);
  const [hoveredUnderline, setHoveredUnderline] = useState(null);

  const navItems = [
    { page: "home", icon: Home, label: "Home" },
    { page: "lancamentos", icon: List, label: "Lançamentos" },
    { page: "cadastro", icon: Settings, label: "Cadastro" },
  ];

  return (
    <div className="flex justify-between p-4 border-b border-zinc-800">
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
    </div>
  );
}
