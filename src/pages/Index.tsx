import { useEffect, useCallback } from "react";
import { toast } from "sonner";

import { useLEDState } from "@/hooks/useLEDState";
import { useESP32Connection } from "@/hooks/useESP32Connection";

import { Header } from "@/components/Header";
import { LEDPreview } from "@/components/LEDPreview";
import { ColorPicker } from "@/components/ColorPicker";
import { BrightnessControl } from "@/components/BrightnessControl";
import { AnimationModes } from "@/components/AnimationModes";
import { PowerToggle } from "@/components/PowerToggle";
import { ConnectionStatus } from "@/components/ConnectionStatus";

import { getColorRecommendation } from "@/services/mlService";

const Index = () => {
  // Extraemos setSections para poder manipular el arreglo completo desde la IA
  const {
    state,
    sections,
    activeSection,
    setActiveSection,
    setPower,
    setColor,
    setBrightness,
    setMode,
    setFullState,
    setSections, 
    togglePower,
    getMessage,
  } = useLEDState();

  const {
    connectionStatus,
    connect,
    disconnect,
    sendMessage,
    setESP32IP,
    isConnected,
  } = useESP32Connection({
    onConnectionChange: (connected) => {
      if (connected) {
        toast.success("Conectado al ESP32", {
          description: "Sincronización de hardware activa",
        });
      } else {
        toast.error("Desconectado del ESP32", {
          description: "Intentando reconectar...",
        });
      }
    },
  });

  const syncWithESP32 = useCallback(() => {
    const message = getMessage();
    sendMessage(message);
  }, [getMessage, sendMessage]);

  // Efecto de sincronización automática
  useEffect(() => {
    if (isConnected) {
      const timeoutId = setTimeout(syncWithESP32, 300);
      return () => clearTimeout(timeoutId);
    }
  }, [sections, isConnected, syncWithESP32]);

  /**
   * Lógica de Machine Learning Actualizada:
   * Ahora soporta el procesamiento de múltiples secciones si la API 
   * envía 'is_multi_section: true'.
   */
  const handleEventoML = async (evento: string) => {
    try {
      const data = await getColorRecommendation(evento);
      console.log("Respuesta ML:", data);

      // CASO 1: La IA envía configuraciones distintas para Fa, bL y ab (ej. Ecuador)
      if (data.is_multi_section && data.sections) {
        setSections(prev => prev.map((s, i) => ({
          ...s,
          color: { 
            r: data.sections![i].r, 
            g: data.sections![i].g, 
            b: data.sections![i].b 
          },
          brightness: data.sections![i].brillo || 100,
          mode: data.mode || "static",
          power: true
        })));

        toast.success(`Evento Especial: ${evento.replaceAll("_", " ")}`, {
          description: "Configuración temática aplicada por sección",
        });
      } 
      // CASO 2: La IA envía un solo color base (comportamiento estándar)
      else if (data.color) {
        setFullState({
          color: {
            r: Math.round(data.color.r),
            g: Math.round(data.color.g),
            b: Math.round(data.color.b),
          },
          brightness: Math.round(data.color.brillo || 80), 
          mode: (data.mode as any) || "static",
          power: true,
        });

        toast.success(`IA: ${evento.replaceAll("_", " ")}`, {
          description: "Color base aplicado a toda la palabra",
        });
      }
    } catch (error) {
      toast.error("Error en la predicción de IA");
      console.error("Fallo en handleEventoML:", error);
    }
  };

  const eventos = [
    "navidad", "carnaval", "halloween", "normal", "ano_nuevo",
    "fin_de_ano", "dia_de_la_madre", "dia_del_padre", "fundacion_de_quito",
    "dia_de_los_difuntos", "semana_santa", "independencia_ecuador",
    "batalla_pichincha", "seleccion_ecuador_partido", "seleccion_ecuador_gol",
    "seleccion_ecuador_celebracion", "clasificatoria_mundial", "cumpleanos",
    "boda", "graduacion", "aniversario", "lluvia", "verano", "invierno"
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <ConnectionStatus
            status={connectionStatus}
            onConnect={connect}
            onDisconnect={disconnect}
            onIPChange={setESP32IP}
          />
        </div>

        {/* Panel de Eventos IA */}
        <section className="mb-12">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <h2 className="text-xl font-semibold tracking-tight uppercase">Control por Eventos (IA)</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {eventos.map((ev) => (
              <button
                key={ev}
                onClick={() => handleEventoML(ev)}
                className="px-3 py-4 rounded-xl text-xs font-bold capitalize bg-secondary/40 border border-white/5 transition-all hover:bg-primary hover:text-primary-foreground hover:scale-105 active:scale-95 shadow-sm"
              >
                {ev.replaceAll("_", " ")}
              </button>
            ))}
          </div>
        </section>

        <hr className="my-10 border-white/5" />

        {/* Interfaz de Control Segmentado */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          <div className="space-y-6">
            <LEDPreview 
              sections={sections} 
              activeSection={activeSection} 
              onSelectSection={setActiveSection} 
            />
            <PowerToggle power={state.power} onToggle={togglePower} />
          </div>

          <div>
            <ColorPicker color={state.color} onChange={setColor} disabled={!state.power} />
          </div>

          <div className="space-y-6">
            <BrightnessControl brightness={state.brightness} onChange={setBrightness} disabled={!state.power} />
            <AnimationModes currentMode={state.mode} onChange={setMode} disabled={!state.power} />
          </div>
        </div>

        <footer className="mt-20 py-8 border-t border-white/5 text-center text-muted-foreground text-[10px] font-mono">
          <p>CHROMA CONTROL HUB — PROYECTO HCI 2026</p>
          <div className="flex justify-center gap-4 mt-2 opacity-50">
            <span>BACKEND: FASTAPI + XGBOOST</span>
            <span>HARDWARE: ESP32 (WIFI)</span>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default Index;