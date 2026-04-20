export const formatBRL = (value: number) => {
  if (!value) return "-";
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
};

export const parseBRL = (value: string) => {
  const numeric = value.replace(/\D/g, "");
  return Number(numeric) / 100;
};
