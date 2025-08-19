import { useState, useEffect } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { supabase } from "@/integrations/supabase/client";
import { useUser } from "@/hooks/useUser";
import { toast } from "sonner";

const signupSchema = z.object({
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  email: z.string().email("Email deve ter um formato válido"),
});

const loginSchema = z.object({
  email: z.string().email("Email deve ter um formato válido"),
});

type SignupFormData = z.infer<typeof signupSchema>;
type LoginFormData = z.infer<typeof loginSchema>;

export default function Login() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useUser();
  const [isLoading, setIsLoading] = useState(false);
  
  const isSignupMode = searchParams.get("mode") === "signup";
  
  const signupForm = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: "",
      email: "",
    },
  });

  const loginForm = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
    },
  });

  useEffect(() => {
    if (user) {
      navigate("/processar");
    }
  }, [user, navigate]);

  const onSignupSubmit = async (data: SignupFormData) => {
    setIsLoading(true);
    
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email: data.email,
        options: {
          emailRedirectTo: `${window.location.origin}/verificar-email`,
        },
      });

      if (error) throw error;

      // Guardar nome no localStorage para recuperar após confirmação
      localStorage.setItem('pending_name', data.name);
      
      navigate(`/verificar-email?email=${encodeURIComponent(data.email)}`);
      toast.success('Enviamos um link de confirmação para seu e-mail.');
      
    } catch (error: any) {
      console.error('Erro no cadastro:', error);
      
      let errorMessage = 'Não foi possível enviar o e-mail de cadastro.';
      
      if (error.message?.includes('rate_limit')) {
        errorMessage = 'Muitas tentativas. Aguarde alguns minutos e tente novamente.';
      } else if (error.message?.includes('invalid_email')) {
        errorMessage = 'Email inválido. Verifique o formato do email.';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const onLoginSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email: data.email,
        options: {
          emailRedirectTo: `${window.location.origin}/verificar-email`,
        },
      });

      if (error) throw error;
      
      navigate(`/verificar-email?email=${encodeURIComponent(data.email)}`);
      toast.success('Enviamos um link de acesso para seu e-mail.');
      
    } catch (error: any) {
      console.error('Erro no login:', error);
      
      let errorMessage = 'Não foi possível enviar o e-mail de login.';
      
      if (error.message?.includes('rate_limit')) {
        errorMessage = 'Muitas tentativas. Aguarde alguns minutos e tente novamente.';
      } else if (error.message?.includes('invalid_email')) {
        errorMessage = 'Email inválido. Verifique o formato do email.';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  if (isSignupMode) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Cadastre-se para ganhar 1 foto grátis</CardTitle>
            <CardDescription>
              Preencha seus dados para receber o link de acesso
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...signupForm}>
              <form onSubmit={signupForm.handleSubmit(onSignupSubmit)} className="space-y-4">
                <FormField
                  control={signupForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome completo</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Seu nome completo"
                          {...field}
                          disabled={isLoading}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={signupForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="seu@email.com"
                          {...field}
                          disabled={isLoading}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={isLoading || !signupForm.formState.isValid}
                >
                  {isLoading ? "Enviando..." : "Receber link de acesso"}
                </Button>
              </form>
            </Form>
            
            <div className="mt-4 text-center space-y-2">
              <div>
                <Link 
                  to="/login"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Já tem conta? Entrar
                </Link>
              </div>
              <div>
                <Link 
                  to="/verificar-email" 
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Já recebeu o e-mail? Clique aqui para verificar
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Entrar</CardTitle>
          <CardDescription>
            Digite seu email para receber o link de acesso
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...loginForm}>
            <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
              <FormField
                control={loginForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="seu@email.com"
                        {...field}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <Button 
                type="submit" 
                className="w-full" 
                disabled={isLoading || !loginForm.formState.isValid}
              >
                {isLoading ? "Enviando..." : "Receber link de acesso"}
              </Button>
            </form>
          </Form>
          
          <div className="mt-4 text-center space-y-2">
            <div>
              <Link 
                to="/login?mode=signup"
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                Não tem conta? Cadastrar
              </Link>
            </div>
            <div>
              <Link 
                to="/verificar-email" 
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                Já recebeu o e-mail? Clique aqui para verificar
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}