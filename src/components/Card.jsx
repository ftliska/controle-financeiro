import { calcVariation, getBehavior, formatBRL } from "../Utils";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import MiniChart from "./Minichart";

export default function Card ({ title, value, prevValue, icon, color, dataset, type }) {
  const variation = calcVariation(value, prevValue);
  const { isGood } = getBehavior(type, variation);

  const isPositive = variation >= 0;

  const Icon = isPositive ? ArrowUpRight : ArrowDownRight;

  return (
    <div className="bg-[#22242b] p-5 rounded-2xl border border-[#3d4047] shadow-lg">
      {/* HEADER */}
      <div className="flex items-center gap-3 text-zinc-400">
        <div
          className="p-3 rounded-full"
          style={{ backgroundColor: `${color}20` }}
        >
          {icon}
        </div>
        <p className="text-lg">{title}</p>
      </div>

      {/* VALUE */}
      <p className="text-2xl font-semibold mt-3" style={{ color }}>
        {formatBRL(value)}
      </p>

      {/* VARIAÇÃO */}
      <div className="flex items-center gap-2 mt-2">
        <div
          className={`flex items-center gap-1 text-sm px-2 py-1 rounded-lg ${
            isGood
              ? "bg-emerald-500/10 text-emerald-400"
              : "bg-red-500/10 text-red-400"
          }`}
        >
          <Icon size={14} />
          {Math.abs(variation).toFixed(1)}%
        </div>

        <span className="text-xs text-zinc-500">
          vs ano anterior ({formatBRL(prevValue)})
        </span>
      </div>

      {/* TEXTO */}
      {/* <p className={`text-xs ${isGood ? "text-emerald-500" : "text-red-400"} mt-2`}>
        {getMessage(type, variation)}
      </p> */}

      {/* MINI GRÁFICO */}
      <MiniChart data={dataset} color={color} />
    </div>
  );
};