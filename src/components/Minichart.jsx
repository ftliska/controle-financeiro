import { useId, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { MONTHS } from "../Constants";
import { formatBRL, getBehavior } from "../Utils";

const MiniChart = ({ data, color, datasetPrev, type }) => {
  const id = useId();
  const [hoverIndex, setHoverIndex] = useState(null);

  if (!data || data.length === 0) return null;

  const width = 280;
  const height = 90;
  const paddingX = 4;
  const paddingY = 14;

  const safeData = data.map((v) => Number(v) || 0);

  const max = Math.max(...safeData);
  const min = Math.min(...safeData);
  const range = max - min || 1;

  const getX = (i) =>
    paddingX + (i * (width - paddingX * 2)) / (data.length - 1);

  const getY = (v) =>
    height - paddingY - ((v - min) / range) * (height - paddingY * 2);

  const points = safeData.map((v, i) => ({
    x: getX(i),
    y: getY(v),
    value: v / 100,
  }));

  const getSmoothPath = (pts) => {
    let d = `M ${pts[0].x} ${pts[0].y}`;

    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = pts[i];
      const p1 = pts[i + 1];
      const cpX = (p0.x + p1.x) / 2;

      d += ` C ${cpX} ${p0.y}, ${cpX} ${p1.y}, ${p1.x} ${p1.y}`;
    }

    return d;
  };

  const linePath = getSmoothPath(points);

  const areaPath =
    linePath +
    ` L ${points[points.length - 1].x} ${height - paddingY}` +
    ` L ${points[0].x} ${height - paddingY} Z`;

  const hoveredPoint = hoverIndex !== null ? points[hoverIndex] : null;

  const prevValue =
    datasetPrev && hoverIndex !== null
      ? Number(datasetPrev[hoverIndex] || 0)
      : 0;

  const currentValue = hoveredPoint?.value || 0;

  const variation =
    prevValue === 0
      ? 0
      : ((currentValue - prevValue / 100) / (prevValue / 100)) * 100;

  const { isGood } = getBehavior(type, variation);

  return (
    <div className="mt-5 relative select-none">
      <svg
        width={width}
        height={height}
        onMouseLeave={() => setHoverIndex(null)}
      >
        <defs>
          <linearGradient id={`line-${id}`} x1="0" y1="0" x2="1" y2="0">
            <stop offset="100%" stopColor={color} stopOpacity="0.7" />
            <stop offset="100%" stopColor={color} stopOpacity="1" />
          </linearGradient>

          <linearGradient id={`area-${id}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.35" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* BASELINE */}
        <line
          x1={paddingX}
          x2={width - paddingX}
          y1={height - paddingY}
          y2={height - paddingY}
          stroke="#27272a"
          strokeWidth="1"
        />

        {/* ÁREA */}
        <motion.path
          d={areaPath}
          fill={`url(#area-${id})`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        />

        {/* LINHA */}
        <motion.path
          d={linePath}
          fill="none"
          stroke={`url(#line-${id})`}
          strokeWidth="2"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1, ease: "easeInOut" }}
        />

        {/* INTERAÇÃO (hit area invisível) */}
        {points.map((p, i) => (
          <rect
            key={i}
            x={p.x - 10}
            y={0}
            width={20}
            height={height}
            fill="white"
            opacity="0"
            style={{ cursor: "pointer" }}
            onMouseEnter={() => setHoverIndex(i)}
          />
        ))}

        {/* PONTOS */}
        {points.map((p, i) => (
          <g key={i}>
            {/* ponto */}
            <circle cx={p.x} cy={p.y} r="3" fill={color} />
          </g>
        ))}
      </svg>

      {/* TOOLTIP */}
      <AnimatePresence mode="wait">
        {hoveredPoint && (
          <motion.div
            key={hoverIndex}
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.95 }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 20,
            }}
            className="absolute z-50 -translate-x-1/2 -translate-y-full 
                 bg-zinc-900/95 backdrop-blur-md
                 border border-zinc-700 text-white 
                 text-xs px-3 py-2 rounded-lg shadow-xl pointer-events-none"
            style={{
              left: hoveredPoint.x,
              top: hoveredPoint.y - 10,
            }}
          >
            {/* MÊS */}
            <div className="text-zinc-400 text-[10px]">
              {MONTHS[hoverIndex]}
            </div>

            {/* VALOR ATUAL */}
            <div className="font-semibold" style={{ color }}>
              {formatBRL(currentValue * 100)}
            </div>

            {/* VALOR ANTERIOR */}
            {datasetPrev && (
              <div
                className={`text-[10px] mt-1 flex items-center gap-1 ${
                  isGood ? "text-emerald-400" : "text-red-400"
                }`}
              >
                {variation >= 0 ? "▲" : "▼"} {Math.abs(variation).toFixed(1)}%
                <span className="text-zinc-500 ml-1">
                  vs {MONTHS[hoverIndex]} ({formatBRL(prevValue)})
                </span>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* MESES PERFEITAMENTE ALINHADOS */}
      <div className="relative mt-2 h-4">
        {points.map((p, i) => (
          <span
            key={i}
            className="absolute text-[10px] font-semibold text-zinc-500 -translate-x-1/2"
            style={{ left: p.x }}
          >
            {MONTHS[i]}
          </span>
        ))}
      </div>
    </div>
  );
};

export default MiniChart;
