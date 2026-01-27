import { AnimationMode } from '@/types/led';
import { Lightbulb, Zap, Waves, Rainbow } from 'lucide-react';

interface AnimationModesProps {
  currentMode: AnimationMode;
  onChange: (mode: AnimationMode) => void;
  disabled?: boolean;
}

const MODES: { id: AnimationMode; label: string; icon: React.ElementType; description: string }[] = [
  { id: 'static', label: 'Fijo', icon: Lightbulb, description: 'Color sólido sin animación' },
  { id: 'blink', label: 'Parpadeo', icon: Zap, description: 'Parpadeo intermitente' },
  { id: 'gradient', label: 'Degradado', icon: Waves, description: 'Transición suave de brillo' },
  { id: 'rainbow', label: 'Arcoíris', icon: Rainbow, description: 'Ciclo de colores RGB' },
];

export function AnimationModes({ currentMode, onChange, disabled }: AnimationModesProps) {
  return (
    <div className={`glass-card p-6 space-y-4 ${disabled ? 'opacity-50 pointer-events-none' : ''}`}>
      <h2 className="text-lg font-semibold text-foreground/80 uppercase tracking-wider">
        Modo de Animación
      </h2>

      <div className="grid grid-cols-2 gap-3">
        {MODES.map(({ id, label, icon: Icon, description }) => {
          const isActive = currentMode === id;
          
          return (
            <button
              key={id}
              onClick={() => onChange(id)}
              className={`
                relative p-4 rounded-xl border-2 transition-all duration-300
                flex flex-col items-center gap-2 text-center
                ${isActive 
                  ? 'border-primary bg-primary/10 shadow-glow' 
                  : 'border-border hover:border-primary/50 hover:bg-secondary/50'
                }
              `}
            >
              <Icon 
                className={`w-8 h-8 transition-colors ${
                  isActive ? 'text-primary' : 'text-muted-foreground'
                } ${id === 'rainbow' && isActive ? 'animate-rainbow' : ''}`}
              />
              <span className={`font-medium ${isActive ? 'text-primary' : 'text-foreground'}`}>
                {label}
              </span>
              <span className="text-xs text-muted-foreground line-clamp-1">
                {description}
              </span>
              
              {/* Indicador activo */}
              {isActive && (
                <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-primary animate-pulse" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
