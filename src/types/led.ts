// Tipos para el control del LED RGB

export interface RGBColor {
  r: number;
  g: number;
  b: number;
}

export type AnimationMode = 'static' | 'blink' | 'gradient' | 'rainbow';

export interface LEDState {
  power: boolean;
  mode: AnimationMode;
  color: RGBColor;
  brightness: number;
}

export interface ConnectionStatus {
  connected: boolean;
  lastPing: Date | null;
  esp32IP: string | null;
}

// Mensaje JSON para comunicación con ESP32
export interface LEDMessage {
  power: boolean;
  mode: AnimationMode;
  color: RGBColor;
  brightness: number;
}

// Configuración para futura integración con ML
export interface MLEventConfig {
  enabled: boolean;
  eventType: 'time' | 'weather' | 'sensor' | 'prediction' | 'custom';
  parameters?: Record<string, unknown>;
}

// Estado completo del sistema
export interface SystemState {
  led: LEDState;
  connection: ConnectionStatus;
  mlConfig?: MLEventConfig;
}
