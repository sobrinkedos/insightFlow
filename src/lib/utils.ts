import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export function formatDate(date: string | Date | null | undefined): string {
  if (!date) return 'Data desconhecida';
  
  try {
    const result = formatDistanceToNow(new Date(date), { 
      addSuffix: true, 
      locale: ptBR 
    });
    return String(result);
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Data inválida';
  }
}
