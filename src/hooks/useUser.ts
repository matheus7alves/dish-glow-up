import { useSupabase } from "@/providers/SupabaseProvider";

export function useUser() {
  const { user, session, loading } = useSupabase();
  
  return {
    user,
    session,
    loading,
    isAuthenticated: !!user,
  };
}