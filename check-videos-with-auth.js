// Script para verificar vídeos com autenticação
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://enkpfnqsjjnanlqhjnsv.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVua3BmbnFzampuYW5scWhqbnN2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA1NjcyODAsImV4cCI6MjA3NjE0MzI4MH0.WwYOmV_jXBsrZ74GWw9xuSzRC1vf1k39DAHjY1EI1hE';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkVideos() {
  console.log('🔍 Verificando sessão atual...\n');
  
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session) {
    console.log('❌ Nenhuma sessão ativa encontrada.');
    console.log('💡 Você precisa estar logado para ver os vídeos.');
    console.log('💡 Faça login no aplicativo e tente novamente.\n');
    return;
  }
  
  console.log('✅ Sessão ativa encontrada:');
  console.log(`   User ID: ${session.user.id}`);
  console.log(`   Email: ${session.user.email}\n`);
  
  // Buscar vídeos do usuário logado
  console.log('📊 Buscando vídeos do usuário...');
  const { data: videos, error } = await supabase
    .from('videos')
    .select('*')
    .eq('user_id', session.user.id)
    .order('created_at', { ascending: false })
    .limit(10);
  
  if (error) {
    console.error('❌ Erro ao buscar vídeos:', error);
    return;
  }
  
  console.log(`✅ Encontrados ${videos?.length || 0} vídeos:\n`);
  
  videos?.forEach((video, index) => {
    console.log(`${index + 1}. ID: ${video.id}`);
    console.log(`   URL: ${video.url}`);
    console.log(`   Status: ${video.status}`);
    console.log(`   Título: ${video.title || 'N/A'}`);
    console.log(`   Resumo: ${video.summary_short ? video.summary_short.substring(0, 50) + '...' : 'N/A'}`);
    console.log(`   Criado em: ${new Date(video.created_at).toLocaleString('pt-BR')}`);
    console.log(`   Processado em: ${video.processed_at ? new Date(video.processed_at).toLocaleString('pt-BR') : 'N/A'}`);
    console.log('');
  });
  
  // Verificar vídeos "Concluído" sem dados
  const videosWithoutData = videos?.filter(v => 
    v.status === 'Concluído' && (!v.title || !v.summary_short)
  );
  
  if (videosWithoutData && videosWithoutData.length > 0) {
    console.log(`\n⚠️ PROBLEMA ENCONTRADO!`);
    console.log(`⚠️ ${videosWithoutData.length} vídeo(s) marcado(s) como "Concluído" mas sem dados processados:\n`);
    videosWithoutData.forEach(v => {
      console.log(`   - ID: ${v.id}`);
      console.log(`     URL: ${v.url}`);
      console.log(`     Criado em: ${new Date(v.created_at).toLocaleString('pt-BR')}`);
      console.log('');
    });
    
    console.log('💡 Isso indica que a edge function process-video não está processando corretamente.');
    console.log('💡 Possíveis causas:');
    console.log('   1. Variáveis de ambiente não configuradas no Supabase (OPENAI_API_KEY, RAPIDAPI_KEY)');
    console.log('   2. Erro na edge function que não está sendo capturado');
    console.log('   3. Timeout na execução da edge function');
  }
}

checkVideos().catch(console.error);
