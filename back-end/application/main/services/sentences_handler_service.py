import re
import numpy as np
import asyncio

from fastapi import HTTPException
from fastapi.responses import JSONResponse
from math import inf

from application.main.config import settings
from application.initializer import embedding_controller

class SentencesHandlerService(object):
    def __init__(self):
        pass

    async def input_processing(self, sen: str, model_tag: str, max_len: int = inf):
        splitted_sentence = [s.strip() for s in re.split(r'(?<=[.?!])', sen) if s.strip()]
        lower_splitted_sentence = [s.lower() for s in splitted_sentence]
        if len(lower_splitted_sentence) > max_len:
            raise HTTPException(status_code=400, detail="Với văn bản quá lớn xin hãy dùng chức năng upload file.")
        
        try:
            run_opt, model = settings.MODEL.get(model_tag)
            embeddings = await embedding_controller.embedding_to_use[run_opt].embed_chunks(
                lower_splitted_sentence,
                model
            )
        except:
            raise HTTPException(status_code=400, detail="Có lỗi xảy ra khi gọi Model Embedding.")

        return splitted_sentence, embeddings
    

    async def similarity_cal(self, sen1: str, sen2: str, model_tag: str):
        try:
            lst1, embed1 = await self.input_processing(sen1, model_tag)
            lst2, embed2 = await self.input_processing(sen2, model_tag, settings.CHUNK_LIMIT)
        except HTTPException as e:
            raise e
        except Exception as e:
            raise HTTPException(
                status_code=400,
                content={"detail" : "Lỗi xảy ra khi cố gắng Embedding dữ liệu."}
            )

        scores = np.dot(embed1, embed2.T)
        row, col = np.where(scores > 0.7)
        unique_row, indice = np.unique(row, return_index=True)
        adj_array = dict(zip(unique_row.tolist(), list(map(lambda x: x.tolist(), np.split(col, indice[1:])))))
        return JSONResponse(
            status_code=200,
            content={
                "sen1_sentences": lst1,
                "sen2_sentences": lst2,
                "matches": adj_array
            }
        )
    
service = SentencesHandlerService()