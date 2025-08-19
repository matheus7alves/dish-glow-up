import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Layout } from "@/components/layout/Layout";
import { useUser } from "@/hooks/useUser";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export default function Conta() {
  const { user, loading } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate("/login");
    }
  }, [user, loading, navigate]);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error("Erro ao sair: " + error.message);
    } else {
      toast.success("Logout realizado com sucesso!");
      navigate("/");
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="h-8 bg-muted animate-pulse rounded-md" />
            <div className="h-40 bg-muted animate-pulse rounded-md" />
          </div>
        </div>
      </Layout>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto space-y-6">
          <h1 className="text-3xl font-bold">Minha Conta</h1>

          <Card>
            <CardHeader>
              <CardTitle>Informações da Conta</CardTitle>
              <CardDescription>
                Gerencie suas informações pessoais
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium">Email</label>
                <p className="text-muted-foreground">{user.email}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium">Saldo de fotos</label>
                <p className="text-muted-foreground">—</p>
              </div>
              
              <div className="pt-4 border-t">
                <Button variant="destructive" onClick={handleLogout}>
                  Sair da conta
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Plano Atual</CardTitle>
              <CardDescription>
                Gerencie sua assinatura
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Você ainda não possui um plano ativo.
              </p>
              <Button onClick={() => navigate("/planos")}>
                Ver planos disponíveis
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}