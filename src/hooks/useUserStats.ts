import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

interface ThreatStats {
  totalScenarios: number;
  completedScenarios: number;
  fellForTraps: number;
  successRate: number;
  stopCompleted: boolean;
}

export function useUserStats(userId: string | undefined) {
  return useQuery<ThreatStats>({
    queryKey: ["user_stats", userId],
    enabled: !!userId,
    queryFn: async () => {
      const [trainingRes, stopRes] = await Promise.all([
        supabase.from("training_progress").select("*").eq("user_id", userId!),
        supabase.from("stop_progress").select("*").eq("user_id", userId!).maybeSingle(),
      ]);

      if (trainingRes.error) throw trainingRes.error;
      if (stopRes.error) throw stopRes.error;

      const training = trainingRes.data || [];
      const completedScenarios = training.length;
      const fellForTraps = training.filter(t => t.user_fell_for_trap).length;

      return {
        totalScenarios: 3, // total available scenarios
        completedScenarios,
        fellForTraps,
        successRate: completedScenarios > 0 ? Math.round(((completedScenarios - fellForTraps) / completedScenarios) * 100) : 0,
        stopCompleted: stopRes.data?.fully_completed ?? false,
      };
    },
  });
}
