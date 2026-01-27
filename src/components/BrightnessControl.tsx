import { Sun, SunDim } from 'lucide-react';
import { Slider } from '@/components/ui/slider';

interface BrightnessControlProps {
  brightness: number;
  onChange: (brightness: number) => void;
  disabled?: boolean;
}

export function BrightnessControl({ brightness, onChange, disabled }: BrightnessControlProps) {
  return (
    <div className={`glass-card p-6 space-y-4 ${disabled ? 'opacity-50 pointer-events-none' : ''}`}>
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-foreground/80 uppercase tracking-wider">
          Brillo
        </h2>
        <span className="font-mono text-2xl font-bold text-primary">
          {brightness}%
        </span>
      </div>

      <div className="flex items-center gap-4">
        <SunDim className="w-5 h-5 text-muted-foreground" />
        <Slider
          value={[brightness]}
          onValueChange={([v]) => onChange(v)}
          max={100}
          step={1}
          className="flex-1"
        />
        <Sun className="w-5 h-5 text-primary" />
      </div>

      {/* Indicador visual de brillo */}
      <div className="h-2 rounded-full bg-secondary overflow-hidden">
        <div 
          className="h-full rounded-full bg-gradient-to-r from-primary/50 to-primary transition-all duration-200"
          style={{ width: `${brightness}%` }}
        />
      </div>
    </div>
  );
}
