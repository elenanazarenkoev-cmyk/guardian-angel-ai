import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

// ─── Threats ───
export function useThreats(audience?: string) {
  return useQuery({
    queryKey: ["threats", audience],
    queryFn: async () => {
      let query = supabase.from("threats").select("*").order("severity", { ascending: false });
      if (audience) {
        query = query.contains("target_audience", [audience]);
      }
      const { data, error } = await query;
      if (error) throw error;
      return data as Tables<"threats">[];
    },
  });
}

// ─── Training Progress ───
export function useTrainingProgress(userId: string | undefined) {
  return useQuery({
    queryKey: ["training_progress", userId],
    enabled: !!userId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("training_progress")
        .select("*")
        .eq("user_id", userId!)
        .order("completed_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });
}

export function useSaveTrainingProgress() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (row: {
      user_id: string;
      scenario_id: string;
      user_fell_for_trap: boolean;
      user_mode: string;
      time_spent_seconds?: number;
    }) => {
      const { error } = await supabase.from("training_progress").insert(row);
      if (error) throw error;
    },
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: ["training_progress", vars.user_id] });
    },
  });
}

// ─── STOP Progress ───
export function useStopProgress(userId: string | undefined) {
  return useQuery({
    queryKey: ["stop_progress", userId],
    enabled: !!userId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("stop_progress")
        .select("*")
        .eq("user_id", userId!)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });
}

export function useSaveStopProgress() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (row: {
      user_id: string;
      completed_steps: string[];
      fully_completed: boolean;
    }) => {
      const { error } = await supabase.from("stop_progress").upsert(
        {
          ...row,
          completed_at: row.fully_completed ? new Date().toISOString() : null,
        },
        { onConflict: "user_id" }
      );
      if (error) throw error;
    },
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: ["stop_progress", vars.user_id] });
    },
  });
}

// ─── Analysis Log ───
export function useSaveAnalysisLog() {
  return useMutation({
    mutationFn: async (row: {
      user_id: string;
      message_text: string;
      threat_level: string;
      detected_flags: string[];
      user_mode: string;
    }) => {
      const { error } = await supabase.from("analysis_log").insert(row);
      if (error) throw error;
    },
  });
}

// ─── Auth helper ───
export function useCurrentUser() {
  return useQuery({
    queryKey: ["current_user"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      return user;
    },
    staleTime: 1000 * 60 * 5,
  });
}
