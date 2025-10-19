import { useEffect } from 'react';

/**
 * Hook para controlar o bloqueio de orientação da tela
 * Por padrão, bloqueia em portrait no PWA
 * Só permite landscape quando em fullscreen
 */
export function useOrientationLock(allowFreeOrientation = false) {
  useEffect(() => {
    // Se a página permite orientação livre, desbloquear
    if (allowFreeOrientation) {
      unlockOrientation();
      console.log('ℹ️ Orientação livre permitida nesta página');
      return;
    }

    // Verificar se está rodando como PWA
    const isPWA = window.matchMedia('(display-mode: standalone)').matches ||
                  (window.navigator as any).standalone === true;

    console.log('🔍 Verificando PWA:', isPWA);

    if (!isPWA) {
      // Se não for PWA, não fazer nada
      console.log('ℹ️ Não é PWA, orientação livre');
      return;
    }

    // Bloquear em portrait por padrão
    const lockToPortrait = async () => {
      try {
        if (screen.orientation && screen.orientation.lock) {
          await screen.orientation.lock('portrait-primary');
          console.log('✅ Orientação bloqueada em portrait (PWA)');
        } else if ((screen as any).lockOrientation) {
          (screen as any).lockOrientation('portrait-primary');
          console.log('✅ Orientação bloqueada em portrait (webkit)');
        } else if ((screen as any).mozLockOrientation) {
          (screen as any).mozLockOrientation('portrait-primary');
          console.log('✅ Orientação bloqueada em portrait (moz)');
        } else if ((screen as any).msLockOrientation) {
          (screen as any).msLockOrientation('portrait-primary');
          console.log('✅ Orientação bloqueada em portrait (ms)');
        }
      } catch (err) {
        console.log('⚠️ Não foi possível bloquear orientação:', err);
      }
    };

    // Aplicar bloqueio imediatamente e após delay
    lockToPortrait();
    const timeoutId = setTimeout(lockToPortrait, 500);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [allowFreeOrientation]);
}

/**
 * Função para desbloquear orientação
 */
function unlockOrientation() {
  try {
    if (screen.orientation && screen.orientation.unlock) {
      screen.orientation.unlock();
    } else if ((screen as any).unlockOrientation) {
      (screen as any).unlockOrientation();
    } else if ((screen as any).mozUnlockOrientation) {
      (screen as any).mozUnlockOrientation();
    } else if ((screen as any).msUnlockOrientation) {
      (screen as any).msUnlockOrientation();
    }
    console.log('✅ Orientação desbloqueada');
  } catch (err) {
    console.log('⚠️ Erro ao desbloquear orientação:', err);
  }
}

/**
 * Função para bloquear orientação em landscape (para fullscreen)
 */
export async function lockToLandscape() {
  try {
    if (screen.orientation && screen.orientation.lock) {
      await screen.orientation.lock('landscape');
      console.log('✅ Orientação bloqueada em landscape');
    } else if ((screen as any).lockOrientation) {
      (screen as any).lockOrientation('landscape');
      console.log('✅ Orientação bloqueada em landscape (webkit)');
    } else if ((screen as any).mozLockOrientation) {
      (screen as any).mozLockOrientation('landscape');
      console.log('✅ Orientação bloqueada em landscape (moz)');
    } else if ((screen as any).msLockOrientation) {
      (screen as any).msLockOrientation('landscape');
      console.log('✅ Orientação bloqueada em landscape (ms)');
    }
  } catch (err) {
    console.log('⚠️ Não foi possível bloquear em landscape:', err);
  }
}

/**
 * Função para voltar ao bloqueio portrait (ao sair do fullscreen)
 */
export async function lockToPortrait() {
  // Verificar se está rodando como PWA
  const isPWA = window.matchMedia('(display-mode: standalone)').matches ||
                (window.navigator as any).standalone === true;

  if (!isPWA) {
    // Se não for PWA, apenas desbloquear
    try {
      if (screen.orientation && screen.orientation.unlock) {
        screen.orientation.unlock();
      } else if ((screen as any).unlockOrientation) {
        (screen as any).unlockOrientation();
      } else if ((screen as any).mozUnlockOrientation) {
        (screen as any).mozUnlockOrientation();
      } else if ((screen as any).msUnlockOrientation) {
        (screen as any).msUnlockOrientation();
      }
    } catch (err) {
      console.log('⚠️ Erro ao desbloquear orientação:', err);
    }
    return;
  }

  // Se for PWA, voltar para portrait
  try {
    if (screen.orientation && screen.orientation.lock) {
      await screen.orientation.lock('portrait-primary');
      console.log('✅ Orientação voltou para portrait');
    } else if ((screen as any).lockOrientation) {
      (screen as any).lockOrientation('portrait-primary');
      console.log('✅ Orientação voltou para portrait (webkit)');
    } else if ((screen as any).mozLockOrientation) {
      (screen as any).mozLockOrientation('portrait-primary');
      console.log('✅ Orientação voltou para portrait (moz)');
    } else if ((screen as any).msLockOrientation) {
      (screen as any).msLockOrientation('portrait-primary');
      console.log('✅ Orientação voltou para portrait (ms)');
    }
  } catch (err) {
    console.log('⚠️ Não foi possível voltar para portrait:', err);
  }
}
