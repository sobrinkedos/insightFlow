-- Traduzir títulos de temas em inglês para português
-- Esta migração garante que todos os temas tenham títulos em português

UPDATE themes SET title = 'Canais' WHERE title = 'Channels';
UPDATE themes SET title = 'Mercados Eletrônicos' WHERE title = 'E-Markets';
UPDATE themes SET title = 'Paradigmas' WHERE title = 'Paradigms';
UPDATE themes SET title = 'Portais' WHERE title = 'Portals';
UPDATE themes SET title = 'Soluções' WHERE title = 'Solutions';
UPDATE themes SET title = 'Tecnologias' WHERE title = 'Technologies';

-- Adicionar comentário explicativo
COMMENT ON COLUMN themes.title IS 'Título do tema sempre em português, sem prefixo "Tema sobre"';
