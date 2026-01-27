export default function Proyectos() {
  return (
    <div className="container mx-auto px-6 py-10 text-white">
      <h1 className="text-4xl font-bold mb-8 text-[#00ff88]">Metodología HCI</h1>
      <div className="grid gap-8">
        <section className="bg-slate-900/50 p-6 rounded-2xl border border-white/10">
          <h2 className="text-xl font-semibold mb-4 text-[#00ff88]">1. Requerimientos de Usuario (RA)</h2>
          <p className="text-slate-400">Investigación sobre la necesidad de iluminación ambiental inteligente y cómo los usuarios interactúan con sus espacios físicos según la festividad actual.</p>
        </section>
        <section className="bg-slate-900/50 p-6 rounded-2xl border border-white/10">
          <h2 className="text-xl font-semibold mb-4 text-[#00ff88]">2. Prototipado LW-HF</h2>
          <p className="text-slate-400">Evolución desde prototipos de baja fidelidad (esquemas de circuitos) hasta alta fidelidad (esta plataforma React con predicción de Machine Learning).</p>
        </section>
        <section className="bg-slate-900/50 p-6 rounded-2xl border border-white/10">
          <h2 className="text-xl font-semibold mb-4 text-[#00ff88]">3. Evaluación</h2>
          <p className="text-slate-400">Pruebas de usabilidad aplicando los principios de Nielsen para asegurar que el sistema sea intuitivo y eficaz.</p>
        </section>
      </div>
    </div>
  );
}