import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/contexts/auth-context';

export function SharePage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, loading } = useAuth();

  useEffect(() => {
    // Aguardar o carregamento da autenticação
    if (loading) {
      return;
    }

    const url = searchParams.get('url');
    const title = searchParams.get('title');
    const text = searchParams.get('text');

    // Salvar dados do share SEMPRE (antes de verificar login)
    // Isso garante que não perdemos os dados ao redirecionar
    if (url) {
      const shareData = {
        url,
        title: title || '',
        text: text || '',
        timestamp: Date.now(),
      };
      
      // Usar sessionStorage para dados temporários do share
      sessionStorage.setItem('pendingShare', JSON.stringify(shareData));
      console.log('📱 Share data saved:', shareData);
    }

    // Se não estiver logado, redireciona para login
    if (!user) {
      console.log('🔒 User not logged in, redirecting to login...');
      // Redirecionar para login sem parâmetros na URL (mais limpo)
      navigate('/login', { replace: true });
      return;
    }

    // Se estiver logado e tiver URL, processar o share
    if (url) {
      console.log('✅ User logged in, processing share...');
      console.log('📱 Saving to localStorage:', { url, title });
      
      // Armazena a URL no localStorage para ser usada na página de vídeos
      localStorage.setItem('sharedVideoUrl', url);
      if (title) {
        localStorage.setItem('sharedVideoTitle', title);
      }
      
      // Verificar se foi salvo
      const savedUrl = localStorage.getItem('sharedVideoUrl');
      console.log('✅ Verified localStorage:', savedUrl);
      
      // Limpar dados temporários
      sessionStorage.removeItem('pendingShare');
      
      console.log('🔄 Navigating to /videos...');
      navigate('/videos', { replace: true });
    } else {
      console.log('⚠️ No URL in share params, going to videos anyway');
      // Se não tiver URL, vai direto para vídeos
      navigate('/videos', { replace: true });
    }
  }, [searchParams, user, loading, navigate]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <div className="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent"></div>
        <p className="text-muted-foreground">
          {loading ? 'Verificando autenticação...' : 'Processando compartilhamento...'}
        </p>
      </div>
    </div>
  );
}
