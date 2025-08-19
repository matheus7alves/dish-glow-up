import { Button } from "@/components/ui/button";
import { useUser } from "@/hooks/useUser";
import { Camera } from "lucide-react";
import { Link } from "react-router-dom";

export function Header() {
  const { user, loading } = useUser();

  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <Camera className="h-8 w-8 text-primary" />
          <span className="text-xl font-bold">FoodGlow</span>
        </Link>
        
        <div className="flex items-center space-x-4">
          {user && (
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <span>Saldo de fotos:</span>
              <span className="font-medium">—</span>
            </div>
          )}
          
          {loading ? (
            <div className="w-20 h-9 bg-muted animate-pulse rounded-md" />
          ) : user ? (
            <div className="flex items-center space-x-2">
              <Link to="/conta">
                <Button variant="outline" size="sm">
                  Minha Conta
                </Button>
              </Link>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <Link to="/login">
                <Button variant="outline" size="sm">
                  Entrar
                </Button>
              </Link>
              <Link to="/login?mode=signup">
                <Button size="sm">
                  Cadastrar
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}