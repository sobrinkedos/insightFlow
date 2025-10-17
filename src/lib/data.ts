// This file is no longer used for data, but kept for types if needed elsewhere.
// It's recommended to move types to a dedicated file like `src/types/database.ts`

export type Theme = {
  id: string;
  title: string;
  description: string;
  tags: string[];
  videoCount: number;
  lastUpdatedAt: Date;
};

export type Video = {
  id: string;
  title: string;
  thumbnail: string;
  source: 'YouTube' | 'Vimeo' | 'TikTok';
  addedAt: Date;
  status: 'Processado' | 'Processando' | 'Falha';
};
