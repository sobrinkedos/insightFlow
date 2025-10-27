/**
 * Hook React para acessar configurações de ambiente
 * 
 * Este hook fornece acesso fácil às configurações de ambiente
 * em componentes React, com type-safety e validação automática.
 */

import { useEffect, useState } from 'react';
import type { EnvironmentConfig } from '../../config/environment.config';
import environmentManager from '../../config/environment.config';

/**
 * Hook para acessar configurações de ambiente
 * @returns Configuração do ambiente ou null se ainda não carregada
 */
export function useEnvironment() {
  const [config, setConfig] = useState<EnvironmentConfig | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const loadedConfig = environmentManager.loadConfig();
      setConfig(loadedConfig);
      setError(null);
      
      // Imprime info de debug apenas em desenvolvimento
      if (loadedConfig.isDevelopment) {
        environmentManager.printDebugInfo();
      }
    } catch (err) {
      setError(err as Error);
      console.error('Erro ao carregar configuração de ambiente:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    config,
    error,
    isLoading,
    isDevelopment: config?.isDevelopment ?? false,
    isTest: config?.isTest ?? false,
    isProduction: config?.isProduction ?? false,
  };
}

/**
 * Hook para acessar apenas a configuração do Supabase
 * @returns Configuração do Supabase ou null
 */
export function useSupabaseConfig() {
  const { config, isLoading, error } = useEnvironment();
  
  return {
    supabaseConfig: config?.supabase ?? null,
    isLoading,
    error,
  };
}

/**
 * Hook para verificar o ambiente atual
 * @returns Informações sobre o ambiente
 */
export function useEnvironmentCheck() {
  const { config, isLoading } = useEnvironment();
  
  return {
    environment: config?.environment ?? 'development',
    isDevelopment: config?.isDevelopment ?? false,
    isTest: config?.isTest ?? false,
    isProduction: config?.isProduction ?? false,
    isLoading,
  };
}
