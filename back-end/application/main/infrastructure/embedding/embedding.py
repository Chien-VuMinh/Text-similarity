from typing import Dict

from application.main.config import settings
from application.main.infrastructure.embedding.embedding_interface import EmbeddingOperation
from application.main.infrastructure.embedding.local.operations import LocalEmbedding
from application.main.infrastructure.embedding.remote.operations import RemoteEmbedding

class Embedding:
    def __init__(self):
        self.embedding_to_use: Dict[str, EmbeddingOperation] = {
            "local": LocalEmbedding(),
            "remote": RemoteEmbedding()
        }

    async def prepare_model(self):
        for embed in self.embedding_to_use.values():
            await embed.prepare_model()