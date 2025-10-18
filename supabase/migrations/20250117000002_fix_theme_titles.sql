-- Atualizar títulos dos temas removendo "Tema sobre"
-- e capitalizando corretamente

UPDATE themes
SET name = INITCAP(REPLACE(name, 'Tema sobre ', ''))
WHERE name LIKE 'Tema sobre %';

-- Adicionar comentário
COMMENT ON COLUMN themes.name IS 'Nome do tema em português, sem prefixo "Tema sobre"';
