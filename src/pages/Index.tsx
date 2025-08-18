import React, { useState } from 'react';
import { ImageUpload } from '@/components/ImageUpload';
import { ImageComparison } from '@/components/ImageComparison';
import { Button } from '@/components/ui/button';
import { Sparkles } from 'lucide-react';
import { toast } from 'sonner';

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
      const FUNCTION_URL = 'https://apdradsukadmakdybffj.supabase.co/functions/v1/improve-image';

      const formData = new FormData();
      formData.append('image', selectedFile);

      const response = await fetch(FUNCTION_URL, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err?.error || 'Falha ao chamar a Edge Function');
      }

      const result = await response.json();
      const b64 = result?.data?.[0]?.b64_json as string | undefined;
      if (!b64) {
        throw new Error('Resposta inválida da IA: imagem não encontrada');
      }

      const dataUrl = `data:image/png;base64,${b64}`;
      setImprovedImageUrl(dataUrl);
      toast.success('Imagem melhorada!');
      
    } catch (error) {
      console.error('Error processing image:', error);
      
      if (originalImageUrl) {
        setImprovedImageUrl(originalImageUrl);
        toast.warning('Problema com a IA. Exibindo imagem original.');
      } else {
        toast.error('Erro ao processar imagem');
      }
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

  // Mostra resultado se temos ambas as imagens
  if (originalImageUrl && improvedImageUrl) {
    return (
      <div className="min-h-screen bg-background p-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-6">
            <Button variant="outline" onClick={resetToUpload}>
              ← Nova Foto
            </Button>
          </div>
          
          <ImageComparison
            originalImage={originalImageUrl}
            improvedImage={improvedImageUrl}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-2xl space-y-8">
        
        {/* Título simples */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center space-x-2">
            <Sparkles className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold">FoodGlow</h1>
          </div>
          <p className="text-lg text-muted-foreground">
            Deixe suas fotos de comida mais apetitosas
          </p>
        </div>

        {/* Upload */}
        <ImageUpload
          onImageSelect={handleImageSelect}
          isProcessing={isProcessing}
        />
        
        {/* Botão processar */}
        {selectedFile && !isProcessing && (
          <div className="text-center">
            <Button
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
  );
};

export default Index;