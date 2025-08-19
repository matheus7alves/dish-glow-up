import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail } from "lucide-react";
import { Link } from "react-router-dom";

export default function VerificarEmail() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <Mail className="h-6 w-6 text-primary" />
          </div>
          <CardTitle>Verifique seu email</CardTitle>
          <CardDescription>
            Enviamos um link de verificação para seu email. 
            Clique no link para ativar sua conta.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Não recebeu o email? Verifique sua caixa de spam ou tente novamente.
          </p>
          <Link to="/login">
            <Button variant="outline" className="w-full">
              Voltar ao login
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}