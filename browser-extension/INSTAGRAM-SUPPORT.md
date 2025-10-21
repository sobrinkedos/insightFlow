# Suporte ao Instagram - Extensão InsightShare

## 🎉 Funcionalidades Completas

A extensão InsightShare agora oferece suporte completo para vídeos do Instagram com análise avançada de IA!

### ✅ O que funciona:

1. **Detecção Automática**
   - Reels (`/reel/`)
   - Posts com vídeo (`/p/`)
   - IGTV (`/tv/`)

2. **Extração de Dados**
   - URL limpa (sem parâmetros desnecessários)
   - Título/legenda do post
   - Thumbnail do vídeo

3. **Processamento Avançado**
   - Download automático do vídeo
   - Transcrição de áudio com Whisper API
   - Análise completa com GPT-4
   - Categorização inteligente
   - Detecção de tutoriais
   - Geração de resumos

## 🚀 Como Usar

### Passo 1: Instalar a Extensão
Siga o guia de instalação para seu navegador:
- [Chrome/Edge](INSTALL.md)
- [Firefox](INSTALL-FIREFOX.md)

### Passo 2: Navegar no Instagram
1. Abra o Instagram no navegador
2. Navegue até um Reel ou Post com vídeo
3. Aguarde a página carregar completamente

### Passo 3: Compartilhar
**Opção A - Botão Flutuante:**
- Clique no botão 🎬 no canto inferior direito

**Opção B - Ícone da Extensão:**
- Clique no ícone da extensão na barra
- Clique em "Compartilhar Vídeo"

**Opção C - Menu de Contexto:**
- Clique com botão direito na página
- Selecione "Compartilhar com InsightShare"

### Passo 4: Aguardar Processamento
- O vídeo será adicionado automaticamente
- Processamento leva ~30s-1min
- Inclui transcrição de áudio (Whisper API)
- Análise completa com IA

## 📋 Formatos de URL Suportados

A extensão detecta e limpa automaticamente URLs do Instagram:

### ✅ Suportados:
```
https://www.instagram.com/reel/ABC123/
https://www.instagram.com/reel/ABC123/?utm_source=ig_web_copy_link
https://www.instagram.com/p/ABC123/
https://www.instagram.com/tv/ABC123/
https://instagram.com/reel/ABC123/
```

### ❌ Não Suportados:
```
https://www.instagram.com/username/  (perfil)
https://www.instagram.com/stories/username/  (stories)
https://www.instagram.com/explore/  (explorar)
```

## 🎯 Recursos Especiais para Instagram

### 1. Transcrição de Áudio (Whisper API)
- Transcreve automaticamente o áudio do vídeo
- Suporta português e outros idiomas
- Custo: ~$0.006 por minuto
- Limite: vídeos até 25MB

### 2. Análise Inteligente
- Resumo curto e detalhado
- Categorização automática
- Extração de palavras-chave
- Identificação de tópicos
- Detecção de tutoriais

### 3. Player Nativo
- Vídeo exibe diretamente no InsightShare
- Sem necessidade de abrir Instagram
- Thumbnail carregado automaticamente
- Controles de reprodução completos

## 🔧 Detalhes Técnicos

### Extração de URL
```javascript
// Regex para capturar URL limpa
const match = url.match(/(https:\/\/www\.instagram\.com\/(?:p|reel|tv)\/[^\/\?]+)/);
```

### Extração de Título
Prioridade de fontes:
1. `<h1>` da página
2. `<meta property="og:title">`
3. `<meta name="description">`
4. Fallback: "Post do Instagram"

### Extração de Thumbnail
Prioridade de fontes:
1. `<meta property="og:image">`
2. `<meta property="og:image:secure_url">`

## 💰 Custos

### Whisper API (Transcrição)
- **$0.006 por minuto** de vídeo
- Vídeo de 30s: $0.003
- Vídeo de 1min: $0.006
- Vídeo de 5min: $0.030

### Estimativa Mensal
- 100 vídeos/mês × 1min = $0.60/mês
- 500 vídeos/mês × 1min = $3.00/mês
- 1000 vídeos/mês × 1min = $6.00/mês

**Muito acessível!** 💰

## ⚠️ Limitações

### Técnicas
1. **Tamanho:** Vídeos > 25MB não são transcritos
2. **Áudio:** Vídeos mudos não geram transcrição
3. **Privacidade:** Vídeos privados não são acessíveis

### Funcionais
1. **Stories:** Não suportados (expiram em 24h)
2. **Lives:** Não suportados
3. **Carrosséis:** Apenas o primeiro vídeo é processado

## 🐛 Troubleshooting

### Problema: Botão não aparece
**Soluções:**
1. Recarregue a página (F5)
2. Verifique se a extensão está ativada
3. Limpe cache do navegador

### Problema: URL não é detectada
**Soluções:**
1. Certifique-se que está em um Reel/Post
2. Aguarde a página carregar completamente
3. Copie a URL manualmente e cole no InsightShare

### Problema: Vídeo não processa
**Soluções:**
1. Verifique se o vídeo é público
2. Verifique se o vídeo tem áudio
3. Verifique se o vídeo < 25MB
4. Aguarde alguns minutos e recarregue

### Problema: Transcrição vazia
**Possíveis causas:**
1. Vídeo sem áudio
2. Áudio muito baixo/ruim
3. Vídeo > 25MB
4. Erro na API Whisper

## 📊 Exemplo de Resultado

### Antes (Sem Whisper):
```
Título: Post do Instagram
Resumo: Este vídeo apresenta conteúdo visual...
Categoria: Redes Sociais
```

### Depois (Com Whisper):
```
Título: Tutorial de Edição de Vídeo no CapCut
Resumo: Neste tutorial, aprenda 5 técnicas...
Categoria: Edição de Vídeo
Tutorial: Sim
Passos:
1. Abra o CapCut e importe seu vídeo
2. Adicione transições entre os clipes
3. Ajuste a velocidade do vídeo
...
```

## 🎉 Benefícios

### Para Usuários
- ✅ Compartilhamento rápido (1 clique)
- ✅ Análise automática completa
- ✅ Organização inteligente
- ✅ Busca por conteúdo

### Para Criadores
- ✅ Catalogar conteúdo do Instagram
- ✅ Analisar tendências
- ✅ Extrair insights
- ✅ Documentar tutoriais

## 📝 Notas

- A extensão respeita a privacidade do Instagram
- Apenas vídeos públicos são processados
- URLs são limpas automaticamente
- Thumbnails são carregados via proxy (CORS)

## 🚀 Próximas Melhorias

- [ ] Suporte para carrosséis (múltiplos vídeos)
- [ ] Download de legendas nativas do Instagram
- [ ] Detecção de hashtags
- [ ] Extração de menções (@)
- [ ] Análise de engajamento

## 📞 Suporte

Problemas ou sugestões? Abra uma issue no repositório!
