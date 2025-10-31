'use client';
import { useState } from 'react';

export default function ResultadosPage() {
  const [filter, setFilter] = useState<string>('all');

  const resultados = [
    {
      id: 1,
      name: 'João Silva',
      beforeImage: '/results/joao-before.jpg',
      afterImage: '/results/joao-after.jpg',
      objective: 'emagrecimento',
      time: '3 meses',
      weightLoss: '-15kg',
      testimonial: 'Consegui perder 15kg em 3 meses seguindo o programa de emagrecimento. O acompanhamento foi essencial!',
      verified: true
    },
    {
      id: 2,
      name: 'Maria Santos',
      beforeImage: '/results/maria-before.jpg',
      afterImage: '/results/maria-after.jpg',
      objective: 'hipertrofia',
      time: '6 meses',
      muscleGain: '+8kg massa magra',
      testimonial: 'Ganhei 8kg de massa magra em 6 meses. Os treinos personalizados fizeram toda a diferença!',
      verified: true
    },
    {
      id: 3,
      name: 'Pedro Costa',
      beforeImage: '/results/pedro-before.jpg',
      afterImage: '/results/pedro-after.jpg',
      objective: 'qualidade-de-vida',
      time: '2 meses',
      improvement: 'Mais energia e mobilidade',
      testimonial: 'Melhorei muito minha mobilidade e disposição. Hoje me sinto muito melhor!',
      verified: true
    },
    {
      id: 4,
      name: 'Ana Paula',
      beforeImage: '/results/ana-before.jpg',
      afterImage: '/results/ana-after.jpg',
      objective: 'emagrecimento',
      time: '4 meses',
      weightLoss: '-22kg',
      testimonial: 'Perdi 22kg em 4 meses! A combinação de treino e nutrição foi perfeita para mim.',
      verified: true
    },
    {
      id: 5,
      name: 'Ricardo Lima',
      beforeImage: '/results/ricardo-before.jpg',
      afterImage: '/results/ricardo-after.jpg',
      objective: 'hipertrofia',
      time: '8 meses',
      muscleGain: '+12kg massa magra',
      testimonial: 'Oito meses de dedicação e ganhei 12kg de massa magra. Valeu cada treino!',
      verified: true
    },
    {
      id: 6,
      name: 'Juliana Alves',
      beforeImage: '/results/juliana-before.jpg',
      afterImage: '/results/juliana-after.jpg',
      objective: 'qualidade-de-vida',
      time: '3 meses',
      improvement: 'Sem dores nas costas',
      testimonial: 'Eliminei as dores nas costas e ganhei muito mais qualidade de vida. Recomendo!',
      verified: true
    }
  ];

  const filtered = filter === 'all'
    ? resultados
    : resultados.filter(r => r.objective === filter);

  return (
    <main className="min-h-screen bg-gradient-to-b from-dark-card to-dark py-12 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold gradient-text mb-4">Resultados Reais</h1>
          <p className="text-text-secondary text-lg max-w-3xl mx-auto">
            Veja transformações reais de nossos alunos. Todos os resultados são verificados e moderados.
          </p>
        </div>

        {/* Filtros */}
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          <button
            onClick={() => setFilter('all')}
            className={`px-6 py-2 rounded-full font-semibold transition-all ${
              filter === 'all'
                ? 'bg-gradient-to-r from-primary to-primary-light text-white'
                : 'bg-white/5 text-text-secondary hover:bg-white/10'
            }`}
          >
            Todos
          </button>
          <button
            onClick={() => setFilter('emagrecimento')}
            className={`px-6 py-2 rounded-full font-semibold transition-all ${
              filter === 'emagrecimento'
                ? 'bg-gradient-to-r from-primary to-primary-light text-white'
                : 'bg-white/5 text-text-secondary hover:bg-white/10'
            }`}
          >
            Emagrecimento
          </button>
          <button
            onClick={() => setFilter('hipertrofia')}
            className={`px-6 py-2 rounded-full font-semibold transition-all ${
              filter === 'hipertrofia'
                ? 'bg-gradient-to-r from-primary to-primary-light text-white'
                : 'bg-white/5 text-text-secondary hover:bg-white/10'
            }`}
          >
            Hipertrofia
          </button>
          <button
            onClick={() => setFilter('qualidade-de-vida')}
            className={`px-6 py-2 rounded-full font-semibold transition-all ${
              filter === 'qualidade-de-vida'
                ? 'bg-gradient-to-r from-primary to-primary-light text-white'
                : 'bg-white/5 text-text-secondary hover:bg-white/10'
            }`}
          >
            Qualidade de Vida
          </button>
        </div>

        {/* Grid de Resultados */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.map((result) => (
            <div key={result.id} className="card-float p-6 hover:scale-105 transition-transform duration-300">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-text-primary">{result.name}</h3>
                {result.verified && (
                  <span className="flex items-center gap-1 text-xs bg-emerald-500/10 text-emerald-400 px-2 py-1 rounded">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Verificado
                  </span>
                )}
              </div>

              {/* Imagens Antes/Depois */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="aspect-[3/4] bg-white/5 rounded-lg flex items-center justify-center overflow-hidden">
                  <div className="text-center p-4">
                    <p className="text-xs font-bold text-text-secondary mb-2">ANTES</p>
                    <div className="w-full h-full bg-gradient-to-br from-gray-400 to-gray-600 rounded"></div>
                  </div>
                </div>
                <div className="aspect-[3/4] bg-white/5 rounded-lg flex items-center justify-center overflow-hidden">
                  <div className="text-center p-4">
                    <p className="text-xs font-bold text-primary mb-2">DEPOIS</p>
                    <div className="w-full h-full bg-gradient-to-br from-primary to-primary-light rounded"></div>
                  </div>
                </div>
              </div>

              {/* Métricas */}
              <div className="mb-4">
                {result.weightLoss && (
                  <div className="text-sm mb-2">
                    <span className="text-text-secondary">Perda de peso: </span>
                    <span className="font-bold text-emerald-400">{result.weightLoss}</span>
                  </div>
                )}
                {result.muscleGain && (
                  <div className="text-sm mb-2">
                    <span className="text-text-secondary">Ganho de massa: </span>
                    <span className="font-bold text-primary">{result.muscleGain}</span>
                  </div>
                )}
                {result.improvement && (
                  <div className="text-sm mb-2">
                    <span className="text-text-secondary">Melhoria: </span>
                    <span className="font-bold text-primary">{result.improvement}</span>
                  </div>
                )}
                <div className="text-sm">
                  <span className="text-text-secondary">Tempo: </span>
                  <span className="font-bold text-text-primary">{result.time}</span>
                </div>
              </div>

              {/* Depoimento */}
              <div className="bg-white/5 rounded-lg p-4 mb-4">
                <p className="text-sm text-text-secondary italic">"{result.testimonial}"</p>
              </div>

              <div className="text-xs text-text-secondary text-center">
                Resultado moderado e verificado pela equipe GymFlow
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-12 card-float p-8 text-center">
          <h2 className="text-2xl font-bold text-text-primary mb-4">Quer ser o próximo resultado?</h2>
          <p className="text-text-secondary mb-6">
            Comece sua jornada hoje mesmo com 7 dias grátis. Sem compromisso, sem cartão de crédito.
          </p>
          <a
            href="/pre-register"
            className="inline-block px-8 py-4 bg-gradient-to-r from-primary to-primary-light text-white rounded-xl font-bold text-lg hover:shadow-xl transition-all"
          >
            Começar Agora - 7 Dias Grátis
          </a>
        </div>
      </div>
    </main>
  );
}
