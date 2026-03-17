export interface ApiResponse {
  sen1_sentences: string[]
  sen2_sentences: string[]
  matches: Record<number, number[]>
}

export type InputMode = 'text' | 'file' | 'db'