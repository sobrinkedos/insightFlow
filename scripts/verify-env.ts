/**
 * Script para verificar configuração de ambiente
 * 
 * Este script valida se todas as variáveis de ambiente necessárias
 * estão configuradas corretamente.
 * 
 * Uso: npx tsx scripts/verify-env.ts
 */

import { loadEnvironmentConfig } from '../config/environment.config';

console.log('🔍 Verificando configuração de ambiente...\n');

try {
  const config = loadEnvironmentConfig();
  
  console.log('✅ Configuração carregada com sucesso!\n');
  console.log('📊 Informações do Ambiente:');
  console.log('─'.repeat(50));
  console.log(`Ambiente: ${config.environment}`);
  console.log(`Supabase URL: ${config.supabase.url}`);
  console.log(`Anon Key: ${config.supabase.anonKey.substring(0, 30)}...`);
  console.log(`Service Role Key: ${config.supabase.serviceRoleKey ? '✓ Configurada' : '✗ Não configurada'}`);
  
  if (config.backupConfig) {
    console.log(`\n💾 Configuração de Backup:`);
    console.log(`Backup URL: ${config.backupConfig.backupUrl}`);
    console.log(`Retenção: ${config.backupConfig.retentionDays} dias`);
  }
  
  console.log('─'.repeat(50));
  console.log('\n✨ Tudo pronto para usar!');
  
  process.exit(0);
} catch (error) {
  console.error('❌ Erro na configuração:\n');
  console.error((error as Error).message);
  console.error('\n📖 Consulte config/README.md para mais informações.');
  process.exit(1);
}
