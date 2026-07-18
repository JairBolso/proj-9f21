-- Corpo das páginas de política vira conteúdo editável (HTML simples:
-- h2/p/ul/li/strong), reaproveitando a tabela conteudo_site já usada
-- para o resto do texto do site. Semente = exatamente o texto que já
-- estava hardcoded nas páginas, pra não mudar nada visualmente até
-- alguém editar pelo painel.

insert into conteudo_site (chave, tipo, valor, descricao) values
('politica_garantia_corpo', 'texto', $html$<div>
  <h2>Garantia de fábrica</h2>
  <p>Todos os equipamentos R3 Fitness saem de fábrica com garantia contra defeitos de fabricação. O prazo padrão é de <strong>2 anos</strong>, podendo variar conforme o produto e a linha — a condição específica de cada equipamento é informada na ficha técnica da página do produto e na proposta comercial enviada pelo nosso time de vendas.</p>
</div>
<div>
  <h2>O que a garantia cobre</h2>
  <ul>
    <li>Defeitos estruturais na solda e na montagem do equipamento;</li>
    <li>Falhas em componentes mecânicos originais de fábrica;</li>
    <li>Problemas de pintura eletrostática decorrentes de defeito de aplicação (não cobre desgaste natural por uso ou impacto).</li>
  </ul>
</div>
<div>
  <h2>O que não é coberto</h2>
  <ul>
    <li>Desgaste natural por uso intenso ou mau uso do equipamento;</li>
    <li>Danos causados por instalação feita fora dos padrões técnicos da R3;</li>
    <li>Modificações ou reparos feitos por terceiros não autorizados;</li>
    <li>Danos causados por umidade, corrosão externa ou falta de manutenção básica.</li>
  </ul>
</div>
<div>
  <h2>Como acionar a assistência técnica</h2>
  <p>Entre em contato com nossa equipe pelo WhatsApp <strong>(17) 99716-8842</strong> ou pelo e-mail <strong>orcamento@r3fitness.com.br</strong>, informando o número do pedido ou nota fiscal e uma descrição (com fotos, se possível) do problema identificado. Nossa equipe técnica avalia o caso e orienta os próximos passos, que podem incluir envio de peças, visita técnica ou reparo em fábrica, conforme a situação.</p>
</div>$html$, 'Texto (HTML simples: h2/p/ul/li/strong) da página Garantia e Assistência'),

('politica_entrega_corpo', 'texto', $html$<div>
  <h2>Entrega para todo o Brasil</h2>
  <p>A R3 Fitness fabrica e entrega equipamentos para academias, studios e condomínios em qualquer estado do país. O prazo de entrega é combinado com você no momento do fechamento do pedido, considerando a linha de produtos escolhida, a quantidade de equipamentos e a localidade de destino.</p>
</div>
<div>
  <h2>Montagem inclusa</h2>
  <p>A montagem é feita por equipe própria da R3, sem custo adicional. Nossa equipe técnica realiza a instalação completa dos equipamentos no local combinado, seguindo os padrões de segurança e fixação recomendados para cada linha de produto.</p>
</div>
<div>
  <h2>Recebimento</h2>
  <ul>
    <li>No momento da entrega, é necessário apresentar um documento de identificação;</li>
    <li>Recomendamos conferir se as embalagens estão íntegras antes de assinar o recebimento;</li>
    <li>Em entregas realizadas por transportadora, podem ocorrer até três tentativas de entrega no endereço informado.</li>
  </ul>
</div>
<div>
  <h2>Fatores que podem afetar o prazo</h2>
  <p>Condições climáticas adversas, greves, restrições de acesso ao local de instalação ou informações incompletas de endereço podem impactar o prazo combinado. Nesses casos, nossa equipe entra em contato para alinhar uma nova data.</p>
</div>
<div>
  <h2>Dúvidas sobre sua entrega</h2>
  <p>Fale com a gente pelo WhatsApp <strong>(17) 99716-8842</strong> ou pelo e-mail <strong>orcamento@r3fitness.com.br</strong> informando o número do seu pedido.</p>
</div>$html$, 'Texto (HTML simples: h2/p/ul/li/strong) da página Entrega e Montagem'),

('politica_devolucao_corpo', 'texto', $html$<div>
  <h2>Direito de devolução</h2>
  <p>Você tem o direito de solicitar a devolução em até <strong>7 dias corridos</strong> após o recebimento do equipamento, sem custo adicional, desde que:</p>
  <ul>
    <li>O produto esteja na embalagem original, sem sinais de uso ou violação;</li>
    <li>Todos os acessórios originais estejam inclusos;</li>
    <li>O produto não tenha sido utilizado, lavado ou consertado;</li>
    <li>A nota fiscal acompanhe o produto devolvido.</li>
  </ul>
</div>
<div>
  <h2>Como funciona o reembolso</h2>
  <p>Após a aprovação da devolução, o reembolso é feito conforme o método de pagamento utilizado na compra:</p>
  <ul>
    <li><strong>Cartão de crédito:</strong> estorno direto na fatura, em até 7 dias úteis;</li>
    <li><strong>Pix ou boleto:</strong> transferência bancária, em até 7 dias úteis.</li>
  </ul>
</div>
<div>
  <h2>Solicitando uma devolução</h2>
  <p>Entre em contato com nossa equipe pelo WhatsApp <strong>(17) 99716-8842</strong> ou pelo e-mail <strong>orcamento@r3fitness.com.br</strong>, informando o número do pedido e o motivo da devolução. Nossa equipe orienta os próximos passos, incluindo a coleta do equipamento quando aplicável.</p>
</div>$html$, 'Texto (HTML simples: h2/p/ul/li/strong) da página Reembolso e Devoluções'),

('politica_privacidade_corpo', 'texto', $html$<div>
  <h2>Introdução</h2>
  <p>Esta política explica como a R3 Fitness Equipamentos Para Academia LTDA (CNPJ 28.722.145/0001-15) coleta, usa, armazena e protege os dados pessoais de quem visita nosso site ou entra em contato com nossa equipe. Seguimos a Lei Geral de Proteção de Dados Pessoais (LGPD) e o Marco Civil da Internet.</p>
</div>
<div>
  <h2>Quais dados coletamos e para quê</h2>
  <p>Coletamos dados como nome, WhatsApp, e-mail e cidade quando você:</p>
  <ul>
    <li>Solicita um orçamento pelo site ou adiciona produtos ao carrinho;</li>
    <li>Preenche o formulário de contato;</li>
    <li>Fala com nossa equipe comercial.</li>
  </ul>
  <p>Usamos esses dados para:</p>
  <ul>
    <li>Responder sua solicitação de orçamento e dar andamento à venda;</li>
    <li>Melhorar sua experiência e as funcionalidades do site;</li>
    <li>Entender como o site é utilizado, para aprimorar nosso atendimento.</li>
  </ul>
  <p>Qualquer nova finalidade para o uso dos seus dados será comunicada previamente.</p>
</div>
<div>
  <h2>Cookies</h2>
  <p>Usamos cookies e ferramentas como Meta Pixel e Google Tag Manager para entender a navegação no site e medir a performance de nossas campanhas de anúncios. Você pode gerenciar ou desativar cookies diretamente nas configurações do seu navegador.</p>
</div>
<div>
  <h2>Segurança</h2>
  <p>Adotamos medidas técnicas para proteger seus dados contra acesso não autorizado. Reconhecemos que nenhum sistema é completamente invulnerável e trabalhamos continuamente para reduzir riscos.</p>
</div>
<div>
  <h2>Comunicações</h2>
  <p>Não enviamos e-mails ou mensagens não solicitadas. Você pode pedir para não receber mais contatos comerciais a qualquer momento, falando diretamente com nossa equipe.</p>
</div>
<div>
  <h2>Seus direitos</h2>
  <p>Você pode solicitar a qualquer momento a confirmação, correção ou exclusão dos seus dados pessoais em nossa base, entrando em contato pelo e-mail <strong>orcamento@r3fitness.com.br</strong>.</p>
</div>
<div>
  <h2>Lei aplicável</h2>
  <p>Esta política é regida pela legislação brasileira. Eventuais controvérsias serão, preferencialmente, resolvidas de forma extrajudicial.</p>
</div>$html$, 'Texto (HTML simples: h2/p/ul/li/strong) da página Política de Privacidade'),

('politica_termos_corpo', 'texto', $html$<div>
  <h2>Aceitação dos termos</h2>
  <p>Ao usar o site da R3 Fitness, você concorda integralmente com os termos apresentados nesta página. Recomendamos a leitura completa antes de solicitar um orçamento ou fechar uma compra.</p>
</div>
<div>
  <h2>Cadastro e responsabilidade pelos dados</h2>
  <p>Ao preencher seus dados no site (nome, WhatsApp, e-mail), você declara que as informações são verdadeiras e que possui 18 anos ou mais, ou é emancipado. O uso de dados de terceiros sem autorização pode configurar crime de falsidade de identidade.</p>
</div>
<div>
  <h2>Imagens e representação dos produtos</h2>
  <p>Buscamos manter as fotos dos produtos o mais fiéis possível às cores e ao acabamento reais dos equipamentos. Ainda assim, podem ocorrer pequenas variações de cor conforme a calibração da tela do seu dispositivo.</p>
</div>
<div>
  <h2>Preços e disponibilidade</h2>
  <p>A R3 Fitness reserva-se o direito de corrigir eventuais erros de valores e de atualizar preços sem aviso prévio. Condições comerciais especiais têm validade limitada e estão sujeitas à disponibilidade de produção.</p>
</div>
<div>
  <h2>Direitos autorais</h2>
  <p>Todo o conteúdo do site — textos, fotos e imagens dos produtos — é protegido por direitos autorais da R3 Fitness. O uso não autorizado desse conteúdo é proibido.</p>
</div>
<div>
  <h2>Como funciona o processo de compra</h2>
  <p>Você escolhe os equipamentos e os adiciona ao carrinho de orçamento. No checkout, informa nome, WhatsApp e e-mail. Nossa equipe comercial entra em contato para fechar os detalhes da proposta, formas de pagamento e prazo de entrega.</p>
</div>
<div>
  <h2>Foro</h2>
  <p>Estes termos são regidos pela legislação brasileira, com preferência pela resolução extrajudicial de eventuais controvérsias.</p>
</div>$html$, 'Texto (HTML simples: h2/p/ul/li/strong) da página Termos de Uso')

on conflict (chave) do nothing;
