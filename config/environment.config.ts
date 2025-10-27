/**
 * Gerenciador de Configuração de Ambientes
 * 
 * Este módulo gerencia as configurações de ambiente para o projeto,
 * garantindo que todas as variáveis necessárias estejam presentes
 * e validadas antes da inicialização da aplicação.
 */

// Tipos de ambiente suportados
export type Environment = 'development' | 'test' | 'production';

// Interface para configuração do Supabase
export interface SupabaseConfig {
  url: string;
  anonKey: string;
  serviceRoleKey?: string;
}

// Interface para configuração de backup
export interface BackupConfig {
  backupUrl: string;
  backupServiceKey: string;
  retentionDays: number;
}

// Interface principal de configuração de ambiente
export interface EnvironmentConfig {
  environment: Environment;
  supabase: SupabaseConfig;
  backupConfig?: BackupConfig;
  isDevelopment: boolean;
  isTest: boolean;
  isProduction: boolean;
}

// Variáveis de ambiente obrigatórias
const REQUIRED_ENV_VARS = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  'VITE_ENVIRONMENT',
] as const;

// Variáveis de ambiente opcionais
const OPTIONAL_ENV_VARS = [
  'SUPABASE_SERVICE_ROLE_KEY',
  'BACKUP_SUPABASE_URL',
  'BACKUP_SUPABASE_SERVICE_KEY',
] as const;

/**
 * Classe para gerenciar configurações de ambiente
 */
export class EnvironmentManager {
  private config: EnvironmentConfig | null = null;

  /**
   * Valida se todas as variáveis de ambiente obrigatórias estão presentes
   * @throws Error se alguma variável obrigatória estiver faltando
   */
  private validateRequiredVars(): void {
    const missing: string[] = [];

    for (const varName of REQUIRED_ENV_VARS) {
      if (!import.meta.env[varName]) {
        missing.push(varName);
      }
    }

    if (missing.length > 0) {
      throw new Error(
        `Variáveis de ambiente obrigatórias não encontradas: ${missing.join(', ')}\n` +
        `Por favor, configure estas variáveis no arquivo .env.local ou nas configurações do Vercel.`
      );
    }
  }

  /**
   * Valida o formato das URLs do Supabase
   * @param url URL a ser validada
   * @throws Error se a URL for inválida
   */
  private validateSupabaseUrl(url: string): void {
    if (!url.startsWith('https://') || !url.includes('.supabase.co')) {
      throw new Error(
        `URL do Supabase inválida: ${url}\n` +
        `A URL deve seguir o formato: https://[project-id].supabase.co`
      );
    }
  }

  /**
   * Valida o formato das chaves de API do Supabase
   * @param key Chave a ser validada
   * @param keyName Nome da chave para mensagens de erro
   * @throws Error se a chave for inválida
   */
  private validateSupabaseKey(key: string, keyName: string): void {
    // Chaves JWT do Supabase começam com "eyJ"
    if (!key.startsWith('eyJ')) {
      throw new Error(
        `${keyName} inválida: deve ser um token JWT válido do Supabase\n` +
        `Verifique se copiou a chave completa do dashboard do Supabase.`
      );
    }

    // Chaves JWT têm pelo menos 100 caracteres
    if (key.length < 100) {
      throw new Error(
        `${keyName} parece estar incompleta (muito curta)\n` +
        `Verifique se copiou a chave completa do dashboard do Supabase.`
      );
    }
  }

  /**
   * Detecta o ambiente atual baseado nas variáveis de ambiente
   * @returns O ambiente atual
   */
  private detectEnvironment(): Environment {
    const env = import.meta.env.VITE_ENVIRONMENT as string;
    
    if (env === 'production') return 'production';
    if (env === 'test') return 'test';
    return 'development';
  }

  /**
   * Carrega e valida a configuração do ambiente atual
   * @returns Configuração validada do ambiente
   * @throws Error se a configuração for inválida
   */
  public loadConfig(): EnvironmentConfig {
    // Se já carregou, retorna o cache
    if (this.config) {
      return this.config;
    }

    // Valida variáveis obrigatórias
    this.validateRequiredVars();

    // Obtém as variáveis
    const supabaseUrl = import.meta.env.NEXT_PUBLIC_SUPABASE_URL as string;
    const supabaseAnonKey = import.meta.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;
    const supabaseServiceKey = import.meta.env.SUPABASE_SERVICE_ROLE_KEY as string | undefined;

    // Valida formato das credenciais
    this.validateSupabaseUrl(supabaseUrl);
    this.validateSupabaseKey(supabaseAnonKey, 'NEXT_PUBLIC_SUPABASE_ANON_KEY');
    
    if (supabaseServiceKey) {
      this.validateSupabaseKey(supabaseServiceKey, 'SUPABASE_SERVICE_ROLE_KEY');
    }

    // Detecta ambiente
    const environment = this.detectEnvironment();

    // Monta configuração
    this.config = {
      environment,
      supabase: {
        url: supabaseUrl,
        anonKey: supabaseAnonKey,
        serviceRoleKey: supabaseServiceKey,
      },
      isDevelopment: environment === 'development',
      isTest: environment === 'test',
      isProduction: environment === 'production',
    };

    // Adiciona configuração de backup se disponível
    const backupUrl = import.meta.env.BACKUP_SUPABASE_URL as string | undefined;
    const backupServiceKey = import.meta.env.BACKUP_SUPABASE_SERVICE_KEY as string | undefined;

    if (backupUrl && backupServiceKey) {
      this.validateSupabaseUrl(backupUrl);
      this.validateSupabaseKey(backupServiceKey, 'BACKUP_SUPABASE_SERVICE_KEY');
      
      this.config.backupConfig = {
        backupUrl,
        backupServiceKey,
        retentionDays: 30, // Padrão: 30 dias
      };
    }

    return this.config;
  }

  /**
   * Obtém a configuração atual (deve chamar loadConfig primeiro)
   * @returns Configuração do ambiente ou null se não carregada
   */
  public getConfig(): EnvironmentConfig | null {
    return this.config;
  }

  /**
   * Verifica se está em ambiente de desenvolvimento
   */
  public isDevelopment(): boolean {
    return this.config?.isDevelopment ?? false;
  }

  /**
   * Verifica se está em ambiente de teste
   */
  public isTest(): boolean {
    return this.config?.isTest ?? false;
  }

  /**
   * Verifica se está em ambiente de produção
   */
  public isProduction(): boolean {
    return this.config?.isProduction ?? false;
  }

  /**
   * Imprime informações de debug sobre a configuração (apenas em dev)
   */
  public printDebugInfo(): void {
    if (!this.config || this.config.isProduction) {
      return;
    }

    console.group('🔧 Configuração de Ambiente');
    console.log('Ambiente:', this.config.environment);
    console.log('Supabase URL:', this.config.supabase.url);
    console.log('Anon Key:', this.config.supabase.anonKey.substring(0, 20) + '...');
    console.log('Service Role Key:', this.config.supabase.serviceRoleKey ? '✓ Configurada' : '✗ Não configurada');
    
    if (this.config.backupConfig) {
      console.log('Backup URL:', this.config.backupConfig.backupUrl);
      console.log('Backup Retention:', this.config.backupConfig.retentionDays, 'dias');
    }
    
    console.groupEnd();
  }
}

// Instância singleton do gerenciador
const environmentManager = new EnvironmentManager();

// Exporta a instância e funções auxiliares
export default environmentManager;

/**
 * Carrega e valida a configuração do ambiente
 * @returns Configuração validada
 */
export function loadEnvironmentConfig(): EnvironmentConfig {
  return environmentManager.loadConfig();
}

/**
 * Obtém a configuração atual
 * @returns Configuração ou null se não carregada
 */
export function getEnvironmentConfig(): EnvironmentConfig | null {
  return environmentManager.getConfig();
}

/**
 * Verifica se está em desenvolvimento
 */
export function isDevelopment(): boolean {
  return environmentManager.isDevelopment();
}

/**
 * Verifica se está em teste
 */
export function isTest(): boolean {
  return environmentManager.isTest();
}

/**
 * Verifica se está em produção
 */
export function isProduction(): boolean {
  return environmentManager.isProduction();
}
