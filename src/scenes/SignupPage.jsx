import { useState } from "react";
import { Mail, Lock, Wallet, ArrowRight, Eye, EyeOff } from "lucide-react";
import { motion } from "framer-motion";
import { supabase } from "../services/supabase";

export default function SignupPage({ onLogin, onSwitchToLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password || !confirmPassword) {
      setError("Preencha todos os campos.");
      return;
    }

    if (password.length < 6) {
      setError("A senha deve ter pelo menos 6 caracteres.");
      return;
    }

    if (password !== confirmPassword) {
      setError("As senhas não coincidem.");
      return;
    }

    setError("");
    setLoading(true);

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    onLogin(data.user.email);
  };

  return (
    <div className="min-h-screen bg-[#14171F] text-white flex items-center justify-center px-4 relative overflow-hidden">
      {/* BACKGROUND GLOW */}
      <div className="absolute w-[500px] h-[500px] bg-emerald-500/10 blur-[120px] rounded-full top-[-100px] left-[-100px]" />
      <div className="absolute w-[400px] h-[400px] bg-sky-500/10 blur-[120px] rounded-full bottom-[-100px] right-[-100px]" />

      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="relative w-full max-w-sm"
      >
        <div className="rounded-[2rem] border border-white/5 bg-[#1A1D26]/80 backdrop-blur-xl p-8 shadow-[0_20px_60px_rgba(0,0,0,0.45)]">
          {/* HEADER */}
          <div className="flex flex-col items-center gap-4 mb-8">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-400/10 text-emerald-400 shadow-inner">
              <Wallet size={22} />
            </div>

            <div className="text-center">
              <h1 className="text-2xl font-semibold">Criar conta</h1>
              <p className="mt-1 text-sm text-zinc-400">
                Comece a controlar suas finanças
              </p>
            </div>
          </div>

          {/* FORM */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* EMAIL */}
            <div>
              <label className="text-sm text-zinc-400">E-mail</label>
              <div className="mt-2 relative group">
                <Mail
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-emerald-400 transition"
                  size={16}
                />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                  className="w-full rounded-2xl border border-zinc-700 bg-[#14171F]/80 px-12 py-3 text-white outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20"
                />
              </div>
            </div>

            {/* SENHA */}
            <div>
              <label className="text-sm text-zinc-400">Senha</label>
              <div className="mt-2 relative group">
                <Lock
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-emerald-400 transition"
                  size={16}
                />

                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-2xl border border-zinc-700 bg-[#14171F]/80 px-12 pr-12 py-3 text-white outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* CONFIRMAR SENHA */}
            <div>
              <label className="text-sm text-zinc-400">Confirmar senha</label>
              <div className="mt-2 relative">
                <Lock
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500"
                  size={16}
                />
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-2xl border border-zinc-700 bg-[#14171F]/80 px-12 py-3 text-white outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20"
                />
              </div>
            </div>

            {/* ERRO */}
            <motion.div
              key={error}
              initial={{ x: 0 }}
              animate={error ? { x: [-5, 5, -4, 4, 0] } : {}}
              transition={{ duration: 0.3 }}
            >
              {error && <p className="text-sm text-rose-400">{error}</p>}
            </motion.div>

            {/* BOTÃO */}
            <motion.button
              whileHover={!loading ? { scale: 1.03 } : {}}
              whileTap={!loading ? { scale: 0.97 } : {}}
              disabled={loading}
              type="submit"
              className="w-full flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-400 to-sky-400 px-4 py-3 text-sm font-semibold text-black shadow-lg disabled:opacity-60"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  Criar conta
                  <ArrowRight size={18} />
                </>
              )}
            </motion.button>

            {/* LINK LOGIN */}
            <p className="text-center text-sm text-zinc-400 mt-4">
              Já tem conta?{" "}
              <button
                type="button"
                onClick={onSwitchToLogin}
                className="text-emerald-400 hover:underline"
              >
                Entrar
              </button>
            </p>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
