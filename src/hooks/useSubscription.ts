import { useEffect, useState } from "react";
// import { supabase } from "@/integrations/supabase/client"; // ativaremos na próxima etapa

export function useSubscription() {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [planCode, setPlanCode] = useState<"basic"|"complete"|null>(null);

  useEffect(() => {
    // TODO: na próxima etapa, consultar tabela subscriptions:
    // const { data } = await supabase
    //   .from("subscriptions")
    //   .select("status, plan_code")
    //   .maybeSingle();
    // setIsSubscribed(data?.status === "active" || data?.status === "trialing");
    // setPlanCode(data?.plan_code ?? null);
    setIsSubscribed(false);
    setPlanCode(null);
  }, []);

  return { isSubscribed, planCode };
}