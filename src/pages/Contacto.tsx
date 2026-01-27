export default function Contacto() {
  return (
    <div className="container mx-auto px-6 py-10 max-w-xl text-white">
      <h1 className="text-4xl font-bold mb-8 text-center text-[#00ff88]">Contacto</h1>
      <form className="space-y-6 bg-slate-900/50 p-8 rounded-3xl border border-white/10 shadow-2xl">
        <div>
          <label className="block text-sm font-medium mb-2 text-slate-300">Nombre</label>
          <input type="text" className="w-full p-3 rounded-xl bg-black border border-white/10 focus:border-[#00ff88] outline-none transition-all" placeholder="Escribe tu nombre" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2 text-slate-300">Interés</label>
          <select className="w-full p-3 rounded-xl bg-black border border-white/10 focus:border-[#00ff88] outline-none">
            <option>Aprender sobre Hardware (Arduino)</option>
            <option>Aprender sobre Software (React/FastAPI)</option>
            <option>Diseño UX/UI</option>
          </select>
        </div>
        <button type="button" className="w-full py-4 bg-[#00ff88] text-black font-bold rounded-xl hover:shadow-[0_0_20px_#00ff88] transition-all">
          Enviar Información
        </button>
      </form>
    </div>
  );
}