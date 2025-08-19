import { Button } from "@/components/ui/button";
import { useUser } from "@/hooks/useUser";
import { Camera } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

export function Header() {
  const { user, loading } = useUser();
  const location = useLocation();

  const menuItems = [
    { name: "Início", path: "/" },
    { name: "Processar", path: "/processar" },
    { name: "Planos", path: "/planos" },
  ];

  const isActivePath = (path: string) => location.pathname === path;

  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-8">
          <Link to="/" className="flex items-center space-x-2">
            <Camera className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold">FoodGlow</span>
          </Link>
          
          {/* Menu de navegação */}
          <nav className="hidden md:flex items-center space-x-6">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  isActivePath(item.path) 
                    ? "text-primary" 
                    : "text-muted-foreground"
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
        
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