# 📦 Empacotamento para Microsoft Edge

## Método 1: Carregar Desempacotado (Desenvolvimento)

### Passo a Passo:
1. Abra o Edge e vá para `edge://extensions/`
2. Ative o **"Modo de desenvolvedor"** (canto inferior esquerdo)
3. Clique em **"Carregar sem compactação"**
4. Selecione a pasta `browser-extension`
5. A extensão será instalada!

✅ **Mais Rápido** - Ideal para desenvolvimento e testes

## Método 2: Criar Pacote ZIP (Distribuição Simples)

### Já Criado!
O arquivo `insightshare-edge.zip` já está pronto em `public/downloads/`

### Para Recriar:
```bash
npm run build:extensions
```

### Como Instalar o ZIP:
1. Baixe `insightshare-edge.zip`
2. Extraia para uma pasta
3. Siga os passos do Método 1

## Método 3: Criar Pacote APPX/MSIX (Loja Microsoft)

### Pré-requisitos:
- Windows 10/11
- Visual Studio 2019+ ou Windows SDK
- Certificado de desenvolvedor

### Passos:

#### 1. Preparar Arquivos
```powershell
# Criar estrutura
mkdir edge-package
mkdir edge-package/Extension
Copy-Item browser-extension/* edge-package/Extension/ -Recurse
Copy-Item browser-extension/AppxManifest.xml edge-package/
```

#### 2. Criar Certificado (Desenvolvimento)
```powershell
# Abrir PowerShell como Administrador
New-SelfSignedCertificate -Type Custom -Subject "CN=InsightShare" -KeyUsage DigitalSignature -FriendlyName "InsightShare Dev Certificate" -CertStoreLocation "Cert:\CurrentUser\My" -TextExtension @("2.5.29.37={text}1.3.6.1.5.5.7.3.3", "2.5.29.19={text}")
```

#### 3. Empacotar com MakeAppx
```powershell
# Localizar MakeAppx.exe (geralmente em):
# C:\Program Files (x86)\Windows Kits\10\bin\10.0.xxxxx.0\x64\

cd edge-package
& "C:\Program Files (x86)\Windows Kits\10\bin\10.0.22621.0\x64\makeappx.exe" pack /d . /p InsightShare.msix
```

#### 4. Assinar o Pacote
```powershell
# Localizar SignTool.exe
& "C:\Program Files (x86)\Windows Kits\10\bin\10.0.22621.0\x64\signtool.exe" sign /fd SHA256 /a /f MeuCertificado.pfx /p SenhaDosCertificado InsightShare.msix
```

#### 5. Instalar o Pacote
```powershell
Add-AppxPackage InsightShare.msix
```

## Método 4: Publicar na Microsoft Edge Add-ons

### Pré-requisitos:
- Conta de desenvolvedor Microsoft (gratuita)
- Extensão testada e funcionando

### Passos:

1. **Registrar-se**
   - Acesse: https://partner.microsoft.com/dashboard/microsoftedge
   - Crie uma conta de desenvolvedor

2. **Preparar Pacote**
   - Use o ZIP criado: `insightshare-edge.zip`
   - Ou crie um novo com `npm run build:extensions`

3. **Enviar**
   - Clique em "Criar novo envio"
   - Faça upload do ZIP
   - Preencha informações:
     - Nome: InsightShare - Compartilhar Vídeos
     - Descrição curta
     - Descrição detalhada
     - Categoria: Produtividade
     - Screenshots (1280x800)
     - Ícone (128x128)

4. **Revisão**
   - Aguarde 1-2 dias para revisão
   - Responda a quaisquer questões
   - Após aprovação, estará disponível na loja!

## 🔧 Ferramentas Úteis

### Edge Extension Toolkit
```bash
npm install -g edge-extension-toolkit
edge-extension-toolkit pack browser-extension
```

### Validar Manifest
```bash
edge-extension-toolkit validate browser-extension/manifest-edge.json
```

## 📝 Checklist Antes de Empacotar

- [ ] Todos os ícones criados (16, 32, 48, 128)
- [ ] Manifest.json correto
- [ ] Testado localmente
- [ ] Versão atualizada
- [ ] Screenshots preparados
- [ ] Descrição escrita
- [ ] Política de privacidade pronta

## 🐛 Solução de Problemas

### Erro: "Manifest inválido"
- Verifique se está usando `manifest-edge.json`
- Valide o JSON em jsonlint.com

### Erro: "Certificado não confiável"
- Instale o certificado no Windows
- Use certificado de desenvolvedor válido

### Erro: "Pacote não instalado"
- Verifique se o modo de desenvolvedor está ativo
- Tente reinstalar o certificado

## 📚 Recursos

- [Documentação Edge Extensions](https://docs.microsoft.com/microsoft-edge/extensions-chromium/)
- [Partner Center](https://partner.microsoft.com/dashboard/microsoftedge)
- [Políticas da Loja](https://docs.microsoft.com/microsoft-edge/extensions-chromium/store-policies/developer-policies)

## 💡 Dicas

1. **Para Desenvolvimento**: Use Método 1 (mais rápido)
2. **Para Compartilhar**: Use Método 2 (ZIP)
3. **Para Distribuição**: Use Método 4 (Loja)
4. **Para Empresas**: Use Método 3 (APPX/MSIX)

## 🎯 Recomendação

Para a maioria dos usuários, recomendamos:
1. Baixar o ZIP de `public/downloads/insightshare-edge.zip`
2. Extrair
3. Carregar desempacotado no Edge

É simples, rápido e funciona perfeitamente!
