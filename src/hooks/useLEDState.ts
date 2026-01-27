import { useState, useCallback } from 'react';
import { RGBColor, AnimationMode } from '@/types/led';

const DEFAULT_SECTION = {
  power: true,
  mode: 'static' as const,
  color: { r: 0, g: 255, b: 136 },
  brightness: 80,
};

export function useLEDState() {
  const [sections, setSections] = useState([
    { ...DEFAULT_SECTION }, // 0: Fa
    { ...DEFAULT_SECTION }, // 1: bL
    { ...DEFAULT_SECTION }  // 2: ab
  ]);
  
  const [activeSection, setActiveSection] = useState(0);

  const updateActiveSection = useCallback((changes: any) => {
    setSections(prev => {
      const newSections = prev.map((section, index) => 
        index === activeSection ? { ...section, ...changes } : section
      );
      return newSections;
    });
  }, [activeSection]);

  const setPower = (power: boolean) => updateActiveSection({ power });
  const setColor = (color: RGBColor) => updateActiveSection({ color });
  const setBrightness = (brightness: number) => updateActiveSection({ brightness });
  const setMode = (mode: AnimationMode) => updateActiveSection({ mode });

  const togglePower = useCallback(() => {
    const currentPower = sections[activeSection].power;
    updateActiveSection({ power: !currentPower });
  }, [activeSection, sections, updateActiveSection]);

  // --- NUEVA FUNCIÓN PARA MACHINE LEARNING ---
  const setFullState = useCallback((newState: any) => {
    setSections(prev => prev.map(section => ({
      ...section,
      ...newState
    })));
  }, []);

  const getMessage = useCallback(() => {
    return {
      s: sections.map(s => ({
        p: s.power ? 1 : 0,
        m: s.mode,
        c: [s.color.r, s.color.g, s.color.b],
        b: s.brightness
      }))
    };
  }, [sections]);

  // Al final de useLEDState.ts
  return {
    sections,
    activeSection,
    setSections,
    setActiveSection,
    state: sections[activeSection],
    setPower,
    setColor,
    setBrightness,
    setMode,
    setFullState, // <--- Verifica que esta línea esté aquí
    togglePower,
    getMessage,
  };
}