import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Check } from "lucide-react";
import { Layout } from "@/components/layout/Layout";

export default function Planos() {
  const plans = [
    {
      name: "Básico",
      price: "R$ 9,90",
      credits: "10 fotos",
      features: [
        "10 melhorias de fotos",
        "Qualidade HD",
        "Suporte por email",
      ],
    },
    {
      name: "Profissional",
      price: "R$ 19,90",
      credits: "25 fotos",
      features: [
        "25 melhorias de fotos",
        "Qualidade HD",
        "Suporte prioritário",
        "Sem marca d'água",
      ],
      popular: true,
    },
    {
      name: "Empresarial",
      price: "R$ 39,90",
      credits: "60 fotos",
      features: [
        "60 melhorias de fotos",
        "Qualidade 4K",
        "Suporte 24/7",
        "Sem marca d'água",
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
                <CardTitle>{plan.name}</CardTitle>
                <div className="space-y-1">
                  <div className="text-3xl font-bold">{plan.price}</div>
                  <CardDescription>{plan.credits}</CardDescription>
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
      </div>
    </Layout>
  );
}