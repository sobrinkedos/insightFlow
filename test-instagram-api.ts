// Script de teste para a API do Instagram via RapidAPI
// Execute com: deno run --allow-net --allow-env test-instagram-api.ts

const RAPIDAPI_KEY = "5b4ef30d7amsh604c58627ce5d90p18121bjsnbc0f5b169f67";
const RAPIDAPI_HOST = "instagram120.p.rapidapi.com";

async function testGetUserPosts(username: string) {
  console.log(`\n🔍 Testando busca de posts do usuário: ${username}`);
  console.log("=".repeat(60));

  try {
    const response = await fetch(`https://${RAPIDAPI_HOST}/api/instagram/posts`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-rapidapi-host": RAPIDAPI_HOST,
        "x-rapidapi-key": RAPIDAPI_KEY,
      },
      body: JSON.stringify({
        username,
        maxId: "",
      }),
    });

    console.log(`Status: ${response.status} ${response.statusText}`);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("❌ Erro:", errorText);
      return;
    }

    const data = await response.json();
    console.log("\n✅ Resposta recebida:");
    console.log(JSON.stringify(data, null, 2));

    if (data.data?.items) {
      console.log(`\n📊 Total de posts encontrados: ${data.data.items.length}`);
      
      // Mostrar detalhes do primeiro post
      if (data.data.items.length > 0) {
        const firstPost = data.data.items[0];
        console.log("\n📝 Primeiro post:");
        console.log(`  - ID: ${firstPost.id || 'N/A'}`);
        console.log(`  - Code: ${firstPost.code || 'N/A'}`);
        console.log(`  - Tipo: ${firstPost.media_type || 'N/A'}`);
        console.log(`  - Caption: ${firstPost.caption?.substring(0, 100) || 'N/A'}...`);
        console.log(`  - Likes: ${firstPost.like_count || 0}`);
        console.log(`  - Comentários: ${firstPost.comments_count || 0}`);
      }
    }
  } catch (error) {
    console.error("❌ Erro na requisição:", error);
  }
}

async function testOEmbedFallback(postUrl: string) {
  console.log(`\n🔍 Testando oEmbed fallback para: ${postUrl}`);
  console.log("=".repeat(60));

  try {
    const oembedUrl = `https://graph.facebook.com/v18.0/instagram_oembed?url=${encodeURIComponent(postUrl)}`;
    const response = await fetch(oembedUrl);

    console.log(`Status: ${response.status} ${response.statusText}`);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("❌ Erro:", errorText);
      return;
    }

    const data = await response.json();
    console.log("\n✅ Resposta oEmbed:");
    console.log(JSON.stringify(data, null, 2));
  } catch (error) {
    console.error("❌ Erro na requisição:", error);
  }
}

// Executar testes
async function runTests() {
  console.log("🚀 Iniciando testes da API do Instagram");
  console.log("=".repeat(60));

  // Teste 1: Buscar posts de um usuário
  await testGetUserPosts("keke");

  // Teste 2: Testar oEmbed fallback
  await testOEmbedFallback("https://www.instagram.com/p/C1234567890/");

  console.log("\n" + "=".repeat(60));
  console.log("✅ Testes concluídos!");
  console.log("\n💡 Dicas:");
  console.log("  - Se a API retornar 401/403, verifique a chave da API");
  console.log("  - Se retornar 429, você atingiu o rate limit");
  console.log("  - O oEmbed é público e não requer autenticação");
}

// Executar
runTests();
