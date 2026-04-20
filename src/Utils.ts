export const formatBRL = (value: number | string) => {
  const num = Number(value);

  if (!num) return "-"; // pega 0, null, undefined, "", etc

  return num.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
};

export const parseBRL = (value: string | number) => {
  const str = String(value);
  const numeric = str.replace(/\D/g, "");
  return Number(numeric) / 100;
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

export const createLancamentos = (form, cadastro, valor, hoje) => {
  const novos = [];
  if (form.parcelado) {
    const pagas = Number(form.parcelasPagas) || 0;
    const total = Number(form.parcelasTotais) || 0;
    const restantes = total - pagas;
    for (let i = 0; i < restantes; i++) {
      const [year, month, day] = form.dataVencimento.split("-");
      const data = new Date(year, month - 1, day);
      data.setMonth(data.getMonth() + i);
      novos.push({
        id: crypto.randomUUID(),
        dataLancamento: hoje,
        dataVencimento: formatDateLocal(data),
        descricao: form.descricao,
        categoria: cadastro.categoria,
        tipo: cadastro.tipo,
        valor: valor,
        status: form.status,
        obs: `Parcela ${String(pagas + i + 1).padStart(2, "0")}/${total}`,
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
      valor: valor,
      status: form.status,
      obs: form.obs,
    });
  }
  return novos;
};

