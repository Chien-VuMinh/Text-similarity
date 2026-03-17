import re
import numpy as np
import asyncio

from fastapi import HTTPException
from math import inf

from application.main.config import settings
from application.initializer import embedding_controller

class SentencesHandlerService(object):
    def __init__(self):
        pass

    async def input_processing(self, sen: str, model_tag: str, max_len: int = inf):
        lst_new_sen = [s.strip() for s in re.split(r'(?<=[.?!])', sen) if s.strip()]
        print(lst_new_sen)
        lst_new_sen_no_punctuation = [s.lower() for s in lst_new_sen if len(s) > 1]
        print(lst_new_sen_no_punctuation)
        if len(lst_new_sen_no_punctuation) > max_len:
            raise HTTPException(status_code=400, detail="Với văn bản quá lớn xin hãy dùng chức năng upload file.")

        run_opt, model = settings.MODEL.get(model_tag)
        embeddings = await embedding_controller.embedding_to_use[run_opt].embed_chunks(
            lst_new_sen_no_punctuation,
            model
        )

        original_sen = []
        ind = 0
        complete_sen = ''
        while ind < len(lst_new_sen):
            s = lst_new_sen[ind]
            if len(s) > 1:
                if complete_sen:
                    original_sen.append(complete_sen)
                complete_sen = s
            else:
                complete_sen += s
            ind += 1
        original_sen.append(complete_sen)

        print("len: ", len(original_sen), len(lst_new_sen_no_punctuation))

        return original_sen, embeddings
    

    async def similarity_cal(self, sen1: str, sen2: str, model_tag: str):
        lst1, embed1 = await self.input_processing(sen1, model_tag)
        lst2, embed2 = await self.input_processing(sen2, model_tag)

        scores = np.dot(embed1, embed2.T)
        print("shape = ", scores.shape)
        print(scores)
        row, col = np.where(scores > 0.7)
        unique_row, indice = np.unique(row, return_index=True)
        adj_array = dict(zip(unique_row.tolist(), list(map(lambda x: x.tolist(),np.split(col, indice[1:])))))
        return {
            "sen1_sentences": lst1,
            "sen2_sentences": lst2,
            "matches": adj_array
        }
    
service = SentencesHandlerService()