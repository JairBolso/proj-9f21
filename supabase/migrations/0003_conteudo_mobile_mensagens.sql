-- Adiciona variantes mobile dos banners e mensagens de WhatsApp editáveis.

insert into conteudo_site (chave, tipo, valor, descricao) values
  ('cta_topo_mensagem', 'texto', 'Olá! Gostaria de solicitar um orçamento para equipamentos R3 Fitness.', 'Mensagem enviada ao clicar no botão "Solicitar Orçamento" do topo do site'),
  ('whatsapp_fab_mensagem', 'texto', 'Olá! Gostaria de falar com a R3 Fitness.', 'Mensagem enviada ao clicar no botão flutuante de WhatsApp'),
  ('hero_home_imagem_mobile', 'imagem', null, 'Banner da home — versão mobile'),
  ('hero_produtos_imagem_mobile', 'imagem', null, 'Banner da página de produtos — versão mobile'),
  ('hero_linhas_imagem_mobile', 'imagem', null, 'Banner da página de linhas — versão mobile'),
  ('hero_sobre_imagem_mobile', 'imagem', null, 'Banner da página sobre — versão mobile'),
  ('monte_academia_imagem_mobile', 'imagem', null, 'Foto da seção "Monte sua academia completa" — versão mobile')
on conflict (chave) do nothing;
