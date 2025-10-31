'use client';
import { useState } from 'react';

export default function BlogPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const posts = [
    {
      id: 1,
      title: '10 Exercícios para Emagrecimento em Casa',
      category: 'treino',
      excerpt: 'Aprenda exercícios simples que você pode fazer em casa para queimar calorias e acelerar o metabolismo.',
      image: '/blog/emagrecimento-casa.jpg',
      date: '2024-01-15',
      author: 'Roberto Lima',
      readTime: '5 min',
      slug: '10-exercicios-emagrecimento-casa',
    },
    {
      id: 2,
      title: 'Guia Completo de Nutrição para Hipertrofia',
      category: 'nutricao',
      excerpt: 'Descubra os alimentos essenciais e estratégias nutricionais para maximizar o ganho de massa muscular.',
      image: '/blog/nutricao-hipertrofia.jpg',
      date: '2024-01-12',
      author: 'Ana Paula Santos',
      readTime: '8 min',
      slug: 'guia-nutricao-hipertrofia',
    },
    {
      id: 3,
      title: 'Como Criar uma Rotina de Treino Eficiente',
      category: 'treino',
      excerpt: 'Dicas práticas para organizar seus treinos semanais e alcançar seus objetivos de forma consistente.',
      image: '/blog/rotina-treino.jpg',
      date: '2024-01-10',
      author: 'Carlos Silva',
      readTime: '6 min',
      slug: 'como-criar-rotina-treino',
    },
    {
      id: 4,
      title: 'Suplementação: O Que Você Precisa Saber',
      category: 'nutricao',
      excerpt: 'Um guia honesto sobre suplementos: quais funcionam, quando usar e como escolher com segurança.',
      image: '/blog/suplementacao.jpg',
      date: '2024-01-08',
      author: 'Ana Paula Santos',
      readTime: '10 min',
      slug: 'suplementacao-guia-completo',
    },
    {
      id: 5,
      title: 'Prevenção de Lesões no Treino',
      category: 'saude',
      excerpt: 'Conheça as principais causas de lesões e aprenda a treinar com segurança e inteligência.',
      image: '/blog/prevencao-lesoes.jpg',
      date: '2024-01-05',
      author: 'Dr. Carlos Silva',
      readTime: '7 min',
      slug: 'prevencao-lesoes-treino',
    },
    {
      id: 6,
      title: 'Hábitos Matinais para Mais Energia',
      category: 'qualidade-de-vida',
      excerpt: 'Rotinas simples que vão transformar seu dia e aumentar sua energia naturalmente.',
      image: '/blog/habitos-matinais.jpg',
      date: '2024-01-03',
      author: 'Mariana Costa',
      readTime: '5 min',
      slug: 'habitos-matinais-energia',
    },
  ];

  const categories = [
    { key: 'all', label: 'Todos' },
    { key: 'treino', label: 'Treino' },
    { key: 'nutricao', label: 'Nutrição' },
    { key: 'saude', label: 'Saúde' },
    { key: 'qualidade-de-vida', label: 'Qualidade de Vida' },
  ];

  const filteredPosts = selectedCategory === 'all'
    ? posts
    : posts.filter(p => p.category === selectedCategory);

  return (
    <main className="min-h-screen bg-gradient-to-b from-dark-card to-dark py-12 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold gradient-text mb-4">Blog & Guia Fitness</h1>
          <p className="text-text-secondary text-lg max-w-3xl mx-auto">
            Conteúdo exclusivo sobre treinos, nutrição e bem-estar para acelerar seus resultados
          </p>
        </div>

        {/* Filtros */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((cat) => (
            <button
              key={cat.key}
              onClick={() => setSelectedCategory(cat.key)}
              className={`px-6 py-2 rounded-full font-semibold transition-all ${
                selectedCategory === cat.key
                  ? 'bg-gradient-to-r from-primary to-primary-light text-white'
                  : 'bg-white/5 text-text-secondary hover:bg-white/10'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Grid de Posts */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {filteredPosts.map((post) => (
            <article
              key={post.id}
              className="card-float overflow-hidden hover:scale-105 transition-transform duration-300 cursor-pointer"
              onClick={() => {
                if (typeof window !== 'undefined') {
                  window.location.href = `/blog/${post.slug}`;
                }
              }}
            >
              <div className="aspect-video bg-gradient-to-br from-primary/20 to-primary-light/20 flex items-center justify-center">
                <div className="text-6xl text-primary/30">{post.category === 'treino' ? '💪' : post.category === 'nutricao' ? '🥗' : '❤️'}</div>
              </div>
              <div className="p-6">
                <div className="flex items-center gap-2 text-xs text-text-secondary mb-3">
                  <span className="bg-primary/10 text-primary px-2 py-1 rounded">
                    {categories.find(c => c.key === post.category)?.label}
                  </span>
                  <span>•</span>
                  <span>{new Date(post.date).toLocaleDateString('pt-BR')}</span>
                  <span>•</span>
                  <span>{post.readTime}</span>
                </div>
                <h2 className="text-xl font-bold text-text-primary mb-3 line-clamp-2">
                  {post.title}
                </h2>
                <p className="text-sm text-text-secondary mb-4 line-clamp-3">
                  {post.excerpt}
                </p>
                <div className="flex items-center justify-between">
                  <div className="text-xs text-text-secondary">
                    Por {post.author}
                  </div>
                  <a
                    href={`/blog/${post.slug}`}
                    className="text-primary hover:text-primary-light font-semibold text-sm flex items-center gap-1"
                  >
                    Ler mais
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* CTA */}
        <div className="card-float p-8 text-center">
          <h2 className="text-2xl font-bold text-text-primary mb-4">Quer resultados mais rápidos?</h2>
          <p className="text-text-secondary mb-6">
            Junte-se a centenas de alunos que já estão transformando seus corpos com acompanhamento profissional
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
