import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://enkpfnqsjjnanlqhjnsv.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVua3BmbnFzampuYW5scWhqbnN2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA1NjcyODAsImV4cCI6MjA3NjE0MzI4MH0.WwYOmV_jXBsrZ74GWw9xuSzRC1vf1k39DAHjY1EI1hE';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testProcessVideo() {
  console.log('Testando process-video...');
  
  const { data, error } = await supabase.functions.invoke('process-video', {
    body: { video_id: '5f690136-350f-4a78-86d3-a5aa9ca2361d' },
  });

  if (error) {
    console.error('Erro:', error);
  } else {
    console.log('Sucesso:', data);
  }

  // Verificar o vídeo processado
  const { data: video } = await supabase
    .from('videos')
    .select('*')
    .eq('id', '5f690136-350f-4a78-86d3-a5aa9ca2361d')
    .single();

  console.log('\nVídeo processado:');
  console.log('Título:', video?.title);
  console.log('Canal:', video?.channel);
  console.log('Status:', video?.status);
  console.log('Tem transcrição:', !!video?.transcription);
  console.log('Tem resumo:', !!video?.summary_short);
}

testProcessVideo();
