export default function Skeleton({ className = "" }) {
  return (
    <div
      className={`
        animate-pulse 
        bg-zinc-800/60 
        rounded-xl 
        ${className}
      `}
    />
  );
}
