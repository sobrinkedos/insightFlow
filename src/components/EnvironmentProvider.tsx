/**
 * Provider de Configuração de Ambiente
 * 
 * Este componente garante que a configuração de ambiente seja
 * carregada e validada antes de renderizar a aplicação.
 */

import { ReactNode, useEffect, useState } from 'react';
import { loadEnvironmentConfig } from '../../config/environment.config';
import type { EnvironmentConfig } from '../../config/environment.config';

interface EnvironmentProviderProps {
  children: ReactNode;
}

interface EnvironmentError {
  message: string;
  details?: string;
}

export function EnvironmentProvider({ children }: EnvironmentProviderProps) {
  const [config, setConfig] = useState<EnvironmentConfig | null>(null);
  const [error, setError] = useState<EnvironmentError | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const loadedConfig = loadEnvironmentConfig();
      setConfig(loadedConfig);
      setError(null);
    } catch (err) {
      const error = err as Error;
      setError({
        message: 'Erro ao carregar configuração de ambiente',
        details: error.message,
      });
      console.error('Erro de configuração:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Tela de carregamento
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando configurações...</p>
        </div>
      </div>
    );
  }

  // Tela de erro
  if (error || !config) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background p-4">
        <div className="max-w-2xl w-full bg-destructive/10 border border-destructive rounded-lg p-6">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              <svg
                className="h-6 w-6 text-destructive"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-semibold text-destructive mb-2">
                {error?.message || 'Erro de Configuração'}
              </h2>
              {error?.details && (
                <div className="bg-background/50 rounded p-4 mb-4">
                  <pre className="text-sm text-foreground whitespace-pre-wrap font-mono">
                    {error.details}
                  </pre>
                </div>
              )}
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>Para resolver este problema:</p>
                <ol className="list-decimal list-inside space-y-1 ml-2">
                  <li>Verifique se o arquivo <code className="bg-background px-1 rounded">.env.local</code> existe na raiz do projeto</li>
                  <li>Confirme que todas as variáveis obrigatórias estão configuradas</li>
                  <li>Verifique se as credenciais do Supabase estão corretas</li>
                  <li>Consulte a documentação em <code className="bg-background px-1 rounded">config/README.md</code></li>
                </ol>
              </div>
              <div className="mt-4 pt-4 border-t border-destructive/20">
                <button
                  onClick={() => window.location.reload()}
                  className="px-4 py-2 bg-destructive text-destructive-foreground rounded hover:bg-destructive/90 transition-colors"
                >
                  Tentar Novamente
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Renderiza a aplicação se tudo estiver OK
  return <>{children}</>;
}
