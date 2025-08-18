import React, { useState } from 'react';
import { ImageUpload } from '@/components/ImageUpload';
import { ImageComparison } from '@/components/ImageComparison';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ChefHat, Sparkles, Camera, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import heroImage from '@/assets/hero-image.jpg';

const Index = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [originalImageUrl, setOriginalImageUrl] = useState<string | null>(null);
  const [improvedImageUrl, setImprovedImageUrl] = useState<string | null>(null);

  const handleImageSelect = (file: File) => {
    setSelectedFile(file);
    const url = URL.createObjectURL(file);
    setOriginalImageUrl(url);
    setImprovedImageUrl(null);
  };

  const handleProcessImage = async () => {
    if (!selectedFile) {
      toast.error('Selecione uma imagem primeiro');
      return;
    }

    setIsProcessing(true);
    
    try {
      // Upload original image to Supabase
      const fileName = `uploads/${Date.now()}_${selectedFile.name}`;
      
      const { error: uploadError } = await supabase.storage
        .from('images')
        .upload(fileName, selectedFile);

      if (uploadError) {
        throw new Error('Erro ao fazer upload da imagem');
      }

      // Call the improve-image edge function
      const { data: improveData, error: improveError } = await supabase.functions
        .invoke('improve-image', {
          body: { imagePath: fileName }
        });

      if (improveError || !improveData?.success) {
        throw new Error(improveData?.error || 'Erro ao processar imagem');
      }

      // Set the improved image URL
      setImprovedImageUrl(improveData.improvedImageUrl);
      toast.success('Imagem melhorada com sucesso!');
      
    } catch (error) {
      console.error('Error processing image:', error);
      toast.error(error.message || 'Erro ao processar imagem');
    } finally {
      setIsProcessing(false);
    }
  };

  const resetToUpload = () => {
    setSelectedFile(null);
    setOriginalImageUrl(null);
    setImprovedImageUrl(null);
    setIsProcessing(false);
  };

  // Show results if we have both images
  if (originalImageUrl && improvedImageUrl) {
    return (
      <div className="min-h-screen bg-gradient-subtle">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <Button
                variant="ghost"
                onClick={resetToUpload}
                className="mb-4"
              >
                ← Voltar para upload
              </Button>
            </div>
            
            <ImageComparison
              originalImage={originalImageUrl}
              improvedImage={improvedImageUrl}
            />
            
            <div className="text-center mt-8">
              <Button
                variant="hero"
                size="lg"
                onClick={resetToUpload}
              >
                Melhorar Outra Foto
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="container mx-auto px-4 py-12 lg:py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="flex items-center space-x-2 text-primary">
                <ChefHat className="h-6 w-6" />
                <span className="font-semibold">FoodGlow AI</span>
              </div>
              
              <h1 className="text-4xl lg:text-6xl font-bold text-foreground leading-tight">
                Transforme suas fotos de{' '}
                <span className="bg-gradient-warm bg-clip-text text-transparent">
                  comida
                </span>{' '}
                em obras de arte
              </h1>
              
              <p className="text-xl text-muted-foreground">
                Use inteligência artificial para deixar suas fotos de comida mais apetitosas 
                e profissionais, perfeitas para cardápios digitais e redes sociais.
              </p>
              
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <Sparkles className="h-4 w-4 text-primary" />
                  <span>IA Avançada</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <Camera className="h-4 w-4 text-primary" />
                  <span>Qualidade Profissional</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <ArrowRight className="h-4 w-4 text-primary" />
                  <span>Resultados Instantâneos</span>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <img
                src={heroImage}
                alt="Exemplo de transformação de foto de comida"
                className="w-full h-auto rounded-2xl shadow-warm"
              />
              <div className="absolute -bottom-4 -right-4 bg-white p-4 rounded-xl shadow-glow">
                <div className="flex items-center space-x-2">
                  <Sparkles className="h-5 w-5 text-primary" />
                  <span className="font-semibold text-sm">Melhorado com IA</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Upload Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-foreground mb-4">
                Comece Agora
              </h2>
              <p className="text-muted-foreground">
                Faça upload de uma foto da sua comida e veja a mágica acontecer
              </p>
            </div>
            
            <div className="space-y-6">
              <ImageUpload
                onImageSelect={handleImageSelect}
                isProcessing={isProcessing}
              />
              
              {selectedFile && !isProcessing && (
                <div className="text-center">
                  <Button
                    variant="hero"
                    size="lg"
                    onClick={handleProcessImage}
                    className="w-full sm:w-auto"
                  >
                    <Sparkles className="h-4 w-4 mr-2" />
                    Melhorar Foto
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 bg-white/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Como Funciona
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Nosso algoritmo de IA analisa sua foto e aplica melhorias profissionais 
              automaticamente
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <Card className="p-6 text-center space-y-4">
              <div className="w-12 h-12 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
                <Camera className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">1. Upload</h3>
              <p className="text-muted-foreground">
                Envie sua foto de comida em qualquer formato
              </p>
            </Card>
            
            <Card className="p-6 text-center space-y-4">
              <div className="w-12 h-12 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
                <Sparkles className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">2. IA Processa</h3>
              <p className="text-muted-foreground">
                Nossa IA melhora cores, iluminação e apresentação
              </p>
            </Card>
            
            <Card className="p-6 text-center space-y-4">
              <div className="w-12 h-12 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
                <ArrowRight className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">3. Resultado</h3>
              <p className="text-muted-foreground">
                Baixe sua foto profissional e use onde quiser
              </p>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;