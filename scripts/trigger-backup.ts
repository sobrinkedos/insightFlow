/**
 * Script para Disparar Backup Manual
 * 
 * Este script dispara o workflow de backup via GitHub API.
 * 
 * Uso:
 *   npm run backup:trigger
 * 
 * Requer:
 *   - GITHUB_TOKEN com permissão de actions:write
 */

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const REPO_OWNER = 'sobrinkedos';
const REPO_NAME = 'insightFlow';
const WORKFLOW_ID = 'backup-production.yml';

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
 * Dispara o workflow de backup
 */
async function triggerBackup(backupType: string = 'manual') {
  if (!GITHUB_TOKEN) {
    log('❌ GITHUB_TOKEN não configurado!', 'red');
    log('Configure a variável de ambiente GITHUB_TOKEN', 'yellow');
    log('Exemplo: export GITHUB_TOKEN=ghp_...', 'yellow');
    process.exit(1);
  }

  log('\n🚀 Disparando backup...', 'blue');
  log(`Tipo: ${backupType}`, 'cyan');

  const url = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/actions/workflows/${WORKFLOW_ID}/dispatches`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Accept': 'application/vnd.github+json',
        'Authorization': `Bearer ${GITHUB_TOKEN}`,
        'X-GitHub-Api-Version': '2022-11-28',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ref: 'main',
        inputs: {
          backup_type: backupType,
        },
      }),
    });

    if (response.status === 204) {
      log('\n✅ Backup disparado com sucesso!', 'green');
      log('\n📊 Para acompanhar:', 'blue');
      log(`https://github.com/${REPO_OWNER}/${REPO_NAME}/actions/workflows/${WORKFLOW_ID}`, 'cyan');
    } else {
      const error = await response.text();
      log(`\n❌ Erro ao disparar backup: ${response.status}`, 'red');
      log(error, 'red');
      process.exit(1);
    }
  } catch (error) {
    log(`\n❌ Erro: ${(error as Error).message}`, 'red');
    process.exit(1);
  }
}

/**
 * Dispara backup após migração
 */
async function triggerPostMigrationBackup() {
  if (!GITHUB_TOKEN) {
    log('❌ GITHUB_TOKEN não configurado!', 'red');
    process.exit(1);
  }

  log('\n🚀 Disparando backup pós-migração...', 'blue');

  const url = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/dispatches`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Accept': 'application/vnd.github+json',
        'Authorization': `Bearer ${GITHUB_TOKEN}`,
        'X-GitHub-Api-Version': '2022-11-28',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        event_type: 'migration-completed',
        client_payload: {
          timestamp: new Date().toISOString(),
        },
      }),
    });

    if (response.status === 204) {
      log('\n✅ Backup pós-migração disparado!', 'green');
    } else {
      const error = await response.text();
      log(`\n❌ Erro: ${response.status}`, 'red');
      log(error, 'red');
      process.exit(1);
    }
  } catch (error) {
    log(`\n❌ Erro: ${(error as Error).message}`, 'red');
    process.exit(1);
  }
}

// Executa
const command = process.argv[2];

if (command === 'post-migration') {
  triggerPostMigrationBackup();
} else {
  const backupType = process.argv[2] || 'manual';
  triggerBackup(backupType);
}
