/**
 * Script de Seed de Dados
 * 
 * Este script carrega dados de seed no ambiente especificado.
 * 
 * Uso:
 *   npm run seed:dev   - Carrega em desenvolvimento
 *   npm run seed:test  - Carrega em teste
 */

import { createClient } from '@supabase/supabase-js';
import { readFile } from 'fs/promises';
import { join } from 'path';

// Tipos
type Environment = 'development' | 'test';

// Configuração
const SEED_DIR = join(process.cwd(), 'supabase', 'seed');

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
 * Função principal
 */
async function main() {
  const environment = process.argv[2] as Environment;

  if (!environment || !['development', 'test'].includes(environment)) {
    log('❌ Ambiente inválido!', 'red');
    log('Uso: npm run seed:dev | seed:test', 'yellow');
    log('⚠️  Não há seed para produção (dados reais)', 'yellow');
    process.exit(1);
  }

  log(`\n🌱 Carregando seed data para: ${environment}`, 'blue');
  log('═'.repeat(50), 'blue');

  // Conecta ao Supabase
  const config = getSupabaseConfig(environment);
  const supabase = createClient(config.url, config.key);

  // Lê arquivo de seed
  const seedFile = join(SEED_DIR, `${environment}.sql`);
  log(`\n📂 Lendo arquivo: ${environment}.sql`, 'cyan');

  let seedContent: string;
  try {
    seedContent = await readFile(seedFile, 'utf-8');
    log('✅ Arquivo carregado', 'green');
  } catch (error) {
    log(`❌ Erro ao ler arquivo: ${(error as Error).message}`, 'red');
    process.exit(1);
  }

  // Aplica seed
  log('\n⚙️  Aplicando seed data...', 'cyan');

  try {
    const { error } = await supabase.rpc('exec_sql', {
      sql_query: seedContent,
    });

    if (error) {
      throw error;
    }

    log('✅ Seed data aplicado com sucesso!', 'green');
  } catch (error) {
    log(`❌ Erro ao aplicar seed: ${(error as Error).message}`, 'red');
    throw error;
  }

  log('\n═'.repeat(50), 'green');
  log('✨ Processo concluído!', 'green');
  log(`\n📊 Ambiente: ${environment}`, 'blue');
}

// Executa
main().catch(error => {
  log(`\n❌ Erro fatal: ${error.message}`, 'red');
  console.error(error);
  process.exit(1);
});
