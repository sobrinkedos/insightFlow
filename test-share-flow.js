// Script para testar o fluxo de compartilhamento de vídeos
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://enkpfnqsjjnanlqhjnsv.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVua3BmbnFzampuYW5scWhqbnN2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA1NjcyODAsImV4cCI6MjA3NjE0MzI4MH0.WwYOmV_jXBsrZ74GWw9xuSzRC1vf1k39DAHjY1EI1hE';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testShareFlow() {
  console.log('🧪 Testando fluxo de compartilhamento...\n');

  // 1. Verificar vídeos recentes
  console.log('📊 Buscando vídeos recentes...');
  const { data: videos, error: videosError } = await supabase
    .from('videos')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(5);

  if (videosError) {
    console.error('❌ Erro ao buscar vídeos:', videosError);
    return;
  }

  console.log(`✅ Encontrados ${videos?.length || 0} vídeos recentes:\n`);
  
  videos?.forEach((video, index) => {
    console.log(`${index + 1}. ID: ${video.id}`);
    console.log(`   URL: ${video.url}`);
    console.log(`   Status: ${video.status}`);
    console.log(`   Título: ${video.title || 'N/A'}`);
    console.log(`   Resumo: ${video.summary_short ? video.summary_short.substring(0, 50) + '...' : 'N/A'}`);
    console.log(`   Criado em: ${video.created_at}`);
    console.log(`   Processado em: ${video.processed_at || 'N/A'}`);
    console.log('');
  });

  // 2. Verificar se há vídeos "Concluído" sem dados
  const videosWithoutData = videos?.filter(v => 
    v.status === 'Concluído' && (!v.title || !v.summary_short)
  );

  if (videosWithoutData && videosWithoutData.length > 0) {
    console.log(`⚠️ Encontrados ${videosWithoutData.length} vídeos marcados como "Concluído" mas sem dados processados:`);
    videosWithoutData.forEach(v => {
      console.log(`   - ID: ${v.id}, URL: ${v.url}`);
    });
    console.log('');
  }

  // 3. Testar chamada à edge function com um vídeo existente
  if (videos && videos.length > 0) {
    const testVideo = videos[0];
    console.log(`🧪 Testando edge function com vídeo ID: ${testVideo.id}`);
    
    const { data, error } = await supabase.functions.invoke('process-video', {
      body: { video_id: testVideo.id }
    });

    if (error) {
      console.error('❌ Erro ao chamar edge function:', error);
    } else {
      console.log('✅ Edge function chamada com sucesso:', data);
    }
  }
}

testShareFlow().catch(console.error);
