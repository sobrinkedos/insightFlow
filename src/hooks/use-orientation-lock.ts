import { useEffect } from 'react';

/**
 * Hook para controlar o bloqueio de orientação da tela
 * Por padrão, bloqueia em portrait no PWA
 * Só permite landscape quando em fullscreen
 */
export function useOrientationLock() {
  useEffect(() => {
    // Verificar se está rodando como PWA
    const isPWA = window.matchMedia('(display-mode: standalone)').matches ||
                  (window.navigator as any).standalone === true;

    if (!isPWA) {
      // Se não for PWA, não fazer nada
      return;
    }

    // Bloquear em portrait por padrão
    const lockToPortrait = async () => {
      try {
        if (screen.orientation && screen.orientation.lock) {
          await screen.orientation.lock('portrait');
          console.log('✅ Orientação bloqueada em portrait (PWA)');
        } else if ((screen as any).lockOrientation) {
          (screen as any).lockOrientation('portrait');
          console.log('✅ Orientação bloqueada em portrait (webkit)');
        }
      } catch (err) {
        console.log('⚠️ Não foi possível bloquear orientação:', err);
      }
    };

    // Aplicar bloqueio após um pequeno delay
    const timeoutId = setTimeout(lockToPortrait, 100);

    return () => {
      clearTimeout(timeoutId);
    };
  }, []);
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
      }
    } catch (err) {
      console.log('⚠️ Erro ao desbloquear orientação:', err);
    }
    return;
  }

  // Se for PWA, voltar para portrait
  try {
    if (screen.orientation && screen.orientation.lock) {
      await screen.orientation.lock('portrait');
      console.log('✅ Orientação voltou para portrait');
    } else if ((screen as any).lockOrientation) {
      (screen as any).lockOrientation('portrait');
      console.log('✅ Orientação voltou para portrait (webkit)');
    }
  } catch (err) {
    console.log('⚠️ Não foi possível voltar para portrait:', err);
  }
}
