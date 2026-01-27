import { Cpu } from 'lucide-react';

export function Header() {
  return (
    <header className="border-b border-border/50 bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-primary/20 text-primary">
              <Cpu className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gradient">
                LED Controller
              </h1>
              <p className="text-xs text-muted-foreground">
                ESP32 RGB Control Panel
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground font-mono">
              v1.0.0
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
