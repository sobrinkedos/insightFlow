// Script de teste para verificar se a extensão está funcionando
// Cole este código no Console do DevTools (F12) quando estiver no Instagram

console.log('=== TESTE DA EXTENSÃO INSIGHTSHARE ===\n');

// 1. Verificar se está no Instagram
const isInstagram = window.location.href.includes('instagram.com');
console.log('1. Está no Instagram?', isInstagram ? '✅' : '❌');

if (!isInstagram) {
  console.log('⚠️ Abra uma página do Instagram primeiro!');
  console.log('Exemplo: https://www.instagram.com/reel/DPwSPPPEVxw/');
}

// 2. Verificar se o botão existe
const button = document.getElementById('insightshare-btn');
console.log('2. Botão existe?', button ? '✅' : '❌');

if (!button) {
  console.log('⚠️ Botão não encontrado. Possíveis causas:');
  console.log('   - Extensão não está instalada');
  console.log('   - Extensão não foi recarregada');
  console.log('   - Content script não foi injetado');
}

// 3. Verificar URL atual
const currentUrl = window.location.href;
console.log('3. URL atual:', currentUrl);

// 4. Testar extração de informações
const urlMatch = currentUrl.match(/(https:\/\/www\.instagram\.com\/(?:p|reel|tv)\/[^\/\?]+)/);
console.log('4. URL limpa:', urlMatch ? urlMatch[1] + '/' : '❌ Não é um Reel/Post');

// 5. Verificar meta tags
const ogTitle = document.querySelector('meta[property="og:title"]')?.content;
const ogImage = document.querySelector('meta[property="og:image"]')?.content;
console.log('5. Meta OG Title:', ogTitle || '❌ Não encontrado');
console.log('6. Meta OG Image:', ogImage ? '✅ Encontrado' : '❌ Não encontrado');

// 7. Testar função getVideoInfo (se disponível)
if (typeof getVideoInfo === 'function') {
  console.log('7. Função getVideoInfo:', '✅ Disponível');
  const videoInfo = getVideoInfo();
  console.log('   Video Info:', videoInfo);
} else {
  console.log('7. Função getVideoInfo:', '❌ Não disponível');
  console.log('   Isso é normal se o content script não foi carregado');
}

// 8. Verificar se pode enviar mensagem para a extensão
if (typeof chrome !== 'undefined' && chrome.runtime) {
  console.log('8. Chrome Runtime:', '✅ Disponível');
  
  // Tentar obter informações do vídeo
  chrome.runtime.sendMessage({action: 'getVideoInfo'}, (response) => {
    if (chrome.runtime.lastError) {
      console.log('   Erro:', chrome.runtime.lastError.message);
    } else {
      console.log('   Resposta:', response);
    }
  });
} else {
  console.log('8. Chrome Runtime:', '❌ Não disponível');
}

// 9. Resumo
console.log('\n=== RESUMO ===');
if (button && isInstagram) {
  console.log('✅ Extensão funcionando corretamente!');
  console.log('Clique no botão 🎬 para compartilhar o vídeo.');
} else if (!isInstagram) {
  console.log('⚠️ Abra uma página do Instagram (Reel ou Post)');
} else {
  console.log('❌ Extensão não está funcionando');
  console.log('\nPara corrigir:');
  console.log('1. Vá para chrome://extensions/');
  console.log('2. Encontre "InsightShare"');
  console.log('3. Clique em "Recarregar" (🔄)');
  console.log('4. Volte aqui e pressione F5');
  console.log('5. Execute este teste novamente');
}

console.log('\n=== FIM DO TESTE ===');
