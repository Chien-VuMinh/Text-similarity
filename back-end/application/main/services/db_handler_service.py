import shutil
import asyncio
import fitz
import re
import asyncio
import numpy as np
import json
import chromadb

from fastapi import Form, UploadFile, File, HTTPException
from fastapi.responses import JSONResponse
from pathlib import Path
from typing import List

from application.main.config import settings
from application.initializer import embedding_controller


class FilesHandlerService(object):
    def __init__(self):
        self.client = chromadb.PersistentClient(path=settings.APP_CONFIG.VEC_DB)
        try:
            self.collection = self.client.get_collection(name="vec_db")
        except:
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

    def get_file_content(self, file: UploadFile):
        file_path = Path(__file__).parent / file.filename
        file_extension = Path(file.filename).suffix.lstrip('.')
        file_content: str = ''

        try:
            with open(file_path, 'wb') as buffer:
                shutil.copyfileobj(file.file, buffer)
            
            if (file_extension == 'pdf'):
                contents = []
                with fitz.open(file_path) as f:
                    for page in f:
                        contents.append(page.get_text())
                file_content = ''.join(contents)
            else:
                with open(file_path, 'r', encoding='utf-8') as f:
                    file_content = f.read()

            splitted_sen, clean_sen = self.clean_sen(file_content)
            return splitted_sen, clean_sen
        
        except Exception as e:
            raise e
        
        finally:
            if file_path.exists():
                file_path.unlink(missing_ok=True)

        
    def adj_array(self, embed1, embed_chunk, threshold):
        scores = np.dot(embed1, embed_chunk.T)
        row, col = np.where(scores > threshold)
        unique_row, indice = np.unique(row, return_index=True)
        adj_array = dict(zip(unique_row.tolist(), list(map(lambda x: x.tolist(), np.split(col, indice[1:])))))
        return adj_array
    
    def clean_sen(self, sen: str):
        output1 = []
        output2 = []
        splitted_sen: List[str] = re.split(r'(?<=[.?!])', sen)
        for s in splitted_sen:
            s_stripped = s.strip()
            if s_stripped:
                output1.append(s)
                output2.append(s_stripped)
        
        return output1, output2

    async def similarity_cal(self,
        input: str | UploadFile,
        model_tag: str,
        threshold: float = 0.7
    ):
        # INPUT HANDLER
        splitted_sentence_1: List[str] = []
        clean_splitted_sentence_1: List[str] = []
        # input is a sentence
        try:
            splitted_sentence_1, clean_splitted_sentence_1 = await asyncio.to_thread(
                self.clean_sen,
                input
            )
        # input is a file
        except:            
            try:
                splitted_sentence_1, clean_splitted_sentence_1 = await asyncio.to_thread(
                    self.get_file_content,
                    input
                )
            except:
                raise HTTPException(
                    status_code=400,
                    detail=f"Không thể trích xuất dữ liệu từ Input 1."
                )
        embed1 = await self.embedding_sen(clean_splitted_sentence_1, model_tag)


        chunk_size = settings.CHUNK_LIMIT
        offset = 0
        for i in range(0, self.collection.count(), chunk_size):
            batch = self.collection.get(
                limit=chunk_size, 
                offset=i,
                include=["documents", "embeddings"]
            )            
            # cosine score + adj array
            adj_array = await asyncio.to_thread(
                self.adj_array,
                embed1,
                batch['embeddings'],
                threshold
            )

            yield json.dumps(
                {
                    "status_code":200,
                    "sen1_sentences": splitted_sentence_1,
                    "sen2_sentences": batch['documents'],
                    "matches": adj_array,
                    "chunk_id": i // chunk_size + 1
                }
            ) + '\n'


    async def update_db(self, files: List[UploadFile]):
        try:
            self.client.delete_collection(name="vec_db")
        except:
            pass

        self.collection = self.client.create_collection(
            name="vec_db",
            metadata={"hnsw:space": "cosine"}
        )

        all_documents = []
        all_embeddings = []
        all_ids = []

        for idx_file, file in enumerate(files):
            try:              
                splitted_sen, clean_sen = await asyncio.to_thread(
                    self.get_file_content, file
                )

                if not clean_sen:
                    print(f"File {file.filename} không có nội dung, bỏ qua.")
                    continue

                embeddings = await self.embedding_sen(clean_sen, model_tag="bge")

                for i, (doc, emb) in enumerate(zip(splitted_sen, embeddings)):
                    doc_id = f"doc_{idx_file}_{i}"
                    all_documents.append(doc)
                    all_embeddings.append(emb)
                    all_ids.append(doc_id)

            except Exception as e:
                print(f"Lỗi xử lý file {file.filename}: {e}")
                continue
        
        if all_documents:
            self.collection.add(
                documents=all_documents,
                embeddings=all_embeddings,
                ids=all_ids
            )
        else:
            print("Không có dữ liệu nào được thêm vào database.")

        return {
            "status": "success",
            "message": f"Đã cập nhật database thành công với {len(all_documents)} câu.",
            "total_files": len(files),
            "total_sentences": len(all_documents)
        }

service = FilesHandlerService()

# uv run python -m application.main.services.db_handler_service