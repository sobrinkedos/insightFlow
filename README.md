# InsightFlow

Sistema inteligente de gerenciamento e análise de vídeos com IA.

## 🚀 Funcionalidades

- 📹 **Gerenciamento de Vídeos**: Adicione e organize vídeos do YouTube
- 🤖 **Análise com IA**: Transcrição, resumos e extração de tópicos automáticos
- 🎯 **Temas Inteligentes**: Agrupe vídeos relacionados automaticamente
- ⭐ **Favoritos**: Marque seus vídeos preferidos
- 📊 **Progresso de Visualização**: Salve e retome vídeos de onde parou
- 🔍 **Busca Avançada**: Encontre vídeos por conteúdo, tópicos ou palavras-chave

## 📹 Controle de Progresso

### Como Usar

1. **Salvar Progresso Manualmente**:
   - Pause o vídeo
   - Digite o tempo (ex: `5:30` ou `1:05:30`)
   - Clique em "Salvar Progresso"

2. **Retomar de Onde Parou**:
   - Ao abrir um vídeo, um prompt aparece
   - Escolha "Continuar" ou "Começar do início"

3. **Visualizar Progresso**:
   - Veja barras de progresso na lista de vídeos
   - Verde = Completo, Azul = Em progresso

📖 **Guia Completo**: [COMO-USAR-PROGRESSO.md](./COMO-USAR-PROGRESSO.md)

## 🛠️ Setup do Projeto

### Pré-requisitos

- Node.js 18+
- Conta no Supabase
- Chaves de API (OpenAI, etc)

### Instalação

1. Clone o repositório:
```bash
git clone https://github.com/sobrinkedos/insightFlow.git
cd insightFlow
```

2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente:
```bash
cp .env.example .env
```

Edite `.env` com suas credenciais:
```env
VITE_SUPABASE_URL=sua_url_do_supabase
VITE_SUPABASE_ANON_KEY=sua_chave_anonima
```

4. Aplique as migrations do banco:
```bash
# Via Supabase CLI
supabase db push

# Ou via Dashboard do Supabase
# Copie e execute os arquivos em supabase/migrations/
```

5. Inicie o servidor de desenvolvimento:
```bash
npm run dev
```

## 📁 Estrutura do Projeto

```
insightFlow/
├── src/
│   ├── components/       # Componentes React
│   │   ├── video-player-simple.tsx
│   │   ├── video-progress-indicator.tsx
│   │   └── ...
│   ├── hooks/           # Hooks customizados
│   │   ├── use-video-progress.ts
│   │   └── use-videos-progress.ts
│   ├── pages/           # Páginas da aplicação
│   ├── types/           # Tipos TypeScript
│   └── lib/             # Utilitários
├── supabase/
│   ├── functions/       # Edge Functions
│   └── migrations/      # Migrations do banco
└── docs/                # Documentação

```

## 🗄️ Banco de Dados

### Tabelas Principais

- `videos` - Vídeos e metadados
- `themes` - Temas/categorias
- `video_progress` - Progresso de visualização
- `profiles` - Perfis de usuários

### Migrations

Todas as migrations estão em `supabase/migrations/`:
- `20241018000000_create_video_progress.sql` - Tabela de progresso

## 🔒 Segurança

- ✅ Row Level Security (RLS) ativo em todas as tabelas
- ✅ Autenticação via Supabase Auth
- ✅ Isolamento de dados por usuário
- ✅ Políticas otimizadas para performance

## 📚 Documentação

- [Como Usar Progresso de Vídeos](./COMO-USAR-PROGRESSO.md)
- [Feature de Progresso - Documentação Técnica](./VIDEO-PROGRESS-FEATURE.md)
- [Guia de Testes](./VIDEO-PROGRESS-TESTING.md)
- [Resumo da Implementação](./VIDEO-PROGRESS-SUMMARY.md)

## 🧪 Testes

```bash
# Executar testes
npm test

# Verificar tipos
npm run type-check

# Lint
npm run lint
```

## 🚀 Deploy

### Vercel (Recomendado)

1. Conecte seu repositório no Vercel
2. Configure as variáveis de ambiente
3. Deploy automático a cada push

### Outras Plataformas

O projeto é compatível com:
- Netlify
- Railway
- Render
- Cloudflare Pages

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📝 Changelog

### v1.1.0 (18/10/2024)
- ✨ Adicionado controle de progresso de vídeos
- ✨ Salvamento manual de progresso
- ✨ Prompt de retomada automática
- ✨ Indicadores visuais de progresso
- 🔧 Otimizações de performance no RLS

### v1.0.0
- 🎉 Lançamento inicial
- 📹 Gerenciamento de vídeos
- 🤖 Análise com IA
- 🎯 Sistema de temas

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 👥 Autores

- **Rilton Oliveira de Souza** - [GitHub](https://github.com/sobrinkedos)

## 🙏 Agradecimentos

- Supabase pela infraestrutura
- OpenAI pela API de IA
- Comunidade open source

---

**Status do Projeto**: ✅ Ativo e em Desenvolvimento

Para mais informações, visite [dualite.dev](https://dualite.dev)