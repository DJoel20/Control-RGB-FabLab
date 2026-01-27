import { useState, useCallback, useRef, useEffect } from 'react';
import { ConnectionStatus, LEDMessage } from '@/types/led';

const STORAGE_KEY = 'saved_esp32_ip';

export function useESP32Connection(options: { defaultIP?: string; reconnectInterval?: number } = {}) {
  const savedIP = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEY) : null;
  const initialIP = savedIP || options.defaultIP || '172.29.81.32';

  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>({
    connected: false,
    lastPing: null,
    esp32IP: initialIP,
  });

  const ipRef = useRef(initialIP);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const checkConnection = useCallback(async () => {
    const targetIP = ipRef.current;
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 1500);

      // no-cors permite que el ping pase aunque el ESP32 no tenga cabeceras en el raíz
      await fetch(`http://${targetIP}/`, {
        method: 'GET',
        mode: 'no-cors', 
        signal: controller.signal,
      });
      
      clearTimeout(timeoutId);
      setConnectionStatus(prev => ({
        ...prev,
        connected: true,
        lastPing: new Date(),
        esp32IP: targetIP
      }));
    } catch (error) {
      if (ipRef.current === targetIP) {
        setConnectionStatus(prev => ({ ...prev, connected: false }));
      }
    }
  }, []);

  const startConnectionLoop = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    checkConnection();
    timerRef.current = setInterval(checkConnection, options.reconnectInterval || 3000);
  }, [checkConnection, options.reconnectInterval]);

  const setESP32IP = useCallback((newIP: string) => {
    localStorage.setItem(STORAGE_KEY, newIP);
    ipRef.current = newIP;
    setConnectionStatus(prev => ({ ...prev, esp32IP: newIP, connected: false }));
    startConnectionLoop();
  }, [startConnectionLoop]);

  const sendMessage = useCallback(async (message: LEDMessage): Promise<boolean> => {
    const targetIP = ipRef.current;
    try {
      const response = await fetch(`http://${targetIP}/led`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(message),
      });
      return response.ok;
    } catch (error) {
      console.error('Fallo al enviar comando a', targetIP);
      return false;
    }
  }, []);

  useEffect(() => {
    startConnectionLoop();
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [startConnectionLoop]);

  return { connectionStatus, setESP32IP, sendMessage, isConnected: connectionStatus.connected };
}