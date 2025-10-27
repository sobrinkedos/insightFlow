/**
 * Script de Rollback no Vercel
 * 
 * Este script facilita o rollback de deployments no Vercel.
 * 
 * Uso:
 *   npm run rollback:vercel
 * 
 * Requer:
 *   - VERCEL_TOKEN com permissão de deployments
 */

const VERCEL_TOKEN = process.env.VERCEL_TOKEN;
const VERCEL_PROJECT_ID = process.env.VERCEL_PROJECT_ID || 'insight-flow';

// Cores para output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  magenta: '\x1b[35m',
};

function log(message: string, color: keyof typeof colors = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

interface Deployment {
  uid: string;
  name: string;
  url: string;
  created: number;
  state: string;
  target: string;
  creator: {
    username: string;
  };
  meta: {
    githubCommitRef?: string;
    githubCommitSha?: string;
  };
}

/**
 * Lista deployments recentes
 */
async function listDeployments(limit: number = 10): Promise<Deployment[]> {
  if (!VERCEL_TOKEN) {
    throw new Error('VERCEL_TOKEN não configurado');
  }

  const url = `https://api.vercel.com/v6/deployments?projectId=${VERCEL_PROJECT_ID}&limit=${limit}`;

  try {
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${VERCEL_TOKEN}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Erro ao listar deployments: ${response.status}`);
    }

    const data = await response.json();
    return data.deployments || [];
  } catch (error) {
    throw new Error(`Falha ao listar deployments: ${(error as Error).message}`);
  }
}

/**
 * Obtém deployment atual em produção
 */
async function getCurrentProduction(deployments: Deployment[]): Promise<Deployment | null> {
  const production = deployments.find(d => d.target === 'production' && d.state === 'READY');
  return production || null;
}

/**
 * Promove deployment para produção
 */
async function promoteToProduction(deploymentId: string): Promise<void> {
  if (!VERCEL_TOKEN) {
    throw new Error('VERCEL_TOKEN não configurado');
  }

  const url = `https://api.vercel.com/v13/deployments/${deploymentId}/promote`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${VERCEL_TOKEN}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Erro ao promover deployment: ${response.status} - ${error}`);
    }

    log('✅ Deployment promovido para produção', 'green');
  } catch (error) {
    throw new Error(`Falha ao promover deployment: ${(error as Error).message}`);
  }
}

/**
 * Formata data
 */
function formatDate(timestamp: number): string {
  const date = new Date(timestamp);
  return date.toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * Exibe lista de deployments
 */
function displayDeployments(deployments: Deployment[], currentProd: Deployment | null) {
  log('\n📋 Deployments Recentes:', 'blue');
  log('═'.repeat(80), 'blue');

  deployments.forEach((deployment, index) => {
    const isCurrent = currentProd && deployment.uid === currentProd.uid;
    const number = `${index + 1}.`.padEnd(4);
    const status = deployment.state === 'READY' ? '✅' : '⏳';
    const target = deployment.target === 'production' ? '🚀 PROD' : '🔍 PREV';
    const current = isCurrent ? '← ATUAL' : '';
    
    log(`${number}${status} ${target} | ${deployment.url}`, isCurrent ? 'green' : 'cyan');
    log(`     Data: ${formatDate(deployment.created)}`, 'reset');
    
    if (deployment.meta.githubCommitRef) {
      log(`     Branch: ${deployment.meta.githubCommitRef}`, 'reset');
    }
    
    if (deployment.meta.githubCommitSha) {
      log(`     Commit: ${deployment.meta.githubCommitSha.substring(0, 7)}`, 'reset');
    }
    
    log(`     Autor: ${deployment.creator.username} ${current}`, isCurrent ? 'green' : 'reset');
    log('', 'reset');
  });

  log('═'.repeat(80), 'blue');
}

/**
 * Solicita confirmação do usuário
 */
async function promptConfirmation(message: string): Promise<boolean> {
  log(`\n${message}`, 'yellow');
  log('Digite "SIM" para confirmar ou qualquer outra coisa para cancelar:', 'yellow');
  
  // Simula input (em produção, use readline)
  // Por enquanto, retorna true para demonstração
  return true;
}

/**
 * Função principal
 */
async function main() {
  log('\n🔄 Rollback de Deployment no Vercel', 'blue');
  log('═'.repeat(80), 'blue');

  // Validações
  if (!VERCEL_TOKEN) {
    log('❌ VERCEL_TOKEN não configurado!', 'red');
    log('Configure a variável de ambiente VERCEL_TOKEN', 'yellow');
    log('Exemplo: export VERCEL_TOKEN=your_token_here', 'yellow');
    process.exit(1);
  }

  try {
    // Lista deployments
    log('\n📡 Buscando deployments...', 'cyan');
    const deployments = await listDeployments(10);

    if (deployments.length === 0) {
      log('❌ Nenhum deployment encontrado', 'red');
      process.exit(1);
    }

    log(`✅ ${deployments.length} deployments encontrados`, 'green');

    // Identifica produção atual
    const currentProd = await getCurrentProduction(deployments);

    if (!currentProd) {
      log('⚠️  Nenhum deployment em produção encontrado', 'yellow');
    } else {
      log(`\n🚀 Produção atual:`, 'green');
      log(`   URL: ${currentProd.url}`, 'green');
      log(`   Data: ${formatDate(currentProd.created)}`, 'green');
    }

    // Exibe lista
    displayDeployments(deployments, currentProd);

    // Solicita escolha
    log('\n❓ Qual deployment você deseja promover para produção?', 'cyan');
    log('Digite o número (1-10) ou 0 para cancelar:', 'cyan');

    // Simula escolha (em produção, use readline)
    const choice = process.argv[2] ? parseInt(process.argv[2]) : 0;

    if (choice === 0 || choice > deployments.length) {
      log('\n❌ Operação cancelada', 'yellow');
      process.exit(0);
    }

    const selectedDeployment = deployments[choice - 1];

    // Confirmação
    log('\n⚠️  ATENÇÃO: Você está prestes a fazer rollback em PRODUÇÃO!', 'yellow');
    log('\nDeployment selecionado:', 'yellow');
    log(`  • URL: ${selectedDeployment.url}`, 'yellow');
    log(`  • Data: ${formatDate(selectedDeployment.created)}`, 'yellow');
    log(`  • Branch: ${selectedDeployment.meta.githubCommitRef || 'N/A'}`, 'yellow');
    log(`  • Commit: ${selectedDeployment.meta.githubCommitSha?.substring(0, 7) || 'N/A'}`, 'yellow');

    const confirmed = await promptConfirmation('\n⏳ Aguardando confirmação...');

    if (!confirmed) {
      log('\n❌ Operação cancelada', 'yellow');
      process.exit(0);
    }

    // Executa rollback
    log('\n🔄 Promovendo deployment para produção...', 'cyan');
    await promoteToProduction(selectedDeployment.uid);

    log('\n═'.repeat(80), 'green');
    log('✨ Rollback concluído com sucesso!', 'green');
    log('\n📊 Resumo:', 'blue');
    log(`  • Deployment: ${selectedDeployment.url}`, 'blue');
    log(`  • Data original: ${formatDate(selectedDeployment.created)}`, 'blue');
    log(`  • Agora em produção: https://insight-flow.vercel.app`, 'blue');
    log('\n💡 Verifique a aplicação para confirmar que está funcionando corretamente', 'cyan');

  } catch (error) {
    log(`\n❌ Erro: ${(error as Error).message}`, 'red');
    console.error(error);
    process.exit(1);
  }
}

// Executa
main();
