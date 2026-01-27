import { useState } from 'react';
import { Wifi, WifiOff, Settings, RefreshCw } from 'lucide-react';
import { ConnectionStatus as ConnectionStatusType } from '@/types/led';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface ConnectionStatusProps {
  status: ConnectionStatusType;
  onConnect: () => void;
  onDisconnect: () => void;
  onIPChange: (ip: string) => void;
}

export function ConnectionStatus({ 
  status, 
  onConnect, 
  onDisconnect,
  onIPChange 
}: ConnectionStatusProps) {
  const [showSettings, setShowSettings] = useState(false);
  const [ipInput, setIpInput] = useState(status.esp32IP || '192.168.1.100');

  const handleIPSave = () => {
    onIPChange(ipInput);
    setShowSettings(false);
  };

  return (
    <div className="glass-card p-4 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`status-dot ${status.connected ? 'connected' : 'disconnected'}`} />
          
          {status.connected ? (
            <Wifi className="w-5 h-5 text-green-500" />
          ) : (
            <WifiOff className="w-5 h-5 text-red-500" />
          )}
          
          <div>
            <p className={`font-medium ${status.connected ? 'text-green-500' : 'text-red-500'}`}>
              {status.connected ? 'Conectado' : 'Desconectado'}
            </p>
            <p className="text-xs text-muted-foreground font-mono">
              ESP32: {status.esp32IP || 'No configurado'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowSettings(!showSettings)}
            className="text-muted-foreground hover:text-foreground"
          >
            <Settings className="w-4 h-4" />
          </Button>
          
          {status.connected ? (
            <Button
              variant="outline"
              size="sm"
              onClick={onDisconnect}
              className="text-red-500 border-red-500/30 hover:bg-red-500/10"
            >
              Desconectar
            </Button>
          ) : (
            <Button
              variant="outline"
              size="sm"
              onClick={onConnect}
              className="text-green-500 border-green-500/30 hover:bg-green-500/10"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Conectar
            </Button>
          )}
        </div>
      </div>

      {/* Panel de configuración */}
      {showSettings && (
        <div className="pt-4 border-t border-border space-y-3 animate-fade-in">
          <div className="space-y-2">
            <label className="text-sm text-muted-foreground">IP del ESP32</label>
            <div className="flex gap-2">
              <Input
                value={ipInput}
                onChange={(e) => setIpInput(e.target.value)}
                placeholder="192.168.1.100"
                className="font-mono"
              />
              <Button onClick={handleIPSave} size="sm">
                Guardar
              </Button>
            </div>
          </div>
          
          <p className="text-xs text-muted-foreground">
            Puerto WebSocket: 81 | Puerto HTTP: 80
          </p>
        </div>
      )}

      {/* Última conexión */}
      {status.lastPing && (
        <p className="text-xs text-muted-foreground">
          Última respuesta: {status.lastPing.toLocaleTimeString()}
        </p>
      )}
    </div>
  );
}
