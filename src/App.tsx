import { useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import Index from "./pages/Index";
import QuienesSomos from "./pages/QuienesSomos";
import QueHacemos from "./pages/QueHacemos";
import Proyectos from "./pages/Proyectos";
import Contacto from "./pages/Contacto";
import NotFound from "./pages/NotFound";

// 1. Inicializar el QueryClient fuera del componente
const queryClient = new QueryClient();

const App = () => {
  // 2. Estados para el Login "quemado"
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Credenciales directas según tu requerimiento
    if (user === "admin" && pass === "fablab2026") {
      setIsAuthenticated(true);
    } else {
      alert("Credenciales incorrectas. Intenta de nuevo.");
    }
  };

  // 3. Si no está autenticado, mostramos la pantalla de Login
  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#050505] text-white">
        <form onSubmit={handleLogin} className="glass-card p-10 flex flex-col gap-4 w-96 border border-white/10">
          <h1 className="text-2xl font-bold mb-4 text-center">Sistema RGB FabLab</h1>
          <p className="text-xs text-muted-foreground text-center mb-4">Ingresa tus credenciales de administrador</p>
          <input 
            type="text" 
            placeholder="Usuario" 
            className="bg-white/5 border border-white/10 p-3 rounded outline-none focus:border-primary transition-all"
            onChange={(e) => setUser(e.target.value)}
          />
          <input 
            type="password" 
            placeholder="Contraseña" 
            className="bg-white/5 border border-white/10 p-3 rounded outline-none focus:border-primary transition-all"
            onChange={(e) => setPass(e.target.value)}
          />
          <button type="submit" className="bg-primary p-3 rounded font-bold hover:opacity-90 transition-all mt-2">
            Iniciar Sesión
          </button>
        </form>
      </div>
    );
  }

  // 4. Si está autenticado, mostramos la aplicación completa
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <div className="min-h-screen bg-[#050505]">
            <Navbar />
            <div className="pt-20">
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/quienes-somos" element={<QuienesSomos />} />
                <Route path="/que-hacemos" element={<QueHacemos />} />
                <Route path="/proyectos" element={<Proyectos />} />
                <Route path="/contacto" element={<Contacto />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </div>
          </div>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;