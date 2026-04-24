import { useState, useEffect, useCallback } from "react";
import { supabase } from "../services/supabase";
import { FIELD_MAP, CADASTROS, INITIAL_FORM } from "../Constants";
import { formatDateLocal, createLancamentos } from "../Utils";

export function useLancamentos(user, showToast) {
  const [lancamentos, setLancamentos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // =========================
  // LOAD
  // =========================
  const loadLancamentos = useCallback(async () => {
    if (!user) return;

    try {
      setLoading(true);

      const { data, error } = await supabase
        .from("lancamentos")
        .select("*")
        .eq("user_id", user.id)
        .order("data_vencimento", { ascending: true });

      if (error) throw error;

      setLancamentos(
        data.map((l) => ({
          id: l.id,
          dataLancamento: l.data_lancamento,
          dataVencimento: l.data_vencimento,
          descricao: l.descricao,
          categoria: l.categoria,
          tipo: l.tipo,
          valor: l.valor,
          status: l.status,
          obs: l.obs,
        })),
      );
    } catch (e) {
      console.error(e);
      showToast?.("Erro ao carregar dados", "error");
    } finally {
      setLoading(false);
    }
  }, [user, showToast]);

  useEffect(() => {
    if (!user) return;
    loadLancamentos();
  }, [user, loadLancamentos]);

  // =========================
  // UPDATE
  // =========================
  const updateLancamento = useCallback(
    async (id, field, value) => {
      const dbField = FIELD_MAP[field];
      if (!dbField) return;

      let previous;

      setLancamentos((prev) => {
        previous = prev;
        return prev.map((l) =>
          l.id === id ? { ...l, [field]: value, _updating: true } : l,
        );
      });

      const { error } = await supabase
        .from("lancamentos")
        .update({ [dbField]: value })
        .eq("id", id);

      if (error) {
        console.error(error);
        showToast?.("Erro ao atualizar", "error");
        setLancamentos(previous);
        return;
      }

      setLancamentos((prev) =>
        prev.map((l) => (l.id === id ? { ...l, _updating: false } : l)),
      );
    },
    [showToast],
  );

  // =========================
  // DELETE
  // =========================
  const deleteLancamento = useCallback(
    async (id) => {
      let previous;

      setLancamentos((prev) => {
        previous = prev;
        return prev.filter((l) => l.id !== id);
      });

      const { error } = await supabase
        .from("lancamentos")
        .delete()
        .eq("id", id);

      if (error) {
        console.error(error);
        showToast?.("Erro ao excluir", "error");
        setLancamentos(previous);
        return;
      }

      showToast?.("Lançamento excluído com sucesso!");
    },
    [showToast],
  );

  // =========================
  // CREATE / UPDATE (FORM)
  // =========================
  const handleConfirm = useCallback(
    async (form, editingId, resetForm) => {
      try {
        setSaving(true);

        const cadastro = CADASTROS.find((c) => c.descricao === form.descricao);
        if (!cadastro) return;

        const valor = Number(form.valor);
        const hoje = formatDateLocal(new Date());

        // ===== UPDATE =====
        if (editingId) {
          let previous;

          setLancamentos((prev) => {
            previous = prev;
            return prev.map((l) =>
              l.id === editingId
                ? {
                    ...l,
                    dataVencimento: form.dataVencimento,
                    descricao: form.descricao,
                    categoria: cadastro.categoria,
                    tipo: cadastro.tipo,
                    valor,
                    status: form.status,
                    obs: form.obs,
                  }
                : l,
            );
          });

          const { error } = await supabase
            .from("lancamentos")
            .update({
              data_vencimento: form.dataVencimento,
              descricao: form.descricao,
              categoria: cadastro.categoria,
              tipo: cadastro.tipo,
              valor,
              status: form.status,
              obs: form.obs,
            })
            .eq("id", editingId);

          if (error) {
            console.error(error);
            setLancamentos(previous);
            showToast?.("Erro ao atualizar", "error");
            return;
          }
        } else {
          // ===== CREATE =====
          const novos = createLancamentos(form, cadastro, valor, hoje);

          const tempItems = novos.map((l) => ({
            id: `temp-${crypto.randomUUID()}`,
            ...l,
          }));

          setLancamentos((prev) => [...tempItems, ...prev]);

          const payload = novos.map((l) => ({
            user_id: user.id,
            data_lancamento: l.dataLancamento,
            data_vencimento: l.dataVencimento,
            descricao: l.descricao,
            categoria: l.categoria,
            tipo: l.tipo,
            valor: l.valor,
            status: l.status,
            obs: l.obs,
          }));

          const { data, error } = await supabase
            .from("lancamentos")
            .insert(payload)
            .select();

          if (error) {
            console.error(error);
            setLancamentos((prev) =>
              prev.filter((l) => !String(l.id).startsWith("temp-")),
            );
            showToast?.("Erro ao criar", "error");
            return;
          }

          setLancamentos((prev) => {
            const semTemp = prev.filter(
              (l) => !String(l.id).startsWith("temp-"),
            );

            const novosConvertidos = data.map((l) => ({
              id: l.id,
              dataLancamento: l.data_lancamento,
              dataVencimento: l.data_vencimento,
              descricao: l.descricao,
              categoria: l.categoria,
              tipo: l.tipo,
              valor: l.valor,
              status: l.status,
              obs: l.obs,
            }));

            return [...novosConvertidos, ...semTemp];
          });
        }

        showToast?.(
          `Lançamento ${editingId ? "atualizado" : "criado"} com sucesso!`,
        );

        resetForm?.(INITIAL_FORM);
      } catch (error) {
        console.error(error);
        showToast?.("Erro ao salvar", "error");
      } finally {
        setSaving(false);
      }
    },
    [user, showToast],
  );

  return {
    lancamentos,
    loading,
    saving,
    loadLancamentos,
    updateLancamento,
    deleteLancamento,
    handleConfirm,
  };
}
