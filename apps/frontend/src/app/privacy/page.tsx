export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-dark-card to-dark py-12 px-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold gradient-text mb-6">Política de Privacidade</h1>
        <div className="card-float p-8 space-y-6">
          <section>
            <h2 className="text-2xl font-bold text-text-primary mb-4">1. Informações Coletadas</h2>
            <p className="text-text-secondary leading-relaxed">
              Coletamos informações que você nos fornece diretamente, como nome, e-mail, telefone, dados de perfil físico e informações de pagamento.
              Também coletamos automaticamente dados de uso, incluindo endereço IP, tipo de navegador e padrões de interação com a plataforma.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-text-primary mb-4">2. Uso das Informações</h2>
            <p className="text-text-secondary leading-relaxed">
              Utilizamos suas informações para: fornecer e melhorar nossos serviços, processar pagamentos, enviar notificações relevantes,
              personalizar sua experiência e cumprir obrigações legais.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-text-primary mb-4">3. Compartilhamento de Dados</h2>
            <p className="text-text-secondary leading-relaxed">
              Não vendemos seus dados pessoais. Podemos compartilhar informações com prestadores de serviços confiáveis (processadores de pagamento,
              hospedagem) apenas para operar nossos serviços. Compartilhamos dados apenas quando exigido por lei.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-text-primary mb-4">4. Seus Direitos (LGPD)</h2>
            <p className="text-text-secondary leading-relaxed">
              Conforme a Lei Geral de Proteção de Dados (LGPD), você tem direito a: acesso aos seus dados, correção de dados incompletos ou desatualizados,
              exclusão de dados desnecessários, portabilidade dos dados, revogação do consentimento e oposição ao tratamento de dados.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-text-primary mb-4">5. Segurança</h2>
            <p className="text-text-secondary leading-relaxed">
              Implementamos medidas de segurança técnicas e organizacionais para proteger seus dados pessoais contra acesso não autorizado,
              alteração, divulgação ou destruição.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-text-primary mb-4">6. Retenção de Dados</h2>
            <p className="text-text-secondary leading-relaxed">
              Mantemos seus dados pessoais apenas pelo tempo necessário para cumprir os propósitos descritos nesta política,
              salvo quando a retenção for exigida ou permitida por lei.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-text-primary mb-4">7. Contato</h2>
            <p className="text-text-secondary leading-relaxed">
              Para exercer seus direitos ou esclarecer dúvidas sobre esta política, entre em contato conosco através do e-mail:
              <a href="mailto:privacidade@gymflow.com" className="text-primary hover:underline ml-1">privacidade@gymflow.com</a>
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
