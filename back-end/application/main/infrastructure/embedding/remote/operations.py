import numpy as np

from abc import ABC

from google import genai
from google.genai import types
from application.main.infrastructure.embedding.embedding_interface import EmbeddingOperation

from application.main.config import settings

class RemoteEmbedding(EmbeddingOperation, ABC):
    def __init__(self):
        super(RemoteEmbedding, self).__init__()
        self.client = None

    async def prepare_model(self, api_key = None):
        print("[Remote Embedding]: Preparing Gemini embedding model...")
        if api_key:
            self.client = genai.Client(api_key=api_key)
        else:
            self.client = genai.Client(api_key=settings.GEMINI_API_KEY)
        print("[Remote Embedding]: Preparing Gemini embedding model completed")

    async def embed_chunks(self, chunks, model = "gemini-embedding-001"):
        result = await self.client.aio.models.embed_content(
            model=model,
            contents=chunks,
            config=types.EmbedContentConfig(output_dimensionality=1024)
        )

        embeddings = np.array([
            np.array(vec.values) for vec in result.embeddings
        ])
        embeddings = embeddings / np.linalg.norm(embeddings, axis=1).reshape(-1, 1)
        
        return embeddings