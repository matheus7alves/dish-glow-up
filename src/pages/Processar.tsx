import { Layout } from "@/components/layout/Layout";
import { ImageUpload } from "@/components/ImageUpload";
import { ImageComparison } from "@/components/ImageComparison";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useUser } from "@/hooks/useUser";

export default function Processar() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [originalImageUrl, setOriginalImageUrl] = useState<string>("");
  const [improvedImageUrl, setImprovedImageUrl] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isTrialMode, setIsTrialMode] = useState(false);
  const [trialUsed, setTrialUsed] = useState(false);
  
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useUser();

  useEffect(() => {
    const trial = searchParams.get("trial") === "1";
    const trialEligible = sessionStorage.getItem("trialEligible") === "true";
    
    if (!user && trial && trialEligible) {
      setIsTrialMode(true);
    } else if (!user && trial && !trialEligible) {
      toast.error("Demonstração não disponível ou já utilizada.");
      navigate("/");
    }
  }, [searchParams, user, navigate]);

  const handleImageSelect = (file: File) => {
    setSelectedFile(file);
    const url = URL.createObjectURL(file);
    setOriginalImageUrl(url);
    setImprovedImageUrl("");
  };

  const handleProcessImage = async () => {
    if (!selectedFile) return;

    // Se for trial mode, verificar e travar antes de processar
    if (isTrialMode && !user) {
      const trialEmail = sessionStorage.getItem("trialEmail");
      if (!trialEmail) {
        toast.error("Dados do trial não encontrados.");
        navigate("/");
        return;
      }

      try {
        const { data: lockData, error: lockError } = await supabase.rpc("lock_trial_job", { 
          in_email: trialEmail 
        });

        if (lockError || !lockData?.[0]?.lock_ok) {
          toast.error("Sua demonstração já foi usada ou está em processamento.");
          navigate("/planos");
          return;
        }
      } catch (error) {
        console.error("Error locking trial:", error);
        toast.error("Erro ao validar demonstração.");
        return;
      }
    }

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
        
        // Se foi trial, marcar como consumido
        if (isTrialMode && !user) {
          const trialEmail = sessionStorage.getItem("trialEmail");
          if (trialEmail) {
            await supabase.rpc("consume_trial", { in_email: trialEmail });
            sessionStorage.setItem("trialEligible", "false");
            setTrialUsed(true);
          }
        }
        
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
    if (isTrialMode && trialUsed) {
      toast.info("Demonstração concluída! Cadastre-se para melhorar mais fotos.");
      navigate("/planos");
      return;
    }
    
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
            <div className="text-center mt-6 space-y-3">
              <Button variant="outline" onClick={resetToUpload}>
                {isTrialMode && trialUsed ? "Ver planos" : "← Nova Foto"}
              </Button>
              {isTrialMode && trialUsed && (
                <div className="text-sm text-muted-foreground">
                  Você concluiu sua demonstração gratuita!
                </div>
              )}
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

            {selectedFile && !trialUsed && (
              <Button 
                onClick={handleProcessImage} 
                disabled={isProcessing}
                size="lg"
                className="min-w-[200px]"
              >
                {isProcessing ? "Processando..." : "Melhorar Foto"}
              </Button>
            )}
            
            {trialUsed && (
              <div className="text-center space-y-4">
                <p className="text-sm text-muted-foreground">
                  Demonstração concluída! Para melhorar mais fotos:
                </p>
                <div className="flex gap-3 justify-center">
                  <Button onClick={() => navigate("/planos")}>
                    Ver planos
                  </Button>
                  <Button variant="outline" onClick={() => navigate("/login")}>
                    Entrar/Cadastrar
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
}