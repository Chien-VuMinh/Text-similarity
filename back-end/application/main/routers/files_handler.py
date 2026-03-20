from fastapi import File, UploadFile, Form
from fastapi.routing import APIRouter
from fastapi.responses import StreamingResponse, JSONResponse

from application.main.services.files_handler_service import service

router = APIRouter(prefix='/files')

@router.post('')
async def files_handler(
    sen1: str = Form(...),
    file: UploadFile = File(...),
    model: str = Form(...)
):
    try:
        return StreamingResponse(
            service.similarity_cal(sen1, file, model),
            media_type="text/plain"    
        )
    except:
        return JSONResponse(
            status_code=400,
            content={'response': 'Missing input. Please check again.'}
        )