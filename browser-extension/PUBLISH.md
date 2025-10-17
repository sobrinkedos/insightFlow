# 📦 Guia de Publicação

Como publicar a extensão InsightShare nas lojas oficiais de cada navegador.

## 🌐 Chrome Web Store

### Pré-requisitos
- Conta de desenvolvedor Google ($5 taxa única)
- Ícones em alta resolução
- Screenshots da extensão
- Descrição detalhada

### Passos
1. Acesse: https://chrome.google.com/webstore/devconsole
2. Crie uma conta de desenvolvedor
3. Clique em "Novo item"
4. Faça upload do arquivo ZIP da extensão
5. Preencha:
   - Nome: InsightShare - Compartilhar Vídeos
   - Descrição curta
   - Descrição detalhada
   - Categoria: Produtividade
   - Screenshots (1280x800)
   - Ícone da loja (128x128)
6. Configure privacidade e permissões
7. Envie para revisão (1-3 dias)

### Criar ZIP
```cmd
cd browser-extension
powershell Compress-Archive -Path * -DestinationPath insightshare-chrome.zip
```

## 🌐 Microsoft Edge Add-ons

### Pré-requisitos
- Conta Microsoft (gratuita)
- Mesmos requisitos do Chrome

### Passos
1. Acesse: https://partner.microsoft.com/dashboard/microsoftedge
2. Registre-se como desenvolvedor (gratuito)
3. Clique em "Criar novo envio"
4. Faça upload do ZIP (mesmo do Chrome)
5. Preencha informações similares
6. Envie para revisão (1-2 dias)

**Dica**: Edge aceita extensões do Chrome com poucas modificações!

## 🦊 Firefox Add-ons

### Pré-requisitos
- Conta Firefox (gratuita)
- Extensão assinada

### Passos
1. Acesse: https://addons.mozilla.org/developers/
2. Crie uma conta
3. Clique em "Enviar novo complemento"
4. Escolha "No AMO" (listado) ou "Self-distributed"
5. Faça upload do ZIP
6. Preencha informações
7. Aguarde revisão (3-7 dias)

### Criar ZIP para Firefox
```cmd
cd browser-extension
copy manifest-firefox.json manifest.json
copy popup-firefox.html popup.html
copy popup-firefox.js popup.js
powershell Compress-Archive -Path * -DestinationPath insightshare-firefox.zip
```

## 📋 Checklist Antes de Publicar

### Código
- [ ] Todos os ícones criados (16, 32, 48, 128)
- [ ] Manifest.json correto para cada navegador
- [ ] Sem erros no console
- [ ] Testado em todas as plataformas suportadas
- [ ] Código minificado (opcional)

### Conteúdo
- [ ] Nome claro e descritivo
- [ ] Descrição detalhada (português e inglês)
- [ ] Screenshots de qualidade
- [ ] Vídeo demo (opcional, mas recomendado)
- [ ] Política de privacidade
- [ ] Termos de uso

### Legal
- [ ] Permissões justificadas
- [ ] Política de privacidade publicada
- [ ] Conformidade com LGPD/GDPR
- [ ] Sem violação de marcas registradas

## 📸 Screenshots Recomendados

1. **Popup da extensão** (360x400)
2. **Botão flutuante no YouTube** (1280x800)
3. **Vídeo sendo compartilhado** (1280x800)
4. **Dashboard do InsightShare** (1280x800)
5. **Configurações** (360x400)

## 📝 Descrição Sugerida

### Curta (132 caracteres)
```
Compartilhe vídeos do YouTube, Instagram e TikTok com IA. Transcrição e resumo automáticos.
```

### Detalhada
```
InsightShare é a extensão definitiva para compartilhar e organizar vídeos de forma inteligente.

🎯 RECURSOS PRINCIPAIS:
• Compartilhe vídeos com um clique
• Transcrição automática com IA
• Resumos inteligentes
• Organização por temas
• Suporte a múltiplas plataformas

🌐 PLATAFORMAS SUPORTADAS:
• YouTube
• Instagram
• TikTok
• Vimeo
• Dailymotion

🤖 INTELIGÊNCIA ARTIFICIAL:
• Transcrição automática
• Resumo curto e expandido
• Extração de palavras-chave
• Categorização inteligente
• Consolidação de temas

✨ COMO USAR:
1. Instale a extensão
2. Configure sua conta InsightShare
3. Navegue até um vídeo
4. Clique no botão flutuante 🎬
5. Pronto! O vídeo será processado automaticamente

🔒 PRIVACIDADE:
• Seus dados são seus
• Sem rastreamento
• Código aberto disponível

💡 PERFEITO PARA:
• Estudantes
• Pesquisadores
• Criadores de conteúdo
• Profissionais de marketing
• Qualquer pessoa que assiste muitos vídeos

🆓 GRATUITO E OPEN SOURCE
```

## 🔄 Atualizações

### Versionamento
Use Semantic Versioning (semver):
- `1.0.0` - Lançamento inicial
- `1.0.1` - Correção de bugs
- `1.1.0` - Novos recursos
- `2.0.0` - Mudanças incompatíveis

### Changelog
Mantenha um arquivo CHANGELOG.md:
```markdown
## [1.0.0] - 2025-10-16
### Adicionado
- Suporte inicial a YouTube, Instagram, TikTok
- Botão flutuante
- Menu de contexto
- Processamento com IA

### Corrigido
- N/A

### Alterado
- N/A
```

## 📊 Métricas Importantes

Após publicar, monitore:
- Número de instalações
- Avaliações e comentários
- Taxa de desinstalação
- Erros reportados
- Tempo de uso

## 🆘 Suporte

Crie canais de suporte:
- Email: support@insightshare.com
- GitHub Issues
- Discord/Telegram
- FAQ no site

## 💰 Monetização (Opcional)

Opções futuras:
- Versão premium com recursos extras
- Doações via Ko-fi/Patreon
- Patrocínios
- API paga para empresas

## ✅ Pós-Publicação

1. Anuncie nas redes sociais
2. Crie página no Product Hunt
3. Escreva artigo no Medium/Dev.to
4. Faça vídeo demo no YouTube
5. Responda todos os comentários
6. Corrija bugs rapidamente
7. Adicione recursos solicitados
