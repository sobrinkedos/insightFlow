import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/auth-context';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function DebugVideoProgress() {
  const { user } = useAuth();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      setLoading(true);
      
      // Query 1: Contar total de registros
      const { count, error: countError } = await supabase
        .from('video_progress')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id);

      // Query 2: Buscar últimos 5 registros
      const { data: progressData, error: progressError } = await supabase
        .from('video_progress')
        .select(`
          id,
          video_id,
          watched_time,
          last_watched_at,
          videos (
            id,
            title,
            channel
          )
        `)
        .eq('user_id', user.id)
        .order('last_watched_at', { ascending: false })
        .limit(5);

      setData({
        count,
        countError,
        progressData,
        progressError,
        timestamp: new Date().toISOString()
      });
      
      setLoading(false);
    };

    fetchData();

    // Subscription para atualizações em tempo real
    const channel = supabase
      .channel('debug-progress')
      .on(
        'postgres_changes',
        { 
          event: '*', 
          schema: 'public', 
          table: 'video_progress',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          console.log('🔔 Mudança detectada em video_progress:', payload);
          fetchData();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  if (!user) return null;

  return (
    <Card className="mb-8 border-yellow-500/50 bg-yellow-500/5">
      <CardHeader>
        <CardTitle className="text-yellow-500">🐛 Debug: Video Progress</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <p>Carregando...</p>
        ) : (
          <div className="space-y-4">
            <div>
              <strong>Total de registros:</strong> {data?.count ?? 'N/A'}
              {data?.countError && (
                <p className="text-red-500 text-sm">Erro: {data.countError.message}</p>
              )}
            </div>

            <div>
              <strong>Últimos 5 registros:</strong>
              {data?.progressError && (
                <p className="text-red-500 text-sm">Erro: {data.progressError.message}</p>
              )}
              {data?.progressData && data.progressData.length > 0 ? (
                <ul className="mt-2 space-y-2">
                  {data.progressData.map((item: any) => (
                    <li key={item.id} className="text-sm bg-background/50 p-2 rounded">
                      <div><strong>Video ID:</strong> {item.video_id}</div>
                      <div><strong>Título:</strong> {item.videos?.title || 'N/A'}</div>
                      <div><strong>Tempo:</strong> {Math.floor(item.watched_time)}s</div>
                      <div><strong>Última vez:</strong> {new Date(item.last_watched_at).toLocaleString()}</div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-muted-foreground mt-2">Nenhum registro encontrado</p>
              )}
            </div>

            <div className="text-xs text-muted-foreground">
              Última atualização: {data?.timestamp ? new Date(data.timestamp).toLocaleTimeString() : 'N/A'}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
