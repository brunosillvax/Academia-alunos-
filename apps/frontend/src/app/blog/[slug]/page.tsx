export default function BlogPostPage({ params }: { params: { slug: string } }) {
  // Em produção, buscar post do CMS ou banco de dados
  return (
    <main className="min-h-screen bg-gradient-to-b from-dark-card to-dark py-12 px-6">
      <article className="max-w-4xl mx-auto">
        <div className="card-float p-8 md:p-12">
          <div className="mb-6">
            <span className="bg-primary/10 text-primary px-3 py-1 rounded text-sm">Treino</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-text-primary mb-6">
            10 Exercícios para Emagrecimento em Casa
          </h1>
          <div className="flex items-center gap-4 text-sm text-text-secondary mb-8">
            <span>Por Roberto Lima</span>
            <span>•</span>
            <span>15 de Janeiro, 2024</span>
            <span>•</span>
            <span>5 min de leitura</span>
          </div>

          <div className="prose prose-invert max-w-none">
            <div className="aspect-video bg-gradient-to-br from-primary/20 to-primary-light/20 rounded-xl mb-8 flex items-center justify-center">
              <div className="text-6xl">💪</div>
            </div>

            <p className="text-lg text-text-secondary mb-6">
              Treinar em casa pode ser tão eficaz quanto na academia quando você conhece os exercícios certos.
              Neste guia, vamos mostrar 10 exercícios que você pode fazer sem equipamentos para acelerar o emagrecimento.
            </p>

            <h2 className="text-2xl font-bold text-text-primary mt-8 mb-4">1. Burpee</h2>
            <p className="text-text-secondary mb-4">
              O burpee é um exercício completo que trabalha todo o corpo e queima muitas calorias.
              Comece em pé, agache, coloque as mãos no chão, pule os pés para trás, faça uma flexão,
              pule os pés para frente e salte esticando os braços.
            </p>

            <h2 className="text-2xl font-bold text-text-primary mt-8 mb-4">2. Polichinelo</h2>
            <p className="text-text-secondary mb-4">
              Um clássico do cardio, o polichinelo é excelente para aquecer e queimar calorias.
              Salte abrindo as pernas enquanto levanta os braços acima da cabeça.
            </p>

            <h2 className="text-2xl font-bold text-text-primary mt-8 mb-4">3. Agachamento com Salto</h2>
            <p className="text-text-secondary mb-4">
              Combine força e explosão. Desça em agachamento e salte o mais alto possível,
              voltando ao agachamento ao aterrissar.
            </p>

            {/* Mais conteúdo... */}
          </div>

          {/* CTA no meio do post */}
          <div className="my-12 p-6 bg-gradient-to-r from-primary/10 to-primary-light/10 border border-primary/20 rounded-xl">
            <h3 className="text-xl font-bold text-text-primary mb-2">Quer um plano personalizado?</h3>
            <p className="text-text-secondary mb-4">
              Nossa equipe pode criar um programa de treino adaptado ao seu espaço e objetivos.
            </p>
            <a
              href="/pre-register"
              className="inline-block px-6 py-3 bg-gradient-to-r from-primary to-primary-light text-white rounded-lg font-semibold hover:shadow-xl transition-all"
            >
              Falar com um Especialista
            </a>
          </div>
        </div>
      </article>
    </main>
  );
}
