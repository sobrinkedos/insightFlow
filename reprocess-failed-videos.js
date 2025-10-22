// Script para reprocessar vídeos que falharam ou ficaram sem dados
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://enkpfnqsjjnanlqhjnsv.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVua3BmbnFzampuYW5scWhqbnN2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA1NjcyODAsImV4cCI6MjA3NjE0MzI4MH0.WwYOmV_jXBsrZ74GWw9xuSzRC1vf1k39DAHjY1EI1hE';

const supabase = createClient(supabaseUrl, supabaseKey);

async function reprocessFailedVideos() {
  console.log('🔄 Iniciando reprocessamento de vídeos...\n');
  
  // Verificar sessão
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session) {
    console.log('❌ Você precisa estar logado para reprocessar vídeos.');
    console.log('💡 Faça login no aplicativo e tente novamente.\n');
    return;
  }
  
  console.log('✅ Sessão ativa encontrada');
  console.log(`   User ID: ${session.user.id}\n`);
  
  // 1. Buscar vídeos "Concluído" sem dados processados
  console.log('🔍 Buscando vídeos "Concluído" sem dados...');
  const { data: videosWithoutData, error: error1 } = await supabase
    .from('videos')
    .select('*')
    .eq('user_id', session.user.id)
    .eq('status', 'Concluído')
    .or('title.is.null,summary_short.is.null');
  
  if (error1) {
    console.error('❌ Erro ao buscar vídeos:', error1);
    return;
  }
  
  console.log(`✅ Encontrados ${videosWithoutData?.length || 0} vídeos "Concluído" sem dados\n`);
  
  // 2. Buscar vídeos com status "Falha"
  console.log('🔍 Buscando vídeos com status "Falha"...');
  const { data: failedVideos, error: error2 } = await supabase
    .from('videos')
    .select('*')
    .eq('user_id', session.user.id)
    .eq('status', 'Falha');
  
  if (error2) {
    console.error('❌ Erro ao buscar vídeos:', error2);
    return;
  }
  
  console.log(`✅ Encontrados ${failedVideos?.length || 0} vídeos com status "Falha"\n`);
  
  // 3. Combinar todos os vídeos para reprocessar
  const allVideos = [...(videosWithoutData || []), ...(failedVideos || [])];
  
  if (allVideos.length === 0) {
    console.log('✅ Nenhum vídeo precisa ser reprocessado!');
    return;
  }
  
  console.log(`\n📊 Total de vídeos para reprocessar: ${allVideos.length}\n`);
  
  // 4. Reprocessar cada vídeo
  for (let i = 0; i < allVideos.length; i++) {
    const video = allVideos[i];
    console.log(`[${i + 1}/${allVideos.length}] Reprocessando vídeo:`);
    console.log(`   ID: ${video.id}`);
    console.log(`   URL: ${video.url}`);
    console.log(`   Status atual: ${video.status}`);
    
    // Marcar como "Processando"
    const { error: updateError } = await supabase
      .from('videos')
      .update({ 
        status: 'Processando',
        title: null,
        transcription: null,
        summary_short: null,
        summary_expanded: null,
        topics: null,
        keywords: null,
        category: null,
        subcategory: null,
        processed_at: null
      })
      .eq('id', video.id);
    
    if (updateError) {
      console.error(`   ❌ Erro ao atualizar status: ${updateError.message}`);
      continue;
    }
    
    // Chamar edge function
    const { data, error: functionError } = await supabase.functions.invoke('process-video', {
      body: { video_id: video.id }
    });
    
    if (functionError) {
      console.error(`   ❌ Erro ao chamar edge function: ${functionError.message}`);
    } else {
      console.log(`   ✅ Edge function chamada com sucesso`);
    }
    
    console.log('');
    
    // Aguardar 2 segundos entre cada vídeo para não sobrecarregar
    if (i < allVideos.length - 1) {
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }
  
  console.log('\n✅ Reprocessamento iniciado para todos os vídeos!');
  console.log('💡 Aguarde alguns minutos e recarregue a página de vídeos.');
  console.log('💡 Você pode verificar os logs no dashboard do Supabase:\n');
  console.log('   https://supabase.com/dashboard/project/enkpfnqsjjnanlqhjnsv/functions/process-video/logs\n');
}

reprocessFailedVideos().catch(console.error);
