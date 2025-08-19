import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Check } from "lucide-react";
import { Layout } from "@/components/layout/Layout";

export default function Planos() {
  const plans = [
    {
      name: "⚡ Rápido e Fácil",
      price: "R$ 19,90",
      period: "(créditos avulsos)",
      credits: "10 fotos",
      description: "Quem precisa de poucas fotos rápidas e sem compromisso mensal",
      features: [
        "10 melhorias de fotos",
        "Uso único, sem renovação",
      ],
    },
    {
      name: "📋 Mensal Básico",
      price: "R$ 29,90",
      period: "/mês",
      credits: "20 fotos mensais",
      description: "Restaurantes com cardápio pequeno ou médio, que fazem ajustes ocasionais",
      features: [
        "20 melhorias de fotos por mês",
        "Renovação automática",
        "Suporte prioritário",
      ],
      popular: true,
    },
    {
      name: "🍽️ Mensal Completo",
      price: "R$ 49,90",
      period: "/mês",
      credits: "50 fotos mensais",
      description: "Restaurantes com cardápio médio a grande, que atualizam imagens constantemente",
      features: [
        "50 melhorias de fotos por mês",
        "Renovação automática",
        "Qualidade 4K",
        "Suporte 24/7",
        "API access",
      ],
    },
  ];

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-4">Escolha seu plano</h1>
          <p className="text-muted-foreground">
            Selecione o plano ideal para suas necessidades
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {plans.map((plan, index) => (
            <Card key={index} className={`relative ${plan.popular ? "border-primary" : ""}`}>
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-medium">
                    Mais Popular
                  </span>
                </div>
              )}
              
              <CardHeader className="text-center">
                <CardTitle className="text-lg">{plan.name}</CardTitle>
                <div className="space-y-1">
                  <div className="text-3xl font-bold">
                    {plan.price}
                    <span className="text-sm font-normal text-muted-foreground">{plan.period}</span>
                  </div>
                  <CardDescription>{plan.credits}</CardDescription>
                  {plan.description && (
                    <p className="text-sm text-muted-foreground mt-2 italic">{plan.description}</p>
                  )}
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <ul className="space-y-2">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center space-x-2">
                      <Check className="h-4 w-4 text-primary" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <Button className="w-full" variant={plan.popular ? "default" : "outline"}>
                  Escolher plano
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Pacote Extra */}
        <div className="max-w-2xl mx-auto mt-8">
          <Card className="border-dashed border-2 bg-secondary/10">
            <CardContent className="p-6 text-center">
              <h3 className="text-lg font-semibold mb-2">📦 Pacote Extra</h3>
              <p className="text-muted-foreground mb-4">
                Dentro de qualquer assinatura mensal, compre <strong>+10 fotos por R$ 9,90</strong>
              </p>
              <Button variant="outline" size="sm">
                Adicionar créditos extras
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}