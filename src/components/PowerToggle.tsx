import { Power } from 'lucide-react';

interface PowerToggleProps {
  power: boolean;
  onToggle: () => void;
}

export function PowerToggle({ power, onToggle }: PowerToggleProps) {
  return (
    <button
      onClick={onToggle}
      className={`
        relative group w-full py-6 rounded-xl border-2 transition-all duration-500
        flex items-center justify-center gap-3
        ${power 
          ? 'border-primary bg-primary/20 shadow-glow-lg hover:bg-primary/30' 
          : 'border-destructive/50 bg-destructive/10 hover:bg-destructive/20 hover:border-destructive'
        }
      `}
    >
      {/* Glow effect cuando está encendido */}
      {power && (
        <div className="absolute inset-0 rounded-xl bg-primary/20 blur-xl animate-pulse" />
      )}
      
      <div className={`
        relative p-4 rounded-full transition-all duration-500
        ${power 
          ? 'bg-primary text-primary-foreground shadow-glow' 
          : 'bg-secondary text-muted-foreground'
        }
      `}>
        <Power className="w-8 h-8" />
      </div>
      
      <div className="relative text-left">
        <span className={`block text-2xl font-bold ${power ? 'text-primary' : 'text-muted-foreground'}`}>
          {power ? 'ENCENDIDO' : 'APAGADO'}
        </span>
        <span className="text-sm text-muted-foreground">
          {power ? 'Clic para apagar' : 'Clic para encender'}
        </span>
      </div>
    </button>
  );
}
