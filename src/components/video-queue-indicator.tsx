import { useVideoQueue } from '@/hooks/use-video-queue';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function VideoQueueIndicator() {
  const { queueItems, loading, processingCount, pendingCount } = useVideoQueue();

  if (loading || queueItems.length === 0) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="mb-6"
    >
      <Card className="border-primary/30 bg-primary/5">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Loader2 className="h-5 w-5 text-primary animate-spin" />
              <CardTitle className="text-lg">Fila de Processamento</CardTitle>
            </div>
            <div className="flex gap-2">
              {processingCount > 0 && (
                <Badge variant="default" className="gap-1">
                  <Loader2 className="h-3 w-3 animate-spin" />
                  {processingCount} processando
                </Badge>
              )}
              {pendingCount > 0 && (
                <Badge variant="secondary" className="gap-1">
                  <Clock className="h-3 w-3" />
                  {pendingCount} na fila
                </Badge>
              )}
            </div>
          </div>
          <CardDescription>
            Seus vídeos estão sendo processados sequencialmente para garantir qualidade
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <AnimatePresence mode="popLayout">
              {queueItems.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-center gap-3 p-3 rounded-lg bg-background/50 border border-border/50"
                >
                  <div className="flex-shrink-0">
                    {item.status === 'processing' ? (
                      <Loader2 className="h-5 w-5 text-primary animate-spin" />
                    ) : item.status === 'pending' ? (
                      <Clock className="h-5 w-5 text-muted-foreground" />
                    ) : item.status === 'completed' ? (
                      <CheckCircle2 className="h-5 w-5 text-green-500" />
                    ) : (
                      <AlertCircle className="h-5 w-5 text-red-500" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">
                        {item.status === 'processing' ? 'Processando agora...' : 
                         item.status === 'pending' ? `Posição ${item.position || index + 1} na fila ${item.platform === 'youtube' ? '(YouTube)' : item.platform === 'instagram' ? '(Instagram)' : ''}` :
                         item.status === 'completed' ? 'Concluído' :
                         'Falha no processamento'}
                      </span>
                      {item.platform && (
                        <Badge variant="secondary" className="text-xs">
                          {item.platform === 'youtube' ? '▶️ YouTube' : 
                           item.platform === 'instagram' ? '📸 Instagram' : 
                           '🎥 Outro'}
                        </Badge>
                      )}
                      {item.attempts > 1 && (
                        <Badge variant="outline" className="text-xs">
                          Tentativa {item.attempts}/{item.max_attempts}
                        </Badge>
                      )}
                    </div>
                    {item.error_message && (
                      <p className="text-xs text-red-400 mt-1 truncate">
                        {item.error_message}
                      </p>
                    )}
                  </div>
                  <div className="flex-shrink-0">
                    <Badge 
                      variant={
                        item.status === 'processing' ? 'default' :
                        item.status === 'pending' ? 'secondary' :
                        item.status === 'completed' ? 'outline' :
                        'destructive'
                      }
                      className="text-xs"
                    >
                      {item.status === 'processing' ? 'Em andamento' :
                       item.status === 'pending' ? 'Aguardando' :
                       item.status === 'completed' ? 'Pronto' :
                       'Erro'}
                    </Badge>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
