import { useState, useRef } from "react";
import {
  Mail,
  Lock,
  Wallet,
  ArrowRight,
  Eye,
  EyeOff,
  User,
  Phone,
  Calendar,
} from "lucide-react";
import { motion } from "framer-motion";
import { supabase } from "../services/supabase";
import icon02 from "../../public/icon02.png";

/* ---------- HELPERS ---------- */

const formatPhone = (value) => {
  const digits = value.replace(/\D/g, "").slice(0, 11);

  if (digits.length <= 10) {
    return digits
      .replace(/(\d{2})(\d)/, "($1) $2")
      .replace(/(\d{4})(\d)/, "$1-$2");
  }

  return digits
    .replace(/(\d{2})(\d)/, "($1) $2")
    .replace(/(\d{5})(\d)/, "$1-$2");
};

const getPasswordStrength = (password) => {
  let score = 0;
  if (password.length >= 6) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  return score;
};

export default function SignupPage({ onSwitchToLogin }) {
  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [dataNascimento, setDataNascimento] = useState("");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [fieldErrors, setFieldErrors] = useState({});
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const refs = {
    nome: useRef(),
    telefone: useRef(),
    dataNascimento: useRef(),
    email: useRef(),
    password: useRef(),
    confirmPassword: useRef(),
  };

  const inputStyle = (field) => `
    w-full rounded-2xl
    border
    bg-[#14171F]/80
    px-12 py-3 
    text-white 
    outline-none
    transition-all duration-200
    ${
      fieldErrors[field]
        ? "border-rose-500 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20"
        : "border-zinc-700 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20"
    }
  `;

  const validateField = (field, value) => {
    let err = "";

    if (!value) err = "Obrigatório";

    if (field === "email" && value) {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) err = "E-mail inválido";
    }

    if (field === "password" && value) {
      if (value.length < 6) err = "Mínimo 6 caracteres";
    }

    if (field === "confirmPassword" && value) {
      if (value !== password) err = "Senhas diferentes";
    }

    setFieldErrors((prev) => ({ ...prev, [field]: err }));
  };

  const focusFirstError = (errors) => {
    const first = Object.keys(errors)[0];
    refs[first]?.current?.focus();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const errors = {};

    if (!nome) errors.nome = true;
    if (!telefone) errors.telefone = true;
    if (!dataNascimento) errors.dataNascimento = true;

    if (!email) errors.email = true;
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = true;

    if (!password || password.length < 6) errors.password = true;
    if (password !== confirmPassword) errors.confirmPassword = true;

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      focusFirstError(errors);
      return;
    }

    setFieldErrors({});
    setLoading(true);

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          nome,
          telefone,
          data_nascimento: dataNascimento,
        },
      },
    });

    setLoading(false);

    if (error) {
      setError("Erro ao criar conta.");
    }
  };

  const strength = getPasswordStrength(password);

  const strengthColor = [
    "bg-red-500",
    "bg-orange-400",
    "bg-yellow-400",
    "bg-emerald-400",
  ][strength - 1];

  return (
    <div className="min-h-screen bg-[#14171F] text-white flex items-center justify-center px-4 relative overflow-hidden">
      {/* BACKGROUND */}
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
            <div className="flex w-24 h-24 items-center justify-center rounded-full bg-[#14171F]/80 shadow-inner">
              <img src={icon02} alt="Logo" className="w-20 h-20" />
            </div>

            <div className="text-center">
              <h1 className="text-2xl font-semibold tracking-wide">
                Criar conta
              </h1>
              <p className="mt-1 text-sm text-zinc-400">
                Comece a controlar suas finanças
              </p>
            </div>
          </div>

          {/* FORM */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* NOME */}
            <div className="relative group">
              <User
                className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500"
                size={16}
              />
              <input
                ref={refs.nome}
                placeholder="Nome Completo"
                value={nome}
                onChange={(e) => {
                  setNome(e.target.value);
                  validateField("nome", e.target.value);
                }}
                className={inputStyle("nome")}
              />
            </div>

            {/* TELEFONE */}
            <div className="relative group">
              <Phone
                className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500"
                size={16}
              />
              <input
                ref={refs.telefone}
                placeholder="(61) 99999-9999"
                value={telefone}
                onChange={(e) => {
                  const v = formatPhone(e.target.value);
                  setTelefone(v);
                  validateField("telefone", v);
                }}
                className={inputStyle("telefone")}
              />
            </div>

            {/* DATA */}
            <div className="relative group">
              <Calendar
                className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500"
                size={16}
              />
              <input
                ref={refs.dataNascimento}
                type="date"
                value={dataNascimento}
                onChange={(e) => {
                  setDataNascimento(e.target.value);
                  validateField("dataNascimento", e.target.value);
                }}
                className={inputStyle("dataNascimento")}
              />
            </div>

            {/* EMAIL */}
            <div className="relative group">
              <Mail
                className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500"
                size={16}
              />
              <input
                ref={refs.email}
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  validateField("email", e.target.value);
                }}
                className={inputStyle("email")}
              />
            </div>

            {/* SENHA */}
            <div className="relative group">
              <Lock
                className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500"
                size={16}
              />

              <input
                ref={refs.password}
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  validateField("password", e.target.value);
                }}
                className={inputStyle("password")}
              />

              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            {/* FORÇA DA SENHA */}
            {password && (
              <div className="h-1 rounded bg-zinc-700 overflow-hidden">
                <div
                  className={`h-full ${strengthColor}`}
                  style={{ width: `${(strength / 4) * 100}%` }}
                />
              </div>
            )}

            {/* CONFIRMAR SENHA */}
            <div className="relative group">
              <Lock
                className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500"
                size={16}
              />

              <input
                ref={refs.confirmPassword}
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirmar senha"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  validateField("confirmPassword", e.target.value);
                }}
                className={inputStyle("confirmPassword")}
              />
            </div>

            {/* ERRO */}
            {error && <p className="text-sm text-rose-400">{error}</p>}

            {/* BOTÃO */}
            <motion.button
              whileHover={!loading ? { scale: 1.03 } : {}}
              whileTap={!loading ? { scale: 0.97 } : {}}
              disabled={loading}
              type="submit"
              className="
                w-full flex items-center justify-center gap-2
                rounded-2xl
                bg-gradient-to-r from-emerald-400 to-sky-400
                px-4 py-3
                text-sm font-semibold text-black
                shadow-lg
                disabled:opacity-60
              "
            >
              {loading ? (
                "Criando..."
              ) : (
                <>
                  Criar conta <ArrowRight size={18} />
                </>
              )}
            </motion.button>

            {/* LINK LOGIN */}
            <div className="text-center text-sm text-zinc-400 mt-4">
              Já tem conta?
              <button
                type="button"
                onClick={onSwitchToLogin}
                className="ml-1 text-emerald-400 hover:text-emerald-300"
              >
                Entrar →
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
