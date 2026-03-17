import ollama
import asyncio
import numpy as np

from abc import ABC

from application.main.config import settings
from application.main.infrastructure.embedding.embedding_interface import EmbeddingOperation

class LocalEmbedding(EmbeddingOperation, ABC):
    def __init__(self):
        super(LocalEmbedding, self).__init__()
        self.client = ollama.AsyncClient()

    async def prepare_model(self, api_key = None):
        print("[Local Embedding]: Preparing local models...")
        for model in settings.MODEL.values():
            if model[0] == 'local':
                print(f"    - Pulling {model[1]}")
                await self.client.pull(model=model[1])

            await asyncio.sleep(0)

        print("[Local Embedding]: Preparing local models completed")

    async def embed_chunks(self, chunks, model = "bge-m3:567m"):
        result = await self.client.embed(
            model=model,
            input=chunks
        )
        embeddings = np.array(result.embeddings)
        embeddings = embeddings / np.linalg.norm(embeddings, axis=1).reshape(-1, 1)

        return embeddings