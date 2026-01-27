export default function QuienesSomos() {
  return (
    <div className="container mx-auto px-6 py-10 text-white animate-fade-in">
      <h1 className="text-4xl font-bold mb-8 text-[#00ff88]">Quiénes Somos</h1>
      <div className="grid md:grid-cols-2 gap-10">
        <div className="space-y-4">
          <p className="text-lg text-slate-300">
            Somos un equipo de <strong>desarrolladores y diseñadores UX/UI</strong> enfocados en la creación de interfaces inteligentes que conectan el mundo digital con el físico.
          </p>
          <p className="text-slate-400">
            Nuestro enfoque combina la psicología del usuario con la ingeniería de hardware para ofrecer experiencias de control intuitivas y estéticas.
          </p>
        </div>
        <div className="bg-slate-900/50 p-6 rounded-2xl border border-white/10">
          <h3 className="text-[#00ff88] font-bold mb-2">Especialidades</h3>
          <ul className="list-disc list-inside text-slate-400 space-y-1">
            <li>Diseño de Interfaces (Figma)</li>
            <li>Programación Full-stack (React/Python)</li>
            <li>Ingeniería de Hardware Embebido</li>
          </ul>
        </div>
      </div>
    </div>
  );
}