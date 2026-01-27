import { useCallback, useState, useEffect } from 'react';
import { RGBColor } from '@/types/led';
import { Slider } from '@/components/ui/slider';

interface ColorPickerProps {
  color: RGBColor;
  onChange: (color: RGBColor) => void;
  disabled?: boolean;
}

// Colores predefinidos para acceso rápido
const PRESET_COLORS: RGBColor[] = [
  { r: 255, g: 0, b: 0 },      // Rojo
  { r: 255, g: 128, b: 0 },    // Naranja
  { r: 255, g: 255, b: 0 },    // Amarillo
  { r: 0, g: 255, b: 0 },      // Verde
  { r: 0, g: 255, b: 255 },    // Cian
  { r: 0, g: 128, b: 255 },    // Azul claro
  { r: 0, g: 0, b: 255 },      // Azul
  { r: 128, g: 0, b: 255 },    // Púrpura
  { r: 255, g: 0, b: 255 },    // Magenta
  { r: 255, g: 0, b: 128 },    // Rosa
  { r: 255, g: 255, b: 255 },  // Blanco
  { r: 255, g: 200, b: 150 },  // Blanco cálido
];

export function ColorPicker({ color, onChange, disabled }: ColorPickerProps) {
  const [localColor, setLocalColor] = useState(color);

  useEffect(() => {
    setLocalColor(color);
  }, [color]);

  const handleChange = useCallback((channel: 'r' | 'g' | 'b', value: number) => {
    const newColor = { ...localColor, [channel]: value };
    setLocalColor(newColor);
    onChange(newColor);
  }, [localColor, onChange]);

  const handlePresetClick = useCallback((presetColor: RGBColor) => {
    setLocalColor(presetColor);
    onChange(presetColor);
  }, [onChange]);

  const rgbToHex = (rgb: RGBColor): string => {
    return `#${rgb.r.toString(16).padStart(2, '0')}${rgb.g.toString(16).padStart(2, '0')}${rgb.b.toString(16).padStart(2, '0')}`;
  };

  const handleHexChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const hex = e.target.value;
    if (hex.length === 7) {
      const r = parseInt(hex.slice(1, 3), 16);
      const g = parseInt(hex.slice(3, 5), 16);
      const b = parseInt(hex.slice(5, 7), 16);
      if (!isNaN(r) && !isNaN(g) && !isNaN(b)) {
        const newColor = { r, g, b };
        setLocalColor(newColor);
        onChange(newColor);
      }
    }
  }, [onChange]);

  return (
    <div className={`glass-card p-6 space-y-6 ${disabled ? 'opacity-50 pointer-events-none' : ''}`}>
      <h2 className="text-lg font-semibold text-foreground/80 uppercase tracking-wider">
        Color RGB
      </h2>

      {/* Color picker nativo + Preview */}
      <div className="flex items-center gap-4">
        <div 
          className="relative w-20 h-20 rounded-xl overflow-hidden cursor-pointer transition-transform hover:scale-105"
          style={{
            backgroundColor: `rgb(${localColor.r}, ${localColor.g}, ${localColor.b})`,
            boxShadow: `0 0 20px rgb(${localColor.r}, ${localColor.g}, ${localColor.b})`,
          }}
        >
          <input
            type="color"
            value={rgbToHex(localColor)}
            onChange={handleHexChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent pointer-events-none" />
        </div>
        
        <div className="flex-1 space-y-1">
          <p className="font-mono text-sm text-muted-foreground">
            {rgbToHex(localColor).toUpperCase()}
          </p>
          <p className="font-mono text-xs text-muted-foreground">
            rgb({localColor.r}, {localColor.g}, {localColor.b})
          </p>
        </div>
      </div>

      {/* Sliders RGB */}
      <div className="space-y-4">
        {/* Red */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-led-red">Rojo</span>
            <span className="font-mono text-sm text-muted-foreground">{localColor.r}</span>
          </div>
          <Slider
            value={[localColor.r]}
            onValueChange={([v]) => handleChange('r', v)}
            max={255}
            step={1}
            className="[&_[role=slider]]:bg-led-red [&_.bg-primary]:bg-led-red"
          />
        </div>

        {/* Green */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-led-green">Verde</span>
            <span className="font-mono text-sm text-muted-foreground">{localColor.g}</span>
          </div>
          <Slider
            value={[localColor.g]}
            onValueChange={([v]) => handleChange('g', v)}
            max={255}
            step={1}
            className="[&_[role=slider]]:bg-led-green [&_.bg-primary]:bg-led-green"
          />
        </div>

        {/* Blue */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-led-blue">Azul</span>
            <span className="font-mono text-sm text-muted-foreground">{localColor.b}</span>
          </div>
          <Slider
            value={[localColor.b]}
            onValueChange={([v]) => handleChange('b', v)}
            max={255}
            step={1}
            className="[&_[role=slider]]:bg-led-blue [&_.bg-primary]:bg-led-blue"
          />
        </div>
      </div>

      {/* Colores predefinidos */}
      <div className="space-y-3">
        <span className="text-sm text-muted-foreground">Colores rápidos</span>
        <div className="grid grid-cols-6 gap-2">
          {PRESET_COLORS.map((preset, index) => (
            <button
              key={index}
              onClick={() => handlePresetClick(preset)}
              className="w-10 h-10 rounded-lg transition-all hover:scale-110 hover:ring-2 ring-foreground/20"
              style={{
                backgroundColor: `rgb(${preset.r}, ${preset.g}, ${preset.b})`,
                boxShadow: `0 2px 8px rgb(${preset.r}, ${preset.g}, ${preset.b}, 0.4)`,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
