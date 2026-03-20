from fastapi.responses import JSONResponse
from fastapi.routing import APIRouter
from fastapi import HTTPException
from pydantic import BaseModel

from application.main.services.sentences_handler_service import service

router = APIRouter(prefix='/sentences')

class Data(BaseModel):
    sen1: str
    sen2: str
    model: str

@router.post('')
async def sentences_handler(data: Data):
    try:
        return await service.similarity_cal(data.sen1, data.sen2, data.model)
    except HTTPException as e:
        raise e