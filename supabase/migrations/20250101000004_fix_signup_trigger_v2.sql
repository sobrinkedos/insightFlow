/*
# [Fix] Corrige o Gatilho de Criação de Perfil de Usuário (v2)
Este script corrige o erro de dependência ao tentar modificar a função `handle_new_user`. O problema ocorre porque um gatilho na tabela `auth.users` depende dessa função, impedindo sua remoção direta.

## Descrição da Query:
A operação irá orquestrar a atualização da função e do gatilho na ordem correta para evitar erros de dependência:
1. Remove o gatilho `on_auth_user_created` existente na tabela `auth.users`.
2. Remove a função `handle_new_user` antiga.
3. Recria a função `handle_new_user` com `SECURITY DEFINER`, permitindo que ela execute com as permissões corretas para inserir o novo perfil na tabela `public.profiles`.
4. Recria o gatilho para que ele chame a nova função sempre que um novo usuário for criado.
Esta abordagem é segura e resolve o erro de dependência encontrado.

## Metadados:
- Schema-Category: "Structural"
- Impact-Level: "Low"
- Requires-Backup: false
- Reversible: true

## Detalhes da Estrutura:
- Afeta: trigger `on_auth_user_created`, function `handle_new_user`.
- Tabelas: `auth.users`, `public.profiles`.

## Implicações de Segurança:
- RLS Status: A função é alterada para `SECURITY DEFINER` para contornar as restrições de RLS durante a inserção inicial do perfil, o que é uma prática segura e recomendada para este caso de uso específico.
- Policy Changes: Não
- Auth Requirements: Apenas o administrador do banco de dados pode executar este script.

## Impacto no Desempenho:
- Indexes: Nenhum
- Triggers: O gatilho é recriado.
- Estimated Impact: Mínimo. O impacto no desempenho é insignificante e ocorre apenas no momento da criação de um novo usuário.
*/

-- 1. Remover o gatilho existente para evitar o erro de dependência.
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- 2. Remover a função antiga.
DROP FUNCTION IF EXISTS public.handle_new_user();

-- 3. Recriar a função com a correção de segurança.
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email)
  VALUES (new.id, new.email);
  RETURN new;
END;
$$;

-- 4. Recriar o gatilho para chamar a nova função.
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();
