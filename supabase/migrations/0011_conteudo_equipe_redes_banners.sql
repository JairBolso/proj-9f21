-- Nome/função da equipe editáveis, novos pontos de imagem do site
-- (banner de Contato, fundo dos CTAs, imagem de compartilhamento) e
-- links das redes sociais do rodapé.

insert into conteudo_site (chave, tipo, valor, descricao) values
  -- Equipe (página Sobre): nome e função de cada pessoa
  ('sobre_equipe_1_nome', 'texto', 'Ricardo Alves', 'Equipe — nome da pessoa 1'),
  ('sobre_equipe_1_cargo', 'texto', 'Diretor de Fábrica', 'Equipe — função da pessoa 1'),
  ('sobre_equipe_2_nome', 'texto', 'Renata Souza', 'Equipe — nome da pessoa 2'),
  ('sobre_equipe_2_cargo', 'texto', 'Engenharia de Produto', 'Equipe — função da pessoa 2'),
  ('sobre_equipe_3_nome', 'texto', 'Rafael Torres', 'Equipe — nome da pessoa 3'),
  ('sobre_equipe_3_cargo', 'texto', 'Coordenação Comercial', 'Equipe — função da pessoa 3'),
  ('sobre_equipe_4_nome', 'texto', 'Camila Duarte', 'Equipe — nome da pessoa 4'),
  ('sobre_equipe_4_cargo', 'texto', 'Suporte Técnico', 'Equipe — função da pessoa 4'),

  -- Novos pontos de imagem
  ('hero_contato_imagem', 'imagem', null, 'Banner da página de contato'),
  ('hero_contato_imagem_mobile', 'imagem', null, 'Banner da página de contato — versão mobile'),
  ('cta_final_imagem', 'imagem', null, 'Foto de fundo dos blocos "Solicitar Orçamento" no fim das páginas'),
  ('cta_final_imagem_mobile', 'imagem', null, 'Foto de fundo dos blocos "Solicitar Orçamento" — versão mobile'),
  ('og_imagem', 'imagem', null, 'Imagem exibida ao compartilhar o site no WhatsApp e nas redes sociais'),

  -- Redes sociais do rodapé
  ('instagram_url', 'texto', 'https://www.instagram.com/r3fitnessequipamentos/', 'Link do Instagram exibido no rodapé'),
  ('youtube_url', 'texto', 'https://www.youtube.com/@R3Fitness', 'Link do YouTube exibido no rodapé')
on conflict (chave) do nothing;

-- As fotos da equipe deixam de ser descritas por nomes fixos: o nome agora
-- vem das chaves acima.
update conteudo_site set descricao = 'Equipe — foto da pessoa 1' where chave = 'sobre_equipe_1_imagem';
update conteudo_site set descricao = 'Equipe — foto da pessoa 2' where chave = 'sobre_equipe_2_imagem';
update conteudo_site set descricao = 'Equipe — foto da pessoa 3' where chave = 'sobre_equipe_3_imagem';
update conteudo_site set descricao = 'Equipe — foto da pessoa 4' where chave = 'sobre_equipe_4_imagem';
