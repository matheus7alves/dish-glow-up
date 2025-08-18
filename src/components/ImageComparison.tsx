import React from 'react';
import { Card } from '@/components/ui/card';
import { Download, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface ImageComparisonProps {
  originalImage: string;
  improvedImage: string;
  onDownload?: () => void;
}

export const ImageComparison: React.FC<ImageComparisonProps> = ({
  originalImage,
  improvedImage,
  onDownload
}) => {
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Minha foto melhorada',
          text: 'Olha como ficou minha foto de comida!',
          url: improvedImage
        });
      } catch (error) {
        toast.error('Erro ao compartilhar');
      }
    } else {
      navigator.clipboard.writeText(improvedImage);
      toast.success('Link copiado!');
    }
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = improvedImage;
    link.download = 'foto-melhorada.jpg';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Download iniciado!');
    onDownload?.();
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">
          Resultado! ✨
        </h2>
        <p className="text-muted-foreground">
          Veja o antes e depois
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Original */}
        <Card className="p-4">
          <div className="text-center mb-3">
            <span className="text-sm font-medium text-muted-foreground">ANTES</span>
          </div>
          <div className="aspect-square overflow-hidden rounded-lg bg-muted">
            <img
              src={originalImage}
              alt="Imagem original"
              className="w-full h-full object-cover"
            />
          </div>
        </Card>

        {/* Melhorada */}
        <Card className="p-4 border-primary/30 bg-primary/5">
          <div className="text-center mb-3">
            <span className="text-sm font-bold text-primary">DEPOIS ✨</span>
          </div>
          <div className="aspect-square overflow-hidden rounded-lg bg-muted">
            <img
              src={improvedImage}
              alt="Imagem melhorada"
              className="w-full h-full object-cover"
            />
          </div>
        </Card>
      </div>

      {/* Botões */}
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Button
          size="lg"
          onClick={handleDownload}
          className="flex-1 sm:flex-none"
        >
          <Download className="h-4 w-4 mr-2" />
          Baixar
        </Button>
        
        <Button
          variant="outline"
          size="lg"
          onClick={handleShare}
          className="flex-1 sm:flex-none"
        >
          <Share2 className="h-4 w-4 mr-2" />
          Compartilhar
        </Button>
      </div>
    </div>
  );
};