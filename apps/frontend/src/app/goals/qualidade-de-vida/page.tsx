export default function QualidadeDeVidaPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-dark-card to-dark">
      <section className="pt-20 pb-12 px-6 text-center">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-primary to-primary-light bg-clip-text text-transparent mb-4">Plano para Qualidade de Vida</h1>
          <p className="text-text-secondary text-lg max-w-3xl mx-auto">Mobilidade, força funcional e hábitos saudáveis para mais energia no dia a dia.</p>
          <div className="mt-6 flex gap-4 justify-center">
            <a href="/pre-register" className="px-8 py-4 bg-gradient-to-r from-primary to-primary-light text-white rounded-xl font-bold text-lg hover:shadow-xl transition-all">Começar 7 dias grátis</a>
            <a href="/plans" className="px-8 py-4 bg-white text-primary border-2 border-primary rounded-xl font-bold text-lg hover:bg-primary hover:text-white transition-all">Ver planos</a>
          </div>
        </div>
      </section>

      <section className="py-12 px-6 bg-white/5">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-6">
          {[{t:'Alongamento e mobilidade',d:'Rotinas guiadas para reduzir dores e rigidez'},
            {t:'Treinos funcionais',d:'Movimentos multiarticulares para autonomia e vitalidade'},
            {t:'Hábitos e sono',d:'Check-ins diários e dicas práticas para consistência'}].map((f,i)=> (
              <div key={i} className="bg-dark-card p-6 rounded-2xl border border-dark-border">
                <h3 className="text-xl font-bold text-text-primary mb-2">{f.t}</h3>
                <p className="text-text-secondary">{f.d}</p>
              </div>
          ))}
        </div>
      </section>
    </main>
  );
}
