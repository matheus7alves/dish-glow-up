import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Check, AlertCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { useUser } from "@/hooks/useUser";
import { useSubscription } from "@/hooks/useSubscription";
import { onBuyAvulso10, onSubscribeBasic, onSubscribeComplete, onBuyExtras10 } from "@/billing/actions";

const plans = [
  {
    id: "avulso",
    name: "Rápido e Fácil",
    price: 19.90,
    credits: 10,
    description: "10 fotos avulsas (sem renovação)",
    features: [
      "10 melhorias de fotos",
      "Sem compromisso de assinatura", 
      "Suporte por email"
    ],
    cta: "Comprar agora",
    handler: onBuyAvulso10,
    type: "oneTime" as const,
  },
  {
    id: "basic",
    name: "Mensal Básico", 
    price: 29.90,
    credits: 20,
    description: "20 fotos por mês",
    features: [
      "20 melhorias por mês",
      "Sem taxa de cancelamento",
      "Suporte por email"
    ],
    cta: "Assinar Básico",
    handler: onSubscribeBasic,
    type: "subscription" as const,
    badge: "Mais Popular",
    popular: true,
  },
  {
    id: "complete",
    name: "Mensal Completo",
    price: 49.90, 
    credits: 50,
    description: "50 fotos por mês",
    features: [
      "50 melhorias por mês",
      "Sem taxa de cancelamento",
      "Suporte por email"
    ],
    cta: "Assinar Completo",
    handler: onSubscribeComplete,
    type: "subscription" as const,
    badge: "Melhor custo-benefício",
  },
];

export default function Planos() {
  const { user } = useUser();
  const { isSubscribed } = useSubscription();

  const handlePlanAction = (handler: () => void) => {
    if (!user) {
      return () => window.location.href = '/login';
    }
    return handler;
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Planos e Preços
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Escolha o plano ideal para suas necessidades de melhoria de imagens
          </p>
        </div>

        {!user && (
          <div className="max-w-2xl mx-auto mb-8">
            <Alert className="border-primary/20 bg-primary/5">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Entre para ganhar sua 1ª foto grátis</AlertTitle>
              <AlertDescription className="mt-2">
                Faça login para liberar sua primeira melhoria gratuita e acessar todos os planos.
              </AlertDescription>
              <div className="mt-4">
                <Button asChild>
                  <Link to="/login">Entrar</Link>
                </Button>
              </div>
            </Alert>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan) => (
            <Card 
              key={plan.id} 
              className={`relative transition-all duration-300 ${
                plan.popular ? 'ring-2 ring-primary shadow-warm scale-105' : 'hover:shadow-lg'
              }`}
            >
              {plan.badge && (
                <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-primary text-primary-foreground">
                  {plan.badge}
                </Badge>
              )}
              
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold text-primary">
                    R$ {plan.price.toFixed(2).replace('.', ',')}
                  </span>
                  {plan.type === "subscription" && (
                    <span className="text-muted-foreground">/mês</span>
                  )}
                </div>
              </CardHeader>

              <CardContent>
                <ul className="space-y-3">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center">
                      <Check className="h-5 w-5 text-primary mr-3 flex-shrink-0" />
                      <span className="text-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>

              <CardFooter>
                <Button 
                  className="w-full" 
                  variant={plan.popular ? "default" : "outline"}
                  onClick={handlePlanAction(plan.handler)}
                  aria-label={`${plan.cta} - ${plan.name} por R$ ${plan.price.toFixed(2).replace('.', ',')}`}
                >
                  {user ? plan.cta : 'Entrar para comprar'}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        {isSubscribed && (
          <>
            <Separator className="my-12" />
            
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="text-2xl font-bold text-foreground mb-4">
                Precisa de mais?
              </h2>
              <p className="text-muted-foreground mb-6">
                Assinantes podem comprar +10 fotos por <strong>R$ 9,90</strong>.
              </p>
              <Button 
                variant="outline" 
                size="lg" 
                onClick={onBuyExtras10}
                aria-label="Comprar mais 10 fotos por R$ 9,90"
              >
                Comprar +10
              </Button>
            </div>
          </>
        )}
      </div>
    </Layout>
  );
}