from numpy import ndarray
from abc import ABC, abstractmethod
from typing import Dict, List

class EmbeddingOperation(ABC):

    def __init__(self):
        super(EmbeddingOperation, self).__init__()

    @abstractmethod
    async def prepare_model(self, api_key: str = None) -> None:
        """
        Load model to use
        """
        raise NotImplementedError()
    
    @abstractmethod
    async def embed_chunks(self, chunks: List[str], model: str) -> ndarray:
        """
        Embedding chunk of Sentences

        Parameters:
            text (List[str]): Sentences to be embedded
        Returns:
            NDarray: embedded vector representation of the text
        """
        raise NotImplementedError()