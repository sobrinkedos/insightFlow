import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/contexts/auth-context';

export function SharePage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();

  useEffect(() => {
    const url = searchParams.get('url');
    const title = searchParams.get('title');
    const text = searchParams.get('text');

    // Se não estiver logado, redireciona para login com a URL como parâmetro
    if (!user) {
      const returnUrl = `/share?url=${encodeURIComponent(url || '')}&title=${encodeURIComponent(title || '')}&text=${encodeURIComponent(text || '')}`;
      navigate(`/login?returnUrl=${encodeURIComponent(returnUrl)}`);
      return;
    }

    // Se tiver URL, redireciona para a página de vídeos com a URL preenchida
    if (url) {
      // Armazena a URL no localStorage para ser usada na página de vídeos
      localStorage.setItem('sharedVideoUrl', url);
      if (title) {
        localStorage.setItem('sharedVideoTitle', title);
      }
      navigate('/videos');
    } else {
      // Se não tiver URL, vai direto para vídeos
      navigate('/videos');
    }
  }, [searchParams, user, navigate]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <div className="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent"></div>
        <p className="text-muted-foreground">Processando compartilhamento...</p>
      </div>
    </div>
  );
}
