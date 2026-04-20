export default function ToastConfirmacao({ toast }) {
  return (
    <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-50">
      <div className="bg-emerald-500/80 backdrop-blur-sm text-zinc-200 text-sm px-4 py-2 rounded-lg shadow-lg animate-toast">
        ✔ {toast.message}
      </div>
    </div>
  );
}
