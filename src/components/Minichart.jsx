import { useId } from "react";
import { motion } from "framer-motion";
import { MONTHS } from "../Constants";

const MiniChart = ({ data, color = "#34d399" }) => {
  const id = useId();

  if (!data || data.length === 0) return null;

  const width = 280;
  const height = 90;
  const paddingX = 4;
  const paddingY = 14;

  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;

  const getX = (i) =>
    paddingX + (i * (width - paddingX * 2)) / (data.length - 1);

  const getY = (v) =>
    height - paddingY - ((v - min) / range) * (height - paddingY * 2);

  const points = data.map((v, i) => ({
    x: getX(i),
    y: getY(v),
  }));

  // 🔥 curva suave
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

  return (
    <div className="mt-5">
      <svg width={width} height={height}>
        <defs>
          <linearGradient id={`line-${id}`} x1="0" y1="0" x2="1" y2="0">
            <stop offset="100%" stopColor={color} stopOpacity="0.8" />
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

        {/* PONTOS */}
        {points.map((p, i) => (
          <g key={i}>
            {/* ponto */}
            <circle cx={p.x} cy={p.y} r="3" fill={color} />
          </g>
        ))}
      </svg>

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
