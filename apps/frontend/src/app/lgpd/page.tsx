export default function LGDPPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-dark-card to-dark py-12 px-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold gradient-text mb-6">LGPD - Lei Geral de Proteção de Dados</h1>
        <div className="card-float p-8 space-y-6">
          <section>
            <h2 className="text-2xl font-bold text-text-primary mb-4">O que é a LGPD?</h2>
            <p className="text-text-secondary leading-relaxed">
              A Lei Geral de Proteção de Dados Pessoais (Lei nº 13.709/2018) estabelece regras sobre coleta, armazenamento,
              tratamento e compartilhamento de dados pessoais, impondo mais proteção e penalidades para o descumprimento.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-text-primary mb-4">Como a GymFlow se adequa à LGPD</h2>
            <div className="space-y-4 text-text-secondary">
              <p>✓ Coletamos apenas dados necessários para prestar nossos serviços</p>
              <p>✓ Informamos claramente como seus dados são utilizados</p>
              <p>✓ Implementamos medidas de segurança para proteger suas informações</p>
              <p>✓ Respeitamos seus direitos de acesso, correção e exclusão de dados</p>
              <p>✓ Mantemos transparência sobre o tratamento de dados pessoais</p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-text-primary mb-4">Seus Direitos</h2>
            <div className="space-y-3 text-text-secondary">
              <div>
                <strong className="text-text-primary">Acesso:</strong> Você pode solicitar informações sobre quais dados temos sobre você.
              </div>
              <div>
                <strong className="text-text-primary">Correção:</strong> Você pode solicitar a correção de dados incompletos ou desatualizados.
              </div>
              <div>
                <strong className="text-text-primary">Exclusão:</strong> Você pode solicitar a exclusão de dados desnecessários ou excessivos.
              </div>
              <div>
                <strong className="text-text-primary">Portabilidade:</strong> Você pode solicitar a transferência dos seus dados para outro serviço.
              </div>
              <div>
                <strong className="text-text-primary">Revogação de Consentimento:</strong> Você pode revogar seu consentimento a qualquer momento.
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-text-primary mb-4">Como Exercer Seus Direitos</h2>
            <p className="text-text-secondary leading-relaxed mb-4">
              Para exercer qualquer um de seus direitos, entre em contato conosco através de:
            </p>
            <div className="bg-white/5 border border-dark-border rounded-xl p-4 space-y-2">
              <p className="text-text-primary"><strong>E-mail:</strong> <a href="mailto:lgpd@gymflow.com" className="text-primary hover:underline">lgpd@gymflow.com</a></p>
              <p className="text-text-primary"><strong>Telefone:</strong> (11) 99999-9999</p>
              <p className="text-text-primary"><strong>Horário de atendimento:</strong> Segunda a Sexta, 9h às 18h</p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-text-primary mb-4">Encarregado de Dados (DPO)</h2>
            <p className="text-text-secondary leading-relaxed">
              Nome: [Nome do DPO]<br/>
              E-mail: <a href="mailto:dpo@gymflow.com" className="text-primary hover:underline">dpo@gymflow.com</a>
            </p>
          </section>

          <div className="pt-6 border-t border-dark-border text-sm text-text-secondary">
            <p>Última atualização: {new Date().toLocaleDateString('pt-BR')}</p>
          </div>
        </div>
      </div>
    </main>
  );
}
