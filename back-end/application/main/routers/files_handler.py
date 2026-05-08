from typing import List
from fastapi import File, HTTPException, UploadFile, Form
from fastapi.routing import APIRouter
from fastapi.responses import StreamingResponse, JSONResponse

from application.main.services.files_handler_service import service

router = APIRouter(prefix='/files')

@router.post('/file_sen')
async def sen_files_handler(
    file: UploadFile = File(...),
    sen: str = Form(...),
    model: str = Form(...),
    threshold: float = Form(...)
):
    return StreamingResponse(
        service.similarity_cal(file, sen, model, threshold),
        media_type="text/plain"    
    )
    
@router.post('/sen_files')
async def sen_files_handler(
    sen: str = Form(...),
    files: List[UploadFile] = File(...),
    model: str = Form(...),
    threshold: float = Form(...)
):
    return StreamingResponse(
        service.similarity_cal(sen, files, model, threshold),
        media_type="text/plain"    
    )

@router.post('/file_files')
async def file_files_handler(
    file1: UploadFile = File(...),
    file2: List[UploadFile] = File(...),
    model: str = Form(...),
    threshold: float = Form(...)
):
    return StreamingResponse(
        service.similarity_cal(file1, file2, model, threshold),
        media_type="text/plain"    
    )