import asyncio

from contextlib import asynccontextmanager
from fastapi import FastAPI, Request
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware

from application.main.config import settings
from application.initializer import IncludeAPIRouter, ollama_controller, embedding_controller

async def lifespan(app: FastAPI):
    print("[App]: Setting up system")

    # await ollama_controller.start_ollama()
    await  embedding_controller.prepare_model()

    print("[App]: Setting up finished")
    yield
    print("[App]: Shutting down system")

    await ollama_controller.stop_ollama()

    print("[App]: Shutting dow finished")
    return


def get_application():
    _app = FastAPI(
        title=settings.API_NAME,
        description=settings.API_DESCRIPTION,
        version=settings.API_VERSION, 
        lifespan=lifespan
    )

    @_app.exception_handler(RequestValidationError)
    async def validation_exception_handler(request: Request, exc: RequestValidationError):
        return JSONResponse(
            status_code=422,
            content={
                "message": "Validation Error",
                "detail": exc.errors(),
                "body": exc.body
            }
        )
    
    _app.include_router(IncludeAPIRouter())
    _app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
    return _app

app = get_application()
# uv run python -m uvicorn main:app --reload