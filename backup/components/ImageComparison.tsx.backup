import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
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
          text: 'Olha como ficou incrível minha foto de comida!',
          url: improvedImage
        });
      } catch (error) {
        toast.error('Erro ao compartilhar');
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(improvedImage);
      toast.success('Link copiado para a área de transferência!');
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
        <h2 className="text-2xl font-bold text-foreground mb-2">
          Resultado Incrível! 🍽️
        </h2>
        <p className="text-muted-foreground">
          Veja a diferença entre o antes e depois
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Original Image */}
        <Card className="p-4 space-y-3">
          <div className="flex items-center justify-between">
            <Badge variant="outline">Original</Badge>
          </div>
          <div className="aspect-square overflow-hidden rounded-lg">
            <img
              src={originalImage}
              alt="Imagem original"
              className="w-full h-full object-cover"
            />
          </div>
        </Card>

        {/* Improved Image */}
        <Card className="p-4 space-y-3 border-primary/20 bg-gradient-subtle">
          <div className="flex items-center justify-between">
            <Badge className="bg-gradient-warm text-white">Melhorada ✨</Badge>
          </div>
          <div className="aspect-square overflow-hidden rounded-lg shadow-warm">
            <img
              src={improvedImage}
              alt="Imagem melhorada"
              className="w-full h-full object-cover"
            />
          </div>
        </Card>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Button
          variant="hero"
          size="lg"
          onClick={handleDownload}
          className="flex-1 sm:flex-none"
        >
          <Download className="h-4 w-4 mr-2" />
          Baixar Imagem
        </Button>
        
        <Button
          variant="food"
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