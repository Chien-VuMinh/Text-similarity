import shutil
import asyncio
import fitz
import re
import asyncio
import numpy as np
import json

from fastapi import Form, UploadFile, File, HTTPException
from fastapi.responses import JSONResponse
from pathlib import Path
from typing import List

from application.main.config import settings
from application.initializer import embedding_controller


class FilesHandlerService(object):
    def __init__(self):
        pass

    async def embedding_sen(self, sen: List[str], model_tag: str):        
        try:
            run_opt, model = settings.MODEL.get(model_tag)
            embeddings = await embedding_controller.embedding_to_use[run_opt].embed_chunks(
                sen,
                model
            )
        except:
            raise HTTPException(status_code=400, detail="Có lỗi xảy ra khi gọi Model Embedding.")

        return embeddings

    async def similarity_cal(self,
        sen1: str,
        file: UploadFile,
        model_tag: str
    ):
        file_path = Path(__file__).parent / file.filename
        file_extension = Path(file.filename).suffix.lstrip('.')
        file_content = ''

        def write_file():          
            with open(file_path, 'wb') as buffer:
                shutil.copyfileobj(file.file, buffer)
        try:
            await asyncio.to_thread(write_file)
        except:
            raise HTTPException(
                status_code=400,
                detail=f"Có lỗi xảy khi cố gắng ghi file vào thư mục {file_path}."
            )
        
        def get_content():
            file_result = ''
            if (file_extension == 'pdf'):
                contents = []
                with fitz.open(file_path) as f:
                    for page in f:
                        contents.append(page.get_text())
                file_result = ''.join(contents)
            else:
                with open(file_path, 'r', encoding='utf-8') as f:
                    file_result = f.read()

            return file_result
        try:
            file_content = await asyncio.to_thread(get_content)
        except:
            raise HTTPException(
                status_code=400,
                detail=f"Không thể trích xuất dữ liệu từ file \"{file.filename}\"."
            )
        file_path.unlink()

        splitted_sentence_1 = [s.strip() for s in re.split(r'(?<=[.?!])', sen1) if s.strip()]
        lower_splitted_sentence_1 = [s.lower() for s in splitted_sentence_1]
        embed1 = await self.embedding_sen(lower_splitted_sentence_1, model_tag)

        file_into_sentences = [s.strip() for s in re.split(r'(?<=[.?!])', file_content) if s.strip()]

        chunk_size = settings.CHUNK_LIMIT
        for i in range(0, len(file_into_sentences), chunk_size):
            chunk = file_into_sentences[i : i + chunk_size]

            embed_chunk = await self.embedding_sen(chunk, model_tag)
            
            scores = np.dot(embed1, embed_chunk.T)
            row, col = np.where(scores > 0.7)
            unique_row, indice = np.unique(row, return_index=True)
            adj_array = dict(zip(unique_row.tolist(), list(map(lambda x: x.tolist(), np.split(col, indice[1:])))))

            yield json.dumps(
                {
                    "status_code":200,
                    "sen1_sentences": splitted_sentence_1,
                    "sen2_sentences": chunk,
                    "matches": adj_array,
                    "chunk_id": i // chunk_size + 1
                }
            ) + '\n'

service = FilesHandlerService()