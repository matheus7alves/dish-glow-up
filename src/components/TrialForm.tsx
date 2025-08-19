import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

const schema = z.object({
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres").max(60, "Nome deve ter no máximo 60 caracteres"),
  email: z.string().email("Email inválido")
});

type FormData = z.infer<typeof schema>;

export function TrialForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      email: ""
    }
  });

  const onSubmit = async (values: FormData) => {
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.rpc("claim_trial_by_email", {
        in_email: values.email,
        in_name: values.name,
        in_ip: null,
        in_ua: navigator.userAgent,
      });

      if (error) {
        toast.error("Erro ao validar e-mail. Tente novamente.");
        return;
      }

      const result = data?.[0];
      if (result?.eligible) {
        sessionStorage.setItem("trialEligible", "true");
        sessionStorage.setItem("trialEmail", values.email.toLowerCase());
        sessionStorage.setItem("trialName", values.name);
        navigate("/processar?trial=1");
        toast.success("Demonstração liberada! Faça o upload da sua foto.");
      } else {
        setShowModal(true);
      }
    } catch (error) {
      console.error("Error claiming trial:", error);
      toast.error("Erro ao processar solicitação. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Teste Grátis</CardTitle>
          <CardDescription>
            Melhore 1 foto gratuitamente, sem cadastro
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome</FormLabel>
                    <FormControl>
                      <Input placeholder="Seu nome" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="seu@email.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button 
                type="submit" 
                className="w-full" 
                disabled={isLoading}
                size="lg"
              >
                {isLoading ? "Verificando..." : "Usar minha 1ª melhoria grátis"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      <AlertDialog open={showModal} onOpenChange={setShowModal}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Demonstração já utilizada</AlertDialogTitle>
            <AlertDialogDescription>
              Você já usou sua demonstração gratuita. Crie sua conta e escolha um plano para continuar melhorando suas fotos.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-col sm:flex-row gap-2">
            <Button variant="outline" onClick={() => navigate("/planos")}>
              Ver planos
            </Button>
            <AlertDialogAction onClick={() => navigate("/login")}>
              Entrar/Cadastrar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}