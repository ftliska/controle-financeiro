import { Home, List, Settings, Wallet, User, LogOut } from "lucide-react";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import icon02 from "../../public/icon02.png";
import { NAV_ITENS } from "../Constants";

export default function NavbarHeader({ page, setPage, user, onLogout }) {
  const [hovered, setHovered] = useState(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    localStorage.setItem("activePage", page);
  }, [page]);

  return (
    <motion.div
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
      className={`
        sticky top-0 z-50
        backdrop-blur-md
        border-b border-zinc-700/50
        flex items-center justify-between
        transition-all duration-300
        ${
          scrolled
            ? "bg-[#0F1218]/90 shadow-lg py-2 px-6"
            : "bg-[#0F1218]/60 py-4 px-6"
        }
      `}
    >
      {/* LEFT */}
      <div className="flex gap-4 items-center">
        <img src={icon02} alt="Logo" className="w-9 h-9" />

        <h1
          className={`font-semibold tracking-wide transition-all duration-300 ${
            scrolled ? "text-sm" : "text-base"
          }`}
        >
          Controle Financeiro
        </h1>

        {/* NAV */}
        <nav className="flex gap-6 ml-6 text-sm relative">
          {NAV_ITENS.map((item) => {
            const Icon = item.icon;
            const isActive = page === item.page;
            const isHover = hovered === item.page;

            return (
              <div
                key={item.page}
                onClick={() => setPage(item.page)}
                onMouseEnter={() => setHovered(item.page)}
                onMouseLeave={() => setHovered(null)}
                className="relative flex items-center gap-1 cursor-pointer py-2"
              >
                <Icon
                  size={16}
                  className={`transition-all duration-200 ${
                    isActive || isHover
                      ? "text-white scale-110"
                      : "text-zinc-400"
                  }`}
                />

                <span
                  className={`transition-all duration-200 ${
                    isActive || isHover ? "text-white" : "text-zinc-400"
                  }`}
                >
                  {item.label}
                </span>

                {/* UNDERLINE */}
                {(isActive || isHover) && (
                  <motion.div
                    layoutId="underline"
                    className="absolute -bottom-1 left-0 right-0 h-[2px] bg-gradient-to-r from-emerald-400 to-sky-400 rounded-full"
                    transition={{ duration: 0.25 }}
                  />
                )}
              </div>
            );
          })}
        </nav>
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-3">
        <div
          className={`
            flex items-center gap-3 rounded-2xl border border-zinc-800 
            bg-zinc-900/50 px-3 py-2 text-sm text-white
            transition-all duration-300
            ${scrolled ? "scale-95" : "scale-100"}
          `}
        >
          <User size={18} className="text-sky-400" />
          <div className="leading-tight">
            <div className="font-medium">{user?.email || "Usuário"}</div>
            <div className="text-xs text-zinc-500">Logado</div>
          </div>
        </div>

        <button
          onClick={onLogout}
          className="
            flex items-center gap-2 rounded-full 
            border border-zinc-700 
            bg-zinc-900/70 px-4 py-2 text-xs text-zinc-300
            transition-all duration-200
            hover:border-emerald-400 
            hover:text-white 
            hover:bg-zinc-800
            hover:scale-105
            active:scale-95
          "
        >
          <LogOut size={16} />
          Sair
        </button>
      </div>
    </motion.div>
  );
}
