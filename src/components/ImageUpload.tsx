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
      const reader = new FileReader();
      reader.onload = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      
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
      <Card className="p-8 border-2 border-dashed border-primary/20">
        <div className="flex flex-col items-center justify-center space-y-4">
          <Loader2 className="h-12 w-12 text-primary animate-spin" />
          <p className="text-lg font-medium">
            Processando sua imagem...
          </p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-8 border-2 border-dashed border-primary/20 hover:border-primary/40 transition-colors">
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
                className="w-full h-auto rounded-lg"
              />
            </div>
            <div className="text-center space-y-2">
              <p className="text-sm text-muted-foreground">
                Imagem carregada! Clique em "Melhorar Foto" para continuar.
              </p>
              <Button
                variant="outline"
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
              <h3 className="text-lg font-semibold">
                {isDragActive ? 'Solte sua imagem aqui' : 'Escolha uma foto de comida'}
              </h3>
              <p className="text-sm text-muted-foreground">
                Arraste e solte ou clique para selecionar
              </p>
            </div>
            <Button size="lg">
              <Upload className="h-4 w-4 mr-2" />
              Selecionar Imagem
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
};