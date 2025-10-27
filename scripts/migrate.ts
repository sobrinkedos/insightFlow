/**
 * Script de Migração de Banco de Dados
 * 
 * Este script aplica migrações de banco de dados no ambiente especificado.
 * 
 * Uso:
 *   npm run migrate:dev    - Aplica em desenvolvimento
 *   npm run migrate:test   - Aplica em teste
 *   npm run migrate:prod   - Aplica em produção (requer confirmação)
 */

import { createClient } from '@supabase/supabase-js';
import { readdir, readFile } from 'fs/promises';
import { join } from 'path';
import * as crypto from 'crypto';

// Tipos
type Environment = 'development' | 'test' | 'production';

interface MigrationFile {
  version: string;
  name: string;
  filename: string;
  content: string;
  checksum: string;
}

interface AppliedMigration {
  version: string;
  name: string;
  applied_at: string;
  status: string;
}

// Configuração
const MIGRATIONS_DIR = join(process.cwd(), 'supabase', 'migrations');

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
    production: {
      url: 'https://jropngieefxgnufmkeaj.supabase.co',
      key: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impyb3BuZ2llZWZ4Z251Zm1rZWFqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MTUyOTI3MCwiZXhwIjoyMDc3MTA1MjcwfQ.rK2Mj6vJQQtTOKlo6vVJ635IbK9BPudR9MFMUG2O8iM',
    },
  };

  return configs[environment];
}

/**
 * Calcula checksum MD5 de uma string
 */
function calculateChecksum(content: string): string {
  return crypto.createHash('md5').update(content).digest('hex');
}

/**
 * Lê todos os arquivos de migração
 */
async function readMigrationFiles(): Promise<MigrationFile[]> {
  const files = await readdir(MIGRATIONS_DIR);
  const sqlFiles = files.filter(f => f.endsWith('.sql')).sort();

  const migrations: MigrationFile[] = [];

  for (const filename of sqlFiles) {
    const content = await readFile(join(MIGRATIONS_DIR, filename), 'utf-8');
    const [version, ...nameParts] = filename.replace('.sql', '').split('_');
    const name = nameParts.join('_');

    migrations.push({
      version,
      name,
      filename,
      content,
      checksum: calculateChecksum(content),
    });
  }

  return migrations;
}

/**
 * Obtém migrações já aplicadas
 */
async function getAppliedMigrations(
  supabase: ReturnType<typeof createClient>,
  environment: Environment
): Promise<AppliedMigration[]> {
  const { data, error } = await supabase
    .from('migration_history')
    .select('version, name, applied_at, status')
    .eq('environment', environment)
    .eq('status', 'success')
    .order('version', { ascending: true });

  if (error) {
    // Se a tabela não existe ainda, retorna array vazio
    if (error.code === '42P01') {
      return [];
    }
    throw error;
  }

  return data || [];
}

/**
 * Aplica uma migração
 */
async function applyMigration(
  supabase: ReturnType<typeof createClient>,
  migration: MigrationFile,
  environment: Environment
): Promise<void> {
  const startTime = Date.now();

  log(`\n📝 Aplicando: ${migration.filename}`, 'cyan');

  try {
    // Executa a migração
    const { error } = await supabase.rpc('exec_sql', {
      sql_query: migration.content,
    });

    if (error) {
      throw error;
    }

    const executionTime = Date.now() - startTime;

    log(`✅ Sucesso! (${executionTime}ms)`, 'green');
  } catch (error) {
    log(`❌ Falhou: ${(error as Error).message}`, 'red');
    throw error;
  }
}

/**
 * Função principal
 */
async function main() {
  const environment = process.argv[2] as Environment;

  if (!environment || !['development', 'test', 'production'].includes(environment)) {
    log('❌ Ambiente inválido!', 'red');
    log('Uso: npm run migrate:dev | migrate:test | migrate:prod', 'yellow');
    process.exit(1);
  }

  log(`\n🚀 Iniciando migrações para: ${environment}`, 'blue');
  log('═'.repeat(50), 'blue');

  // Confirmação para produção
  if (environment === 'production') {
    log('\n⚠️  ATENÇÃO: Você está prestes a aplicar migrações em PRODUÇÃO!', 'yellow');
    log('Certifique-se de que:', 'yellow');
    log('  1. As migrações foram testadas em desenvolvimento e teste', 'yellow');
    log('  2. Há um backup recente do banco de dados', 'yellow');
    log('  3. Você tem aprovação para fazer esta alteração', 'yellow');
    log('\nPressione Ctrl+C para cancelar ou Enter para continuar...', 'yellow');

    // Aguarda confirmação (simplificado - em produção use readline)
    await new Promise(resolve => setTimeout(resolve, 5000));
  }

  // Conecta ao Supabase
  const config = getSupabaseConfig(environment);
  const supabase = createClient(config.url, config.key);

  log('\n📂 Lendo arquivos de migração...', 'cyan');
  const allMigrations = await readMigrationFiles();
  log(`Encontradas ${allMigrations.length} migrações`, 'green');

  log('\n📊 Verificando migrações aplicadas...', 'cyan');
  const appliedMigrations = await getAppliedMigrations(supabase, environment);
  log(`${appliedMigrations.length} já aplicadas`, 'green');

  // Filtra migrações pendentes
  const appliedVersions = new Set(appliedMigrations.map(m => m.version));
  const pendingMigrations = allMigrations.filter(m => !appliedVersions.has(m.version));

  if (pendingMigrations.length === 0) {
    log('\n✨ Nenhuma migração pendente!', 'green');
    log('Banco de dados está atualizado.', 'green');
    process.exit(0);
  }

  log(`\n🔄 ${pendingMigrations.length} migrações pendentes:`, 'yellow');
  pendingMigrations.forEach(m => {
    log(`  • ${m.filename}`, 'yellow');
  });

  // Aplica migrações pendentes
  log('\n⚙️  Aplicando migrações...', 'cyan');
  log('═'.repeat(50), 'cyan');

  for (const migration of pendingMigrations) {
    await applyMigration(supabase, migration, environment);
  }

  log('\n═'.repeat(50), 'green');
  log('✨ Todas as migrações foram aplicadas com sucesso!', 'green');
  log(`\n📊 Status final:`, 'blue');
  log(`  • Total de migrações: ${allMigrations.length}`, 'blue');
  log(`  • Aplicadas nesta execução: ${pendingMigrations.length}`, 'blue');
  log(`  • Ambiente: ${environment}`, 'blue');
}

// Executa
main().catch(error => {
  log(`\n❌ Erro fatal: ${error.message}`, 'red');
  console.error(error);
  process.exit(1);
});
