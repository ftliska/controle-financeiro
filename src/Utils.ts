import { ICONS_BY_DESCRICAO, ICONS_BY_TYPE, MONTHS } from "./Constants";

export const formatBRL = (value: number | string) => {
  const num = Number(value);

  if (!num) return "-"; // pega 0, null, undefined, "", etc

  // Divide por 100 pois o valor está armazenado em centavos
  return (num / 100).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
};

export const parseBRL = (value: string | number) => {
  const str = String(value);

  // Se é um número já processado, retorna direto
  if (!isNaN(Number(str)) && !str.includes(",") && !str.includes(".")) {
    return Number(str);
  }

  // Remove tudo que não é dígito
  const numeric = str.replace(/\D/g, "");

  // Multiplica por 100 para converter reais em centavos
  return Number(numeric);
};

export const formatDateLocal = (date: Date) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");

  return `${y}-${m}-${d}`;
};

export const parseDateLocal = (dateString) => {
  if (!dateString) return null;

  const [year, month, day] = dateString.split("-");
  return new Date(year, month - 1, day);
};

function getSafeDate(year, month, day) {
  // cria sempre no meio do dia pra evitar qualquer shift de timezone
  const temp = new Date(year, month, 15);

  // último dia do mês
  const lastDay = new Date(year, month + 1, 0).getDate();

  const safeDay = Math.min(day, lastDay);

  temp.setDate(safeDay);

  return temp;
}

export const createLancamentos = (form, cadastro, valor, hoje) => {
  const novos = [];
  const valorEmCentavos = parseBRL(valor);
  if (form.parcelado) {
    const pagas = Number(form.parcelasPagas) || 0;
    const total = Number(form.parcelasTotais) || 0;
    const restantes = total - pagas;
    const totalFormatado = String(total).padStart(2, "0");
    const obsBase = form.obs?.trim();
    for (let i = 0; i < restantes; i++) {
      const [year, month, day] = form.dataVencimento.split("-");
      const baseYear = Number(year);
      const baseMonth = Number(month) - 1;
      const baseDay = Number(day);

      const newMonth = baseMonth + i;
      const newYear = baseYear + Math.floor(newMonth / 12);
      const adjustedMonth = ((newMonth % 12) + 12) % 12;

      const data = getSafeDate(newYear, adjustedMonth, baseDay);

      const numeroParcela = String(pagas + i + 1).padStart(2, "0");

      const obsFinal = obsBase
        ? `${obsBase} - Parcela ${numeroParcela}/${totalFormatado}`
        : `Parcela ${numeroParcela}/${totalFormatado}`;

      novos.push({
        id: crypto.randomUUID(),
        dataLancamento: hoje,
        dataVencimento: formatDateLocal(data),
        descricao: form.descricao,
        categoria: cadastro.categoria,
        tipo: cadastro.tipo,
        valor: valorEmCentavos,
        status: form.status,
        obs: obsFinal,
      });
    }
  } else {
    novos.push({
      id: crypto.randomUUID(),
      dataLancamento: hoje,
      dataVencimento: form.dataVencimento,
      descricao: form.descricao,
      categoria: cadastro.categoria,
      tipo: cadastro.tipo,
      valor: valorEmCentavos,
      status: form.status,
      obs: form.obs,
    });
  }
  return novos;
};

export const getIcon = (descricao, tipo) => {
  if (ICONS_BY_DESCRICAO[descricao]) {
    return ICONS_BY_DESCRICAO[descricao];
  }

  return ICONS_BY_TYPE[tipo];
};

export const getMessage = (type, value) => {
  const abs = Math.abs(value).toFixed(2).replace(".", ",");

  if (type === "entradas") {
    return value >= 0
      ? `Sua receita aumentou ${abs}%`
      : `Sua receita caiu ${abs}%`;
  }

  if (type === "saidas") {
    return value >= 0
      ? `Você gastou ${abs}% mais`
      : `Você reduziu gastos em ${abs}%`;
  }

  if (type === "economias") {
    return value >= 0
      ? `Você guardou ${abs}% a mais`
      : `Você guardou ${abs}% a menos`;
  }

  if (type === "saldo") {
    return value >= 0
      ? `Seu saldo melhorou ${abs}%`
      : `Seu saldo piorou ${abs}%`;
  }
};

export const calcVariation = (current, prev) => {
  if (!prev || prev === 0) return 0;
  return ((current - prev) / prev) * 100;
};

export const getBehavior = (type, value) => {
  // define se positivo é bom ou ruim
  const isPositive = value >= 0;

  if (type === "entradas" || type === "saldo") {
    return {
      isGood: isPositive,
    };
  }

  if (type === "saidas") {
    return {
      isGood: !isPositive, // gastar mais é ruim
    };
  }

  if (type === "economias") {
    return {
      isGood: isPositive, // guardar mais é bom
    };
  }
};

export const getRowStatus = (l) => {
  if (l.status === "Pago") return "normal";

  const today = formatDateLocal(new Date());

  if (!l.dataVencimento) return "normal";

  if (l.dataVencimento < today) return "vencido";
  if (l.dataVencimento === today) return "hoje";

  return "normal";
};

export const getMonthTotals = (dataset) => {
  const categorias = Object.keys(dataset);

  return MONTHS.map((_, monthIndex) =>
    categorias.reduce((sum, cat) => sum + (dataset[cat]?.[monthIndex] || 0), 0),
  );
};

export const getYears = () => {
  const currentYear = new Date().getFullYear();
  return Array.from({ length: 5 }, (_, i) => currentYear - 2 + i);
};
