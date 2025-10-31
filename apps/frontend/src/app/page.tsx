'use client';
import { useEffect } from 'react';
import PromoBar from './components/PromoBar';
import ExitIntentModal from './components/ExitIntentModal';
import { isFeatureEnabled } from './lib/features';
import { trackCTAClick, trackEvent } from './lib/analytics';

export default function HomePage() {
  const popularBadge = isFeatureEnabled('popularBadge');
  const promoBarEnabled = isFeatureEnabled('promoBarEnabled');
  const exitIntentEnabled = isFeatureEnabled('exitIntentEnabled');

  useEffect(() => {
    trackEvent({ type: 'PAGE_VIEW', page: 'home' });
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-b from-dark-card to-dark">
      {promoBarEnabled && <PromoBar deadline={new Date(Date.now() + 7*24*60*60*1000).toISOString()} />}
      {/* Hero Section with background video and dual CTA */}
      <section className="relative pt-24 pb-24 px-6 overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-primary/20 via-dark-card to-dark">
          {/* Background video - gracefully handles missing file */}
          <video
            className="w-full h-full object-cover opacity-30"
            autoPlay
            muted
            loop
            playsInline
            poster="/hero-poster.jpg"
            onError={(e) => {
              // Hide video if it fails to load (file doesn't exist)
              (e.target as HTMLVideoElement).style.display = 'none';
            }}
          >
            <source src="/hero-bg.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-transparent" />
        </div>
        <div className="max-w-7xl mx-auto text-center">
          <span className="inline-flex items-center gap-2 bg-white/10 text-white rounded-full px-4 py-2 ring-1 ring-white/20 mb-6">
            <span className="relative inline-flex">
              <span className="animate-ping absolute inline-flex h-2.5 w-2.5 rounded-full bg-emerald-400/60"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400"></span>
            </span>
            <span className="text-sm font-semibold">Teste grátis por 7 dias</span>
          </span>
          <h1 className="text-5xl md:text-6xl font-bold gradient-text mb-6">GymFlow</h1>
          <p className="text-xl text-white/90 max-w-3xl mx-auto mb-10">
            Transforme sua jornada fitness com gestão completa, treinos dinâmicos e acompanhamento real.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/pre-register"
              onClick={() => trackCTAClick('7 dias grátis', 'home')}
              className="px-8 py-4 bg-gradient-to-r from-primary to-primary-light text-white rounded-xl font-bold text-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
              7 dias grátis
            </a>
            <a
              href="https://wa.me/5511999999999?text=Quero%20saber%20mais%20sobre%20os%20planos%20da%20GymFlow"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackCTAClick('Falar no WhatsApp', 'home')}
              className="px-8 py-4 bg-white text-primary border-2 border-primary rounded-xl font-bold text-lg hover:bg-primary hover:text-white transition-all duration-300"
            >
              Falar no WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* Social Proof: logos, rating, metrics */}
      <section className="py-10 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            {/* Partner logos - gracefully handle missing files */}
            <div className="flex items-center gap-8 opacity-80 min-h-[40px] justify-center md:justify-start">
              {['/logos/logo1.svg','/logos/logo2.svg','/logos/logo3.svg','/logos/logo4.svg','/logos/logo5.svg'].map((src, i) => (
                <span key={i} className="inline-block">
                  <img
                    src={src}
                    alt={`Partner ${i + 1}`}
                    className="h-8 md:h-10 w-auto object-contain"
                    onError={(e) => {
                      // Hide logo container if it fails to load
                      const container = (e.target as HTMLImageElement).parentElement;
                      if (container) {
                        container.style.display = 'none';
                      }
                    }}
                    loading="lazy"
                  />
                </span>
              ))}
            </div>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-3 bg-white/5 border border-dark-border rounded-xl px-3 py-2">
                <div className="flex text-yellow-400">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <svg key={i} className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.563 4.798a1 1 0 00.95.69h5.045c.969 0 1.371 1.24.588 1.81l-4.084 2.968a1 1 0 00-.364 1.118l1.563 4.798c.3.922-.755 1.688-1.539 1.118l-4.084-2.968a1 1 0 00-1.176 0l-4.084 2.968c-.783.57-1.838-.196-1.539-1.118l1.563-4.798a1 1 0 00-.364-1.118L.853 10.225c-.783-.57-.38-1.81.588-1.81h5.045a1 1 0 00.95-.69l1.563-4.798z"/></svg>
                  ))}
                </div>
                <div className="text-sm text-text-secondary"><span className="font-bold text-text-primary">4,9</span> de 5 <span className="hidden sm:inline">(1.200 avaliações)</span></div>
              </div>
              <div className="hidden md:block w-px h-8 bg-dark-border" />
              <div className="flex items-center gap-2 md:gap-4 text-xs md:text-sm text-text-secondary">
                <div className="bg-white/5 border border-dark-border rounded-lg px-2.5 py-1"><span className="font-bold text-text-primary">10k+</span> treinos concluídos</div>
                <div className="bg-white/5 border border-dark-border rounded-lg px-2.5 py-1"><span className="font-bold text-text-primary">98%</span> satisfação</div>
                <div className="bg-white/5 border border-dark-border rounded-lg px-2.5 py-1"><span className="font-bold text-text-primary">500+</span> alunos ativos</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-6 bg-gradient-to-b from-white/5 to-transparent">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {[
              { label: 'Alunos Ativos', value: '500+', icon: 'users' },
              { label: 'Professores', value: '25+', icon: 'teacher' },
              { label: 'Modalidades', value: '10+', icon: 'modalities' },
              { label: 'Satisfação', value: '98%', icon: 'star' },
            ].map((stat, index) => (
              <div key={index} className="group text-center p-6 bg-dark-card rounded-2xl border border-dark-border hover:border-primary/50 hover:shadow-lg transition-all duration-300">
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-primary-light/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      {stat.icon === 'users' && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />}
                      {stat.icon === 'teacher' && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />}
                      {stat.icon === 'modalities' && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />}
                      {stat.icon === 'star' && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />}
                    </svg>
                  </div>
                </div>
                <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary to-primary-light bg-clip-text text-transparent mb-2">{stat.value}</div>
                <div className="text-sm md:text-base text-text-secondary font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Free vs Paid Section */}
      <section className="py-16 px-6 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <div className="relative inline-flex items-center gap-3 mb-5">
              <span className="relative inline-flex">
                <span className="animate-ping absolute inline-flex h-6 w-6 rounded-full bg-green-500/60"></span>
                <span className="relative inline-flex rounded-full h-6 w-6 bg-green-500"></span>
              </span>
              <span className="inline-block bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-full px-6 py-2 shadow-xl ring-4 ring-green-500/30">
                <span className="font-extrabold tracking-wide text-base md:text-lg">⚡ OFERTA LIMITADA - 7 DIAS GRÁTIS</span>
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-center mb-4">Escolha o Plano Perfeito para Você</h2>
            <p className="text-text-secondary text-center max-w-2xl mx-auto text-lg">
              Compare os recursos disponíveis em cada plano e comece sua transformação hoje mesmo
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full max-w-4xl min-w-[720px] mx-auto border-collapse table-fixed">
              <thead>
                <tr>
                  <th className="p-4 text-left w-1/2"></th>
                  <th className="p-4 text-center w-1/4">
                    <div className="mb-1">
                      <span className="bg-primary text-white text-[10px] font-bold px-3 py-0.5 rounded-full invisible select-none leading-none">MAIS POPULAR</span>
                    </div>
                    <div className="text-xl font-bold text-text-primary leading-tight">Gratuito</div>
                    <div className="text-text-secondary leading-tight">7 dias grátis</div>
                  </th>
                  <th className="p-4 text-center w-1/4">
                    <div className="mb-1">
                      <span className="bg-primary text-white text-[10px] font-bold px-3 py-0.5 rounded-full leading-none">{popularBadge ? 'MAIS POPULAR' : 'GARANTIA 7 DIAS'}</span>
                    </div>
                    <div className="text-xl font-bold text-primary leading-tight">Premium</div>
                    <div className="text-text-secondary">Experiência completa</div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {[
                  { feature: 'Acesso à musculação', free: true, premium: true },
                  { feature: 'Aulas de grupo limitadas', free: '1/sem', premium: 'Ilimitado' },
                  { feature: 'Treinos personalizados', free: false, premium: true },
                  { feature: 'Avaliação física', free: 'Mensal', premium: 'Semanal' },
                  { feature: 'Acompanhamento nutricional', free: false, premium: true },
                  { feature: 'Relatórios de progresso', free: false, premium: true },
                  { feature: 'Suporte prioritário', free: false, premium: true },
                  { feature: 'Acesso ao app mobile', free: true, premium: true },
                ].map((row, index) => (
                  <tr key={index} className="border-b border-dark-border">
                    <td className="py-3 px-4 font-medium text-text-primary w-1/2">{row.feature}</td>
                    <td className="py-3 px-4 text-center w-1/4">
                      {row.free === true ? (
                        <span className="text-green-500">✓</span>
                      ) : row.free === false ? (
                        <span className="text-red-500">✗</span>
                      ) : (
                        <span className="text-text-secondary">{row.free}</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-center w-1/4">
                      {row.premium === true ? (
                        <span className="text-green-500">✓</span>
                      ) : row.premium === false ? (
                        <span className="text-red-500">✗</span>
                      ) : (
                        <span className="text-text-secondary">{row.premium}</span>
                      )}
                    </td>
                  </tr>
                ))}
                <tr>
                  <td className="py-4 px-4 w-1/2"></td>
                  <td className="py-4 px-4 text-center w-1/4">
                    <div className="relative">
                      <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                        <span className="bg-gradient-to-r from-green-500 to-emerald-500 text-white text-[10px] font-bold px-3 py-1 rounded-full whitespace-nowrap">7 DIAS GRÁTIS</span>
                      </div>
                      <div className="pt-4">
                        <div className="text-3xl font-bold bg-gradient-to-r from-primary to-primary-light bg-clip-text text-transparent mb-1">7 dias teste</div>
                        <div className="text-text-secondary text-sm h-5 mb-1">Experimente grátis</div>
                        <a href="/pre-register" className="mt-4 px-6 py-2.5 bg-gradient-to-r from-primary to-primary-light text-white rounded-lg font-semibold block w-full max-w-[150px] mx-auto hover:shadow-xl hover:scale-105 transition-all duration-300">
                          Começar Agora
                        </a>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-center w-1/4">
                    <div className="pt-4">
                      <div className="relative inline-block mb-2">
                        <span className="absolute -top-4 left-1/2 -translate-x-1/2 bg-emerald-500 text-white text-[10px] font-bold px-3 py-1 rounded-full whitespace-nowrap">
                          {popularBadge ? 'MAIS POPULAR' : 'Garantia de 7 dias'}
                        </span>
                      </div>
                      <div className="text-3xl font-bold text-primary mb-1">R$ 129,90</div>
                      <div className="text-text-secondary text-sm h-5 mb-1">Por mês</div>
                      <div className="text-[11px] text-emerald-600 font-semibold mb-3">Economize 2 meses no plano anual</div>
                      <a
                        href="/pre-register"
                        onClick={() => trackCTAClick('Assinar Premium', 'home')}
                        className="mt-1 px-6 py-2.5 bg-gradient-to-r from-primary to-primary-light text-white rounded-lg font-semibold block w-full max-w-[170px] mx-auto hover:shadow-xl hover:scale-105 transition-all duration-300"
                      >
                        Assinar
                      </a>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-6 bg-white/5">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-4">Tudo que você precisa em um só lugar</h2>
          <p className="text-text-secondary text-center max-w-2xl mx-auto mb-12">
            Nossa plataforma oferece todas as ferramentas necessárias para sua transformação física e mental
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: 'Treinos Personalizados',
                description: 'Planos de treino adaptados ao seu nível e objetivos, criados por nossos especialistas',
                iconPath: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              },
              {
                title: 'Acompanhamento Nutricional',
                description: 'Planos alimentares personalizados para maximizar seus resultados',
                iconPath: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
              },
              {
                title: 'Progresso em Tempo Real',
                description: 'Monitore suas evoluções com métricas detalhadas e gráficos interativos',
                iconPath: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              },
              {
                title: 'Comunidade Engajada',
                description: 'Conecte-se com outros alunos e compartilhe experiências e conquistas',
                iconPath: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              },
              {
                title: 'Aulas Diversificadas',
                description: 'Mais de 10 modalidades para manter seu treino sempre interessante',
                iconPath: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
              },
              {
                title: 'Suporte Especializado',
                description: 'Nossa equipe está sempre pronta para ajudar com qualquer dúvida',
                iconPath: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              },
            ].map((feature, index) => (
              <div key={index} className="bg-dark-card p-6 rounded-2xl border border-dark-border hover:border-primary/50 transition-all duration-300">
                <div className="flex justify-center mb-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      {feature.iconPath}
                    </svg>
                  </div>
                </div>
                <h3 className="text-xl font-bold text-text-primary mb-2 text-center">{feature.title}</h3>
                <p className="text-text-secondary text-center">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 px-6 bg-white/5">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-4">O que nossos alunos dizem</h2>
          <p className="text-text-secondary text-center max-w-2xl mx-auto mb-12">
            Histórias reais de transformação e conquistas
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: 'Ana Silva',
                role: 'Aluna há 1 ano',
                content: 'A GymFlow mudou completamente minha relação com o exercício. Os treinos personalizados e o acompanhamento constante fizeram toda a diferença nos meus resultados.',
                result: 'Perdeu 15kg e ganhou mais energia'
              },
              {
                name: 'Carlos Oliveira',
                role: 'Aluno há 8 meses',
                content: 'Os professores são extremamente qualificados e atenciosos. A estrutura é excelente e o ambiente muito motivador. Recomendo para todos que buscam resultados reais.',
                result: 'Ganhou 8kg de massa muscular'
              },
              {
                name: 'Mariana Costa',
                role: 'Aluna há 1 ano e 3 meses',
                content: 'Além dos excelentes treinos, o acompanhamento nutricional e as aulas de yoga fizeram com que eu encontrasse o equilíbrio ideal. Perdi 15kg e ganhei muito mais qualidade de vida.',
                result: 'Reduziu 30% de gordura corporal'
              }
            ].map((testimonial, index) => (
              <div key={index} className="bg-dark-card p-6 rounded-2xl border border-dark-border">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary-light rounded-full flex items-center justify-center text-white font-bold">
                    {testimonial.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <h4 className="font-bold text-text-primary">{testimonial.name}</h4>
                    <p className="text-sm text-text-secondary">{testimonial.role}</p>
                  </div>
                </div>
                <p className="text-text-secondary text-sm mb-4 italic">"{testimonial.content}"</p>
                <div className="text-primary text-sm font-bold">{testimonial.result}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto text-center bg-gradient-to-r from-primary/10 to-primary-light/10 rounded-3xl p-12 border border-primary/20">
          <div className="inline-block bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-full px-6 py-2 mb-4">
            <span className="text-green-400 font-bold text-sm">✨ 7 DIAS GRÁTIS PARA TESTAR</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Pronto para transformar seu corpo?</h2>
          <p className="text-text-secondary mb-8 max-w-2xl mx-auto text-lg">
            Junte-se a mais de 500 alunos que já estão transformando suas vidas com a GymFlow
          </p>
          <a href="/pre-register" className="px-8 py-4 bg-gradient-to-r from-primary to-primary-light text-white rounded-xl font-bold text-lg hover:shadow-xl hover:scale-105 transition-all duration-300 inline-block">
            Comece Agora - 7 Dias Grátis
          </a>
          <div className="mt-4 flex items-center justify-center gap-2">
            <span className="inline-flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold px-3 py-1.5 rounded-full">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              Cartão não é exigido no teste de 7 dias
            </span>
          </div>
          <p className="text-text-secondary text-sm mt-2">Cancele a qualquer momento.</p>
        </div>
      </section>

      {/* WhatsApp Floating Button */}
      <a
        href="https://wa.me/5511999999999?text=Olá!%20Gostaria%20de%20saber%20mais%20sobre%20os%20planos%20da%20GymFlow"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 bg-[#25D366] hover:bg-[#20BA5A] text-white rounded-full p-4 shadow-2xl hover:scale-110 transition-all duration-300 group"
        aria-label="Fale conosco no WhatsApp"
      >
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
        </svg>
        <div className="absolute right-full mr-3 mb-2 hidden group-hover:block bg-gray-900 text-white text-sm px-3 py-2 rounded-lg whitespace-nowrap">
          Fale conosco no WhatsApp
        </div>
      </a>

      {/* Footer */}
      <footer className="bg-dark-card border-t border-dark-border py-12 px-6 mt-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="text-lg font-bold text-text-primary mb-4">GymFlow</h3>
              <p className="text-sm text-text-secondary">
                Transforme sua jornada fitness com gestão completa, treinos dinâmicos e acompanhamento real.
              </p>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-text-primary mb-4">Institucional</h4>
              <ul className="space-y-2 text-sm text-text-secondary">
                <li><a href="/equipe" className="hover:text-primary transition-colors">Equipe</a></li>
                <li><a href="/resultados" className="hover:text-primary transition-colors">Resultados</a></li>
                <li><a href="/status" className="hover:text-primary transition-colors">Status do Sistema</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-text-primary mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-text-secondary">
                <li><a href="/privacy" className="hover:text-primary transition-colors">Política de Privacidade</a></li>
                <li><a href="/lgpd" className="hover:text-primary transition-colors">LGPD</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-text-primary mb-4">Contato</h4>
              <ul className="space-y-2 text-sm text-text-secondary">
                <li>E-mail: contato@gymflow.com</li>
                <li>WhatsApp: (11) 99999-9999</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-dark-border pt-8 text-center text-sm text-text-secondary">
            <p>&copy; {new Date().getFullYear()} GymFlow. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>

      {/* Exit Intent Modal */}
      {exitIntentEnabled && <ExitIntentModal />}
    </main>
  );
}
