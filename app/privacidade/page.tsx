import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

export default function PrivacidadePage() {
  return (
    <>
      <Navbar />

      <section className="px-6 md:px-10 py-14 max-w-2xl">
        <div className="label-tag mb-4">Legal</div>
        <h1 className="font-serif text-4xl text-floreer-dark mb-8">Política de Privacidade</h1>

        <div className="flex flex-col gap-8 text-sm text-floreer-muted leading-[1.9]">
          <div>
            <p className="text-xs font-medium text-floreer-dark mb-2 tracking-wide uppercase">Última atualização: junho de 2026</p>
            <p>A Floreer valoriza a privacidade das suas alunas e se compromete a proteger seus dados pessoais, em conformidade com a Lei Geral de Proteção de Dados (LGPD — Lei nº 13.709/2018).</p>
          </div>

          <div>
            <h2 className="text-base font-medium text-floreer-dark mb-2">1. Dados que coletamos</h2>
            <p>Ao se cadastrar ou realizar uma compra na plataforma Floreer, coletamos: nome completo, endereço de e-mail e dados de pagamento (processados com segurança pelo Mercado Pago — não armazenamos dados de cartão). Coletamos também dados de acesso e progresso dentro dos cursos.</p>
          </div>

          <div>
            <h2 className="text-base font-medium text-floreer-dark mb-2">2. Como usamos seus dados</h2>
            <p>Seus dados são usados exclusivamente para: liberar acesso aos cursos adquiridos, enviar comunicações relacionadas à sua conta e compras, gerar certificados de conclusão e melhorar a experiência na plataforma.</p>
          </div>

          <div>
            <h2 className="text-base font-medium text-floreer-dark mb-2">3. Compartilhamento</h2>
            <p>Não vendemos nem compartilhamos seus dados com terceiros, exceto quando necessário para o funcionamento do serviço (ex: processamento de pagamento via Mercado Pago).</p>
          </div>

          <div>
            <h2 className="text-base font-medium text-floreer-dark mb-2">4. Seus direitos (LGPD)</h2>
            <p>Você tem direito de acessar, corrigir, excluir ou solicitar a portabilidade dos seus dados a qualquer momento. Para exercer qualquer um desses direitos, entre em contato pelo e-mail: <span className="text-floreer-dark">ola@floreer.com.br</span></p>
          </div>

          <div>
            <h2 className="text-base font-medium text-floreer-dark mb-2">5. Cookies</h2>
            <p>Utilizamos cookies essenciais para o funcionamento da plataforma (autenticação e sessão). Não utilizamos cookies de rastreamento de terceiros.</p>
          </div>

          <div>
            <h2 className="text-base font-medium text-floreer-dark mb-2">6. Contato</h2>
            <p>Dúvidas sobre esta política? Fale conosco em <span className="text-floreer-dark">ola@floreer.com.br</span></p>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
