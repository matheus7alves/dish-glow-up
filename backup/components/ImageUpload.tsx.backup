import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, ImageIcon, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';

interface ImageUploadProps {
  onImageSelect: (file: File) => void;
  isProcessing?: boolean;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({ onImageSelect, isProcessing }) => {
  const [preview, setPreview] = useState<string | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      // Create preview
      const reader = new FileReader();
      reader.onload = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      
      // Call parent handler
      onImageSelect(file);
    }
  }, [onImageSelect]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp']
    },
    maxFiles: 1,
    onError: (error) => {
      toast.error('Erro ao carregar imagem: ' + error.message);
    }
  });

  if (isProcessing) {
    return (
      <Card className="p-8 border-2 border-dashed border-primary/20 bg-gradient-subtle">
        <div className="flex flex-col items-center justify-center space-y-4">
          <Loader2 className="h-12 w-12 text-primary animate-spin" />
          <p className="text-lg font-medium text-muted-foreground">
            Processando sua imagem...
          </p>
          <p className="text-sm text-muted-foreground">
            Criando uma versão mais apetitosa
          </p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-8 border-2 border-dashed border-primary/20 hover:border-primary/40 transition-colors bg-gradient-subtle">
      <div
        {...getRootProps()}
        className={`cursor-pointer transition-all duration-300 ${
          isDragActive ? 'scale-105' : ''
        }`}
      >
        <input {...getInputProps()} />
        
        {preview ? (
          <div className="space-y-4">
            <div className="relative max-w-md mx-auto">
              <img
                src={preview}
                alt="Preview"
                className="w-full h-auto rounded-lg shadow-warm"
              />
            </div>
            <div className="text-center space-y-2">
              <p className="text-sm text-muted-foreground">
                Imagem carregada! Clique no botão para melhorar.
              </p>
              <Button
                variant="food"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  setPreview(null);
                }}
              >
                Trocar imagem
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center space-y-4 py-8">
            <div className="p-4 rounded-full bg-primary/10">
              {isDragActive ? (
                <Upload className="h-8 w-8 text-primary animate-bounce" />
              ) : (
                <ImageIcon className="h-8 w-8 text-primary" />
              )}
            </div>
            <div className="text-center space-y-2">
              <h3 className="text-lg font-semibold text-foreground">
                {isDragActive ? 'Solte sua imagem aqui' : 'Envie uma foto da sua comida'}
              </h3>
              <p className="text-sm text-muted-foreground max-w-md">
                Arraste e solte uma imagem ou clique para selecionar. 
                Formatos suportados: JPG, PNG, WEBP
              </p>
            </div>
            <Button variant="hero" size="lg">
              <Upload className="h-4 w-4 mr-2" />
              Selecionar Imagem
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
};