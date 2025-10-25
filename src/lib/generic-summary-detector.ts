/**
 * Detecta se um resumo foi gerado de forma genérica pela IA
 * devido a falhas na captação do vídeo
 */

// Padrões que indicam resumos genéricos
const GENERIC_PATTERNS = [
  // Frases muito genéricas sobre Instagram
  /oferece dicas valiosas para otimizar seu perfil/i,
  /dicas para melhorar a presença no instagram/i,
  /aumentar o engajamento e seguidores/i,
  /estratégias para crescer no instagram/i,
  
  // Frases genéricas sobre vídeos
  /este v[ií]deo oferece/i,
  /o v[ií]deo apresenta/i,
  /neste v[ií]deo.*aprenda/i,
  
  // Frases muito curtas e vagas
  /^.{0,100}$/,  // Menos de 100 caracteres
  
  // Menções a transcrição limitada
  /transcri[çc][ãa]o.*limitada/i,
  /informa[çc][õo]es limitadas/i,
  /n[ãa]o foi poss[ií]vel/i,
  
  // Resumos que falam sobre "obter máximo valor"
  /obter o m[áa]ximo.*valor/i,
  /para obter o m[áa]ximo de valor/i,
  
  // Frases sobre assistir ao vídeo
  /recomenda-se assistir ao v[ií]deo/i,
  /assista.*v[ií]deo.*completo/i,
];

// Palavras-chave que indicam conteúdo genérico
const GENERIC_KEYWORDS = [
  'dicas',
  'estratégias',
  'otimizar',
  'engajamento',
  'seguidores',
  'perfil',
  'presença',
  'instagram',
];

export interface GenericSummaryDetectionResult {
  isGeneric: boolean;
  confidence: number; // 0-1
  reasons: string[];
}

/**
 * Detecta se um resumo é genérico
 */
export function detectGenericSummary(
  summaryShort?: string | null,
  summaryExpanded?: string | null,
  transcription?: string | null
): GenericSummaryDetectionResult {
  const reasons: string[] = [];
  let score = 0;
  
  // Se não há resumo, não é genérico (é ausente)
  if (!summaryShort && !summaryExpanded) {
    return { isGeneric: false, confidence: 0, reasons: [] };
  }
  
  const combinedText = `${summaryShort || ''} ${summaryExpanded || ''}`.toLowerCase();
  
  // 1. Verifica padrões genéricos
  for (const pattern of GENERIC_PATTERNS) {
    if (pattern.test(combinedText)) {
      score += 0.3;
      reasons.push('Contém frases genéricas típicas de falha de processamento');
      break;
    }
  }
  
  // 2. Verifica se o resumo é muito curto
  if (combinedText.length < 150) {
    score += 0.2;
    reasons.push('Resumo muito curto (menos de 150 caracteres)');
  }
  
  // 3. Verifica densidade de palavras-chave genéricas
  const words = combinedText.split(/\s+/);
  const genericWordCount = words.filter(word => 
    GENERIC_KEYWORDS.some(kw => word.includes(kw))
  ).length;
  
  const genericWordDensity = genericWordCount / words.length;
  if (genericWordDensity > 0.15) {
    score += 0.3;
    reasons.push('Alta densidade de palavras genéricas');
  }
  
  // 4. Verifica se a transcrição está vazia ou muito curta
  if (!transcription || transcription.length < 100) {
    score += 0.4;
    reasons.push('Transcrição ausente ou muito curta');
  }
  
  // 5. Verifica se o resumo expandido é igual ou muito similar ao curto
  if (summaryShort && summaryExpanded) {
    const similarity = calculateSimilarity(summaryShort, summaryExpanded);
    if (similarity > 0.8) {
      score += 0.2;
      reasons.push('Resumo curto e expandido são muito similares');
    }
  }
  
  const confidence = Math.min(score, 1);
  const isGeneric = confidence > 0.6;
  
  return {
    isGeneric,
    confidence,
    reasons: isGeneric ? reasons : [],
  };
}

/**
 * Calcula similaridade simples entre dois textos (0-1)
 */
function calculateSimilarity(text1: string, text2: string): number {
  const words1 = new Set(text1.toLowerCase().split(/\s+/));
  const words2 = new Set(text2.toLowerCase().split(/\s+/));
  
  const intersection = new Set([...words1].filter(x => words2.has(x)));
  const union = new Set([...words1, ...words2]);
  
  return intersection.size / union.size;
}
