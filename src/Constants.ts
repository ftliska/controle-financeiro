import {
  DollarSign,
  Zap,
  Car,
  Home,
  CreditCard,
  ShoppingCart,
  ArrowDownCircle,
  PiggyBank,
  Droplet,
  CreditCardIcon,
  HeartPulse,
} from "lucide-react";

export const MONTHS = [
  "Jan",
  "Fev",
  "Mar",
  "Abr",
  "Mai",
  "Jun",
  "Jul",
  "Ago",
  "Set",
  "Out",
  "Nov",
  "Dez",
];

export const CADASTROS = [
  {
    descricao: "Cartão Elo",
    categoria: "Contas",
    tipo: "Despesa",
    id: crypto.randomUUID(),
  },
  {
    descricao: "Cartão Visa",
    categoria: "Contas",
    tipo: "Despesa",
    id: crypto.randomUUID(),
  },
  {
    descricao: "Cartão Master",
    categoria: "Contas",
    tipo: "Despesa",
    id: crypto.randomUUID(),
  },
  {
    descricao: "Outros pessoais",
    categoria: "Contas",
    tipo: "Despesa",
    id: crypto.randomUUID(),
  },
  {
    descricao: "Cartão Elo",
    categoria: "Contas",
    tipo: "Despesa",
    id: crypto.randomUUID(),
  },
  {
    descricao: "IPVA",
    categoria: "Transporte",
    tipo: "Despesa",
    id: crypto.randomUUID(),
  },
  {
    descricao: "Reserva de emergência",
    categoria: "Investimento",
    tipo: "Investimento",
    id: crypto.randomUUID(),
  },
  {
    descricao: "Renda variável - Fiis",
    categoria: "Investimento",
    tipo: "Investimento",
    id: crypto.randomUUID(),
  },
  {
    descricao: "Renda variável - Ações",
    categoria: "Investimento",
    tipo: "Investimento",
    id: crypto.randomUUID(),
  },
  {
    descricao: "Auxílio TRI",
    categoria: "Renda",
    tipo: "Receita",
    id: crypto.randomUUID(),
  },
  {
    descricao: "Dividendos",
    categoria: "Renda",
    tipo: "Receita",
    id: crypto.randomUUID(),
  },
  {
    descricao: "Férias",
    categoria: "Renda",
    tipo: "Receita",
    id: crypto.randomUUID(),
  },
  {
    descricao: "FGTS",
    categoria: "Renda",
    tipo: "Receita",
    id: crypto.randomUUID(),
  },
  {
    descricao: "PLR",
    categoria: "Renda",
    tipo: "Receita",
    id: crypto.randomUUID(),
  },
  {
    descricao: "Renda extra",
    categoria: "Renda",
    tipo: "Receita",
    id: crypto.randomUUID(),
  },
  {
    descricao: "Renda extra cônjuge",
    categoria: "Renda",
    tipo: "Receita",
    id: crypto.randomUUID(),
  },
  {
    descricao: "Renda fixa",
    categoria: "Renda",
    tipo: "Receita",
    id: crypto.randomUUID(),
  },
  {
    descricao: "Restituição IRPF",
    categoria: "Renda",
    tipo: "Receita",
    id: crypto.randomUUID(),
  },
  {
    descricao: "Salário",
    categoria: "Renda",
    tipo: "Receita",
    id: crypto.randomUUID(),
  },
  {
    descricao: "Salário - 13°",
    categoria: "Renda",
    tipo: "Receita",
    id: crypto.randomUUID(),
  },
  {
    descricao: "Salário cônjuge",
    categoria: "Renda",
    tipo: "Receita",
    id: crypto.randomUUID(),
  },
  {
    descricao: "Transferências",
    categoria: "Renda",
    tipo: "Receita",
    id: crypto.randomUUID(),
  },
  {
    descricao: "Cassi",
    categoria: "Saúde",
    tipo: "Despesa",
    id: crypto.randomUUID(),
  },
  {
    descricao: "Aluguel",
    categoria: "Moradia",
    tipo: "Despesa",
    id: crypto.randomUUID(),
  },
  {
    descricao: "Água",
    categoria: "Moradia",
    tipo: "Despesa",
    id: crypto.randomUUID(),
  },
  {
    descricao: "Energia",
    categoria: "Moradia",
    tipo: "Despesa",
    id: crypto.randomUUID(),
  },
];

export const ICONS_BY_DESCRICAO = {
  Salário: DollarSign,
  Energia: Zap,
  IPVA: Car,
  Aluguel: Home,
  Cartão: CreditCard,
  Mercado: ShoppingCart,
  Água: Droplet,
  Cassi: HeartPulse,
  "Cartão Visa": CreditCardIcon,
  "Cartão Master": CreditCardIcon,
  "Cartão Elo": CreditCardIcon,
};

export const ICONS_BY_TYPE = {
  Receita: DollarSign,
  Despesa: ArrowDownCircle,
  Investimento: PiggyBank,
};

export const INITIAL_FORM = {
  dataVencimento: "",
  descricao: "",
  valor: "",
  status: "Previsto",
  parcelado: false,
  parcelasPagas: "",
  parcelasTotais: "",
  obs: "",
};
