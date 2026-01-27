import { Link, useLocation } from "react-router-dom";

export const Navbar = () => {
  const location = useLocation();
  
  const navItems = [
    { name: "Inicio", path: "/" },
    { name: "Quiénes Somos", path: "/quienes-somos" },
    { name: "Qué Hacemos", path: "/que-hacemos" },
    { name: "Proyectos", path: "/proyectos" },
    { name: "Contacto", path: "/contacto" },
  ];

  return (
    <nav className="fixed top-0 w-full bg-[#0a0a0a]/90 backdrop-blur-md border-b border-white/10 z-50">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo/Título basado en tu Header */}
        <div className="font-bold text-xl text-[#00ff88] flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#00ff88]/20 flex items-center justify-center border border-[#00ff88]/30">
            🤖
          </div>
          AI LED Control
        </div>

        {/* Enlaces de Navegación */}
        <div className="hidden md:flex gap-8">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`text-sm font-medium transition-all duration-300 hover:text-[#00ff88] relative py-1 ${
                location.pathname === item.path 
                  ? "text-[#00ff88]" 
                  : "text-slate-400"
              }`}
            >
              {item.name}
              {location.pathname === item.path && (
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#00ff88] rounded-full shadow-[0_0_8px_#00ff88]" />
              )}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
};