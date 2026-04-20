export const formatBRL = (value: number | string) => {
  const num = Number(value);

  if (!num) return "-"; // pega 0, null, undefined, "", etc

  return num.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
};

export const parseBRL = (value: string) => {
  const numeric = value.replace(/\D/g, "");
  return Number(numeric) / 100;
};
