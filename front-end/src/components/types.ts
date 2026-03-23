export interface ApiChunk {
  sen1_sentences: string[]
  sen2_sentences: string[]
  matches: Record<number, number[]>
  chunk_id: string
}

export type ApiResponse = ApiChunk[]
export type InputMode = 'text' | 'file' | 'db'