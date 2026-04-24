import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { formatBRL } from "../Utils";

export default function AccordionSection({
  title,
  total,
  icon,
  color,
  children,
  defaultOpen = false,
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="mb-4 border border-zinc-800 rounded-2xl overflow-hidden bg-[#1A1D26]/60 backdrop-blur">
      {/* HEADER */}
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="w-full flex items-center justify-between px-4 py-3 hover:bg-zinc-800/40 transition"
      >
        <div className="flex items-center gap-3">
          <div
            className="p-2 rounded-xl"
            style={{ backgroundColor: `${color}20` }}
          >
            {icon}
          </div>

          <div className="text-left">
            <p className={`text-sm ${color}`}>{title}</p>
            <p className="text-sm font-semibold" style={{ color }}>
              {formatBRL(total)}
            </p>
          </div>
        </div>

        <motion.div
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.25 }}
        >
          <ChevronDown className="text-zinc-400" size={18} />
        </motion.div>
      </button>

      {/* CONTENT */}
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
