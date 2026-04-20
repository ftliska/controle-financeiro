import { useState } from "react";
import { Mail, Lock, Wallet, ArrowRight } from "lucide-react";

export default function LoginPage({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!email || !password) {
      setError("Preencha e-mail e senha.");
      return;
    }

    const emailIsValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!emailIsValid) {
      setError("Informe um e-mail válido.");
      return;
    }

    setError("");
    onLogin(email);
  };

  return (
    <div className="min-h-screen bg-[#14171F] text-white flex items-center justify-center px-4">
      <div className="relative w-full max-w-sm overflow-hidden rounded-[1.75rem] border border-[#3d4047] bg-[#22242b]/95 py-10 px-8 shadow-[0_15px_50px_rgba(0,0,0,0.35)]">
        <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-sky-900/10 to-transparent" />
        <div className="relative z-10 space-y-8">
          <div className="flex flex-col items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-sky-500/10 text-sky-300">
              <Wallet size={22} />
            </div>
            <div className="text-center">
              <h1 className="text-2xl font-semibold">Entrar</h1>
              <p className="mt-2 text-sm text-zinc-400">
                Acesse seu painel financeiro.
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="">
            <label className="block text-sm text-zinc-300">
              E-mail
              <div className="mt-2 relative">
                <Mail
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500"
                  size={16}
                />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-3xl border border-[#3d4047] bg-[#14171F] px-12 py-3 text-white outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20"
                  placeholder="seu@email.com"
                />
              </div>
            </label>

            <label className="block text-sm text-zinc-300 mt-4">
              Senha
              <div className="mt-2 relative">
                <Lock
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500"
                  size={16}
                />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-3xl border border-[#3d4047] bg-[#14171F] px-12 py-3 text-white outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20"
                  placeholder="••••••••"
                />
              </div>
            </label>

            {error && <p className="text-sm text-rose-400 mt-4">{error}</p>}
            <div className="flex justify-center mt-10">
              <button
                type="submit"
                className="inline-flex w-[180px] items-center justify-center gap-2 rounded-3xl border border-[#3d4047] bg-[#14171F] px-4 py-3 text-sm font-semibold text-white transition duration-200 hover:bg-sky-400"
              >
                Entrar
                <ArrowRight size={18} />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
