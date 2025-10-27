/**
 * Script de Rollback de Migrações
 * 
 * Este script reverte a última migração aplicada no ambiente especificado.
 * 
 * Uso:
 *   npm run migrate:rollback:dev   - Rollback em desenvolvimento
 *   npm run migrate:rollback:test  - Rollback em teste
 * 
 * ⚠️ Rollback em produção requer backup prévio e não está disponível via script
 */

import { createClient } from '@supabase/supabase-js';

// Tipos
type Environment = 'development' | 'test';

interface Migration {
  id: string;
  version: string;
  name: string;
  applied_at: string;
  status: string;
}

// Cores para output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

function log(message: string, color: keyof typeof colors = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

/**
 * Obtém configuração do Supabase para o ambiente
 */
function getSupabaseConfig(environment: Environment) {
  const configs = {
    development: {
      url: 'https://enkpfnqsjjnanlqhjnsv.supabase.co',
      key: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVua3BmbnFzampuYW5scWhqbnN2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MDU2NzI4MCwiZXhwIjoyMDc2MTQzMjgwfQ.RTUbPMwgLTEayzYN1DITFO1s-Mg_k0vQMb-9QSnF9z4',
    },
    test: {
      url: 'https://bosxuteortfshfysoqrd.supabase.co',
      key: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJvc3h1dGVvcnRmc2hmeXNvcXJkIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MDQ4OTgzNCwiZXhwIjoyMDc2MDY1ODM0fQ.3_6W5Ny2sHW_S38nLByoN53sHJM80XIgvKavr-zbNaU',
    },
  };

  return configs[environment];
}

/**
 * Obtém a última migração aplicada
 */
async function getLastMigration(
  supabase: ReturnType<typeof createClient>,
  environment: Environment
): Promise<Migration | null> {
  const { data, error } = await supabase
    .from('migration_history')
    .select('id, version, name, applied_at, status')
    .eq('environment', environment)
    .eq('status', 'success')
    .order('applied_at', { ascending: false })
    .limit(1)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      // Nenhuma migração encontrada
      return null;
    }
    throw error;
  }

  return data;
}

/**
 * Verifica se há backup recente (para produção)
 */
async function checkRecentBackup(
  supabase: ReturnType<typeof createClient>
): Promise<boolean> {
  const { data, error } = await supabase
    .from('backup_history')
    .select('id, timestamp, status')
    .eq('source_environment', 'production')
    .eq('status', 'completed')
    .gte('timestamp', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
    .order('timestamp', { ascending: false })
    .limit(1);

  if (error) {
    return false;
  }

  return data && data.length > 0;
}

/**
 * Marca migração como rolled_back
 */
async function markAsRolledBack(
  supabase: ReturnType<typeof createClient>,
  migrationId: string
): Promise<void> {
  const { error } = await supabase
    .from('migration_history')
    .update({ status: 'rolled_back' })
    .eq('id', migrationId);

  if (error) {
    throw error;
  }
}

/**
 * Função principal
 */
async function main() {
  const environment = process.argv[2] as Environment;

  if (!environment || !['development', 'test'].includes(environment)) {
    log('❌ Ambiente inválido!', 'red');
    log('Uso: npm run migrate:rollback:dev | migrate:rollback:test', 'yellow');
    log('\n⚠️  Rollback em produção não está disponível via script', 'yellow');
    log('Para produção, use o processo manual com backup prévio', 'yellow');
    process.exit(1);
  }

  log(`\n🔄 Iniciando rollback para: ${environment}`, 'blue');
  log('═'.repeat(50), 'blue');

  // Conecta ao Supabase
  const config = getSupabaseConfig(environment);
  const supabase = createClient(config.url, config.key);

  // Obtém última migração
  log('\n📊 Verificando última migração...', 'cyan');
  const lastMigration = await getLastMigration(supabase, environment);

  if (!lastMigration) {
    log('✨ Nenhuma migração para reverter!', 'green');
    log('O banco de dados está no estado inicial.', 'green');
    process.exit(0);
  }

  log(`\nÚltima migração aplicada:`, 'yellow');
  log(`  • Versão: ${lastMigration.version}`, 'yellow');
  log(`  • Nome: ${lastMigration.name}`, 'yellow');
  log(`  • Aplicada em: ${new Date(lastMigration.applied_at).toLocaleString()}`, 'yellow');

  // Aviso
  log('\n⚠️  ATENÇÃO:', 'red');
  log('O rollback irá marcar esta migração como "rolled_back"', 'yellow');
  log('Você precisará reverter manualmente as mudanças no banco de dados', 'yellow');
  log('ou criar uma nova migração que desfaça as alterações.', 'yellow');

  log('\n💡 Recomendação:', 'cyan');
  log('1. Crie uma migração "reversa" que desfaça as mudanças', 'cyan');
  log('2. Aplique a nova migração normalmente', 'cyan');
  log('3. Isso mantém o histórico completo de mudanças', 'cyan');

  log('\n⏳ Aguardando 5 segundos...', 'yellow');
  log('Pressione Ctrl+C para cancelar', 'yellow');
  await new Promise(resolve => setTimeout(resolve, 5000));

  // Marca como rolled_back
  log('\n⚙️  Marcando migração como rolled_back...', 'cyan');
  await markAsRolledBack(supabase, lastMigration.id);
  log('✅ Migração marcada como rolled_back', 'green');

  log('\n═'.repeat(50), 'green');
  log('✨ Rollback concluído!', 'green');
  log('\n📝 Próximos passos:', 'blue');
  log('1. Crie uma migração reversa se necessário', 'blue');
  log('2. Ou reverta manualmente as mudanças no banco', 'blue');
  log('3. Verifique o histórico: SELECT * FROM migration_history;', 'blue');
}

// Executa
main().catch(error => {
  log(`\n❌ Erro fatal: ${error.message}`, 'red');
  console.error(error);
  process.exit(1);
});
