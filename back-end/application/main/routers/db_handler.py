from typing import List
from fastapi import File, HTTPException, UploadFile, Form
from fastapi.routing import APIRouter
from fastapi.responses import StreamingResponse, JSONResponse

from application.main.services.db_handler_service import service

router = APIRouter(prefix='/db')

@router.post('/sen')
async def sentence_handler(
    sen: str = Form(...),
    model: str = Form(...),
    threshold: float = Form(...)
):
    return StreamingResponse(
        service.similarity_cal(sen, model, threshold),
        media_type="text/plain"    
    )


@router.post('/files')
async def sentence_handler(
    file: UploadFile = File(...),
    model: str = Form(...),
    threshold: float = Form(...)
):
    return StreamingResponse(
        service.similarity_cal(file, model, threshold),
        media_type="text/plain"    
    )