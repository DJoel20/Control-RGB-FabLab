import { LEDMessage } from '@/types/led';
import { Copy, Check } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

interface JSONPreviewProps {
  message: LEDMessage;
}

export function JSONPreview({ message }: JSONPreviewProps) {
  const [copied, setCopied] = useState(false);
  
  const jsonString = JSON.stringify(message, null, 2);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(jsonString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="glass-card p-4 space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
          Mensaje JSON
        </h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleCopy}
          className="text-muted-foreground hover:text-foreground"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4 mr-1 text-green-500" />
              Copiado
            </>
          ) : (
            <>
              <Copy className="w-4 h-4 mr-1" />
              Copiar
            </>
          )}
        </Button>
      </div>
      
      <pre className="p-4 bg-secondary/50 rounded-lg overflow-x-auto">
        <code className="text-xs font-mono text-foreground/80">
          {jsonString}
        </code>
      </pre>
      
      <p className="text-xs text-muted-foreground">
        Este es el formato de datos que se envía al ESP32
      </p>
    </div>
  );
}
