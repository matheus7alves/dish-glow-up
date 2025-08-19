import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export default function VerificarEmail() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isConfirmed, setIsConfirmed] = useState(false);
  const email = searchParams.get('email');

  useEffect(() => {
    const { data: subscription } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        setIsConfirmed(true);
        
        try {
          const uid = session.user.id;
          const pendingName = localStorage.getItem('pending_name') || '';

          // Verificar se já existe um profile
          const { data: existingProfile } = await supabase
            .from('profiles')
            .select('id, name')
            .eq('id', uid)
            .maybeSingle();

          if (!existingProfile) {
            // Criar novo profile
            const { error: insertError } = await supabase
              .from('profiles')
              .insert({
                id: uid,
                name: pendingName || null,
              });

            if (insertError) {
              console.error('Erro ao criar profile:', insertError);
              toast.error('Erro ao criar perfil. Tente novamente.');
              return;
            }
          } else if (pendingName && !existingProfile.name) {
            // Atualizar name se estiver vazio
            const { error: updateError } = await supabase
              .from('profiles')
              .update({ name: pendingName })
              .eq('id', uid);

            if (updateError) {
              console.error('Erro ao atualizar profile:', updateError);
            }
          }

          // Limpar dados temporários
          localStorage.removeItem('pending_name');
          
          toast.success('Login confirmado com sucesso!');
          
          // Redirecionar após 2 segundos
          setTimeout(() => {
            navigate('/processar');
          }, 2000);
          
        } catch (error) {
          console.error('Erro no processo de confirmação:', error);
          toast.error('Erro ao processar confirmação. Tente novamente.');
        }
      }
    });

    return () => subscription.subscription.unsubscribe();
  }, [navigate]);
  if (isConfirmed) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <CardTitle>Email confirmado!</CardTitle>
            <CardDescription>
              Sua conta foi ativada com sucesso. Redirecionando...
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <Mail className="h-6 w-6 text-primary" />
          </div>
          <CardTitle>Verifique seu email</CardTitle>
          <CardDescription>
            {email ? (
              <>Enviamos um link de verificação para <strong>{email}</strong>. 
              Clique no link para ativar sua conta.</>
            ) : (
              'Enviamos um link de verificação para seu email. Clique no link para ativar sua conta.'
            )}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Não recebeu o email? Verifique sua caixa de spam ou tente novamente.
          </p>
          <Link to="/login">
            <Button variant="outline" className="w-full">
              Voltar ao login
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}