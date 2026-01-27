export default function QueHacemos() {
  const skills = [
    { title: "Prototipado IA", desc: "Desarrollo de software y hardware con Inteligencia Artificial para automatización.", icon: "🤖" },
    { title: "Uso de FabLab", desc: "Diseño e impresión 3D/2D para estructuras físicas y carcasas de dispositivos.", icon: "🏗️" },
    { title: "Programación", desc: "Lógica de control en Arduino/JavaScript y apps en MIT App Inventor.", icon: "💻" }
  ];

  return (
    <div className="container mx-auto px-6 py-10 text-white">
      <h1 className="text-4xl font-bold mb-8 text-[#00ff88]">Qué Hacemos</h1>
      <div className="grid md:grid-cols-3 gap-6">
        {skills.map((s, i) => (
          <div key={i} className="bg-slate-900/50 p-6 rounded-2xl border border-white/10 hover:border-[#00ff88]/50 transition-all">
            <div className="text-4xl mb-4">{s.icon}</div>
            <h3 className="text-xl font-bold mb-2">{s.title}</h3>
            <p className="text-slate-400 text-sm">{s.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}