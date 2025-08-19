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
  const [isResending, setIsResending] = useState(false);
  const email = searchParams.get('email');

  useEffect(() => {
    const { data: subscription } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        setIsConfirmed(true);
        
        try {
          const uid = session.user.id;
          const pendingName = sessionStorage.getItem('pendingName') || '';

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
          sessionStorage.removeItem('pendingName');
          
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

  const handleResendEmail = async () => {
    if (!email) {
      toast.error('Email não informado. Tente fazer login novamente.');
      return;
    }

    setIsResending(true);
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/verificar-email`,
        },
      });

      if (error) throw error;

      toast.success('Link reenviado com sucesso! Verifique seu email.');
    } catch (error: any) {
      console.error('Erro ao reenviar email:', error);
      toast.error('Não foi possível reenviar o email. Tente novamente.');
    } finally {
      setIsResending(false);
    }
  };
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
          <CardTitle>Confirme seu e-mail</CardTitle>
          <CardDescription>
            {email ? (
              <>Enviamos um link para <strong>{email}</strong>. 
              Verifique sua caixa de entrada e spam.</>
            ) : (
              'Enviamos um link de verificação para seu email. Verifique sua caixa de entrada e spam.'
            )}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Depois de confirmar, você será redirecionado automaticamente e poderá usar sua 1ª foto grátis.
          </p>
          <div className="space-y-2">
            <Button 
              onClick={handleResendEmail} 
              disabled={isResending || !email}
              className="w-full"
            >
              {isResending ? "Reenviando..." : "Reenviar link"}
            </Button>
            <Link to="/login">
              <Button variant="outline" className="w-full">
                Voltar ao login
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}