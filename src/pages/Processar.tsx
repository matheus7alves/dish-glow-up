import { Layout } from "@/components/layout/Layout";
import { ImageUpload } from "@/components/ImageUpload";
import { ImageComparison } from "@/components/ImageComparison";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export default function Processar() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [originalImageUrl, setOriginalImageUrl] = useState<string>("");
  const [improvedImageUrl, setImprovedImageUrl] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState(false);

  const handleImageSelect = (file: File) => {
    setSelectedFile(file);
    const url = URL.createObjectURL(file);
    setOriginalImageUrl(url);
    setImprovedImageUrl("");
  };

  const handleProcessImage = async () => {
    if (!selectedFile) return;

    setIsProcessing(true);
    
    try {
      const formData = new FormData();
      formData.append('image', selectedFile);
      
      const { data, error } = await supabase.functions.invoke('improve-image', {
        body: formData,
      });

      if (error) throw error;

      if (data && data.data && data.data[0] && data.data[0].b64_json) {
        const improvedImageDataUrl = `data:image/png;base64,${data.data[0].b64_json}`;
        setImprovedImageUrl(improvedImageDataUrl);
        toast.success('Imagem processada com sucesso!');
      } else {
        throw new Error('Resposta inválida do servidor');
      }
    } catch (error) {
      console.error('Error processing image:', error);
      
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      
      toast.error(`Erro ao processar imagem: ${errorMessage}`, {
        duration: 5000,
        description: "Tente novamente ou verifique se a imagem está válida"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const resetToUpload = () => {
    setSelectedFile(null);
    setOriginalImageUrl("");
    setImprovedImageUrl("");
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {originalImageUrl && improvedImageUrl ? (
          <>
            <ImageComparison
              originalImage={originalImageUrl}
              improvedImage={improvedImageUrl}
            />
            <div className="text-center mt-6">
              <Button variant="outline" onClick={resetToUpload}>
                ← Nova Foto
              </Button>
            </div>
          </>
        ) : (
          <div className="max-w-2xl mx-auto text-center space-y-6">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tight">
                Melhore suas fotos de comida
              </h1>
              <p className="text-muted-foreground text-lg">
                Faça upload de uma foto e nossa IA irá aprimorá-la automaticamente
              </p>
            </div>

            <ImageUpload onImageSelect={handleImageSelect} />

            {selectedFile && (
              <Button 
                onClick={handleProcessImage} 
                disabled={isProcessing}
                size="lg"
                className="min-w-[200px]"
              >
                {isProcessing ? "Processando..." : "Melhorar Foto"}
              </Button>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
}