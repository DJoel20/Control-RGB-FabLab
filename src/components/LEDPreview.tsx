interface LEDPreviewProps {
  sections: any[];
  activeSection: number;
  onSelectSection: (index: number) => void;
}

export function LEDPreview({ sections, activeSection, onSelectSection }: LEDPreviewProps) {
  // Verificación de seguridad básica
  if (!sections || sections.length < 3) return <div className="glass-card p-8 text-center">Cargando secciones...</div>;

  const renderPart = (index: number, label: string) => {
    const s = sections[index];
    if (!s) return null;

    // 1. DETERMINAR LA CLASE DE ANIMACIÓN SEGÚN EL MODO
    let animationClass = "";
    if (s.power) {
      if (s.mode === 'blink') animationClass = "animate-blink";
      if (s.mode === 'gradient') animationClass = "animate-glow-pulse";
      if (s.mode === 'rainbow') animationClass = "animate-rainbow-text";
    }

    // Ajuste de color: Si está apagado, usamos un gris oscuro.
    const factor = s.power ? s.brightness / 100 : 0.2; 
    const r = Math.round(s.color.r * factor);
    const g = Math.round(s.color.g * factor);
    const b = Math.round(s.color.b * factor);
    
    const colorStr = s.power 
      ? `rgb(${r}, ${g}, ${b})` 
      : `rgb(60, 60, 60)`; 
    
    return (
      <span
        onClick={() => onSelectSection(index)}
        // 2. APLICAMOS LA CLASE DE ANIMACIÓN AQUÍ
        className={`cursor-pointer transition-all duration-300 px-1 rounded-lg ${animationClass} ${
          activeSection === index 
            ? 'opacity-100 scale-105 bg-white/5 ring-1 ring-white/10' 
            : 'opacity-40 hover:opacity-60'
        }`}
        style={{
          fontSize: '64px',
          fontWeight: '900',
          // En modo arcoíris, el CSS sobreescribe el color fijo
          color: s.mode === 'rainbow' && s.power ? undefined : colorStr,
          textShadow: s.power 
            ? `0 0 20px ${colorStr}, 0 0 40px ${colorStr}44` 
            : 'none',
        }}
      >
        {label}
      </span>
    );
  };

  return (
    <div className="glass-card p-8 flex flex-col items-center gap-6 select-none">
      <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground font-bold opacity-70">
        Control por Secciones (HCI)
      </p>
      
      <div className="flex items-center justify-center font-black tracking-tighter">
        {renderPart(0, "Fa")}
        {renderPart(1, "bL")}
        {renderPart(2, "ab")}
      </div>

      <div className="px-4 py-1.5 bg-primary/20 border border-primary/30 rounded-full text-[11px] text-primary font-black uppercase tracking-widest animate-fade-in">
        Editando: {["Sección Fa", "Sección bL", "Sección ab"][activeSection]}
      </div>
    </div>
  );
}