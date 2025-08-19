import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Camera, Sparkles, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import heroImage from "@/assets/hero-image.jpg";

const Index = () => {
  const features = [
    {
      icon: Camera,
      title: "IA Avançada",
      description: "Algoritmos de última geração para melhorar suas fotos automaticamente"
    },
    {
      icon: Sparkles,
      title: "Qualidade Premium",
      description: "Resultados profissionais em segundos, sem perder qualidade"
    },
    {
      icon: Zap,
      title: "Processamento Rápido",
      description: "Melhore suas fotos em segundos, não em horas"
    }
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/10" />
        <div className="container mx-auto px-4 relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h1 className="text-4xl lg:text-6xl font-bold tracking-tight">
                Transforme suas fotos de 
                <span className="text-primary"> comida</span> com IA
              </h1>
              <p className="text-xl text-muted-foreground">
                Nossa inteligência artificial aprimora suas fotos automaticamente, 
                deixando seus pratos mais apetitosos e profissionais.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/processar">
                  <Button size="lg" className="w-full sm:w-auto">
                    🎉 Primeira foto grátis
                  </Button>
                </Link>
                <Link to="/planos">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto">
                    Ver planos
                  </Button>
                </Link>
              </div>
            </div>
            <div className="relative">
              <img 
                src={heroImage} 
                alt="Exemplo de melhoria de foto de comida"
                className="rounded-lg shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              Por que escolher o FoodGlow?
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Tecnologia avançada para resultados profissionais
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="text-center">
                <CardHeader>
                  <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-2xl mx-auto space-y-6">
            <h2 className="text-3xl font-bold">
              Pronto para melhorar suas fotos?
            </h2>
            <p className="text-muted-foreground text-lg">
              Junte-se a milhares de usuários que já transformaram suas fotos de comida
            </p>
            <Link to="/processar">
              <Button size="lg">
                🎉 Teste grátis agora
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;