'use client';

export default function EquipePage() {
  const team = [
    {
      name: 'Dr. Carlos Silva',
      role: 'Diretor Técnico',
      credentials: 'CREFF: 12345',
      specialties: ['Fisioterapia', 'Treinamento Funcional'],
      schedule: 'Segunda a Sexta: 8h - 18h',
      photo: '/team/carlos.jpg',
      email: 'carlos@gymflow.com'
    },
    {
      name: 'Ana Paula Santos',
      role: 'Nutricionista',
      credentials: 'CRN: 67890',
      specialties: ['Nutrição Esportiva', 'Reeducação Alimentar'],
      schedule: 'Terça e Quinta: 10h - 16h',
      photo: '/team/ana.jpg',
      email: 'ana@gymflow.com'
    },
    {
      name: 'Roberto Lima',
      role: 'Educador Físico',
      credentials: 'CREF: 11111',
      specialties: ['Musculação', 'Hipertrofia', 'Preparação Física'],
      schedule: 'Segunda a Sexta: 6h - 22h',
      photo: '/team/roberto.jpg',
      email: 'roberto@gymflow.com'
    },
    {
      name: 'Mariana Costa',
      role: 'Personal Trainer',
      credentials: 'CREF: 22222',
      specialties: ['Pilates', 'Yoga', 'Alongamento'],
      schedule: 'Segunda, Quarta e Sexta: 7h - 19h',
      photo: '/team/mariana.jpg',
      email: 'mariana@gymflow.com'
    }
  ];

  return (
    <main className="min-h-screen bg-gradient-to-b from-dark-card to-dark py-12 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold gradient-text mb-4">Nossa Equipe</h1>
          <p className="text-text-secondary text-lg max-w-3xl mx-auto">
            Profissionais qualificados e registrados para te ajudar em cada etapa da sua jornada fitness
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {team.map((member, index) => (
            <div key={index} className="card-float p-6 hover:scale-105 transition-transform duration-300">
              <div className="text-center mb-6">
                <div className="w-32 h-32 mx-auto bg-gradient-to-br from-primary to-primary-light rounded-full flex items-center justify-center text-white text-4xl font-bold mb-4 shadow-lg">
                  {member.name.charAt(0)}
                </div>
                <h3 className="text-2xl font-bold text-text-primary mb-1">{member.name}</h3>
                <p className="text-primary font-semibold mb-2">{member.role}</p>
                <p className="text-sm text-text-secondary bg-white/5 rounded-full px-3 py-1 inline-block">
                  {member.credentials}
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-semibold text-text-primary mb-2">Especialidades</h4>
                  <div className="flex flex-wrap gap-2">
                    {member.specialties.map((spec, i) => (
                      <span key={i} className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                        {spec}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-text-primary mb-1">Horários</h4>
                  <p className="text-sm text-text-secondary">{member.schedule}</p>
                </div>

                <a
                  href={`mailto:${member.email}`}
                  className="block w-full text-center px-4 py-2 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors text-sm font-semibold"
                >
                  Entrar em Contato
                </a>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 card-float p-8 text-center">
          <h2 className="text-2xl font-bold text-text-primary mb-4">Trabalhe Conosco</h2>
          <p className="text-text-secondary mb-6">
            Está procurando uma oportunidade de trabalho? Envie seu currículo para nossa equipe.
          </p>
          <a
            href="mailto:rh@gymflow.com"
            className="inline-block px-6 py-3 bg-gradient-to-r from-primary to-primary-light text-white rounded-xl font-semibold hover:shadow-xl transition-all"
          >
            Enviar Currículo
          </a>
        </div>
      </div>
    </main>
  );
}
