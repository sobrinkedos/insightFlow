import { formatDistanceToNow as formatDistanceToNowOriginal } from "date-fns";
import { ptBR } from "date-fns/locale";

/**
 * Wrapper para formatDistanceToNow que garante retornar string
 * Corrige erro React #31 quando date-fns retorna objeto
 */
export function formatDistanceToNow(
  date: Date | number,
  options?: { addSuffix?: boolean; locale?: Locale }
): string {
  try {
    const result = formatDistanceToNowOriginal(date, {
      ...options,
      locale: options?.locale || ptBR,
    });
    
    // Garantir que sempre retorna string
    return typeof result === 'string' ? result : String(result);
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Data inválida';
  }
}
