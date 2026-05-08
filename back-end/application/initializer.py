class IncludeAPIRouter(object):
    def __new__(cls):
        from application.main.routers.sentences_handler import router as sentences_handler_router
        from application.main.routers.files_handler import router as files_handler_router
        from application.main.routers.db_handler import router as db_handler_router
        from fastapi.routing import APIRouter
        router = APIRouter(prefix='/api')
        router.include_router(sentences_handler_router, tags=['sentences_handler'])
        router.include_router(files_handler_router, tags=['files_handler'])
        router.include_router(db_handler_router, tags=['db_handler'])

        return router
    
class OllamaControllerInstance(object):
    def __new__(cls):
        from application.main.infrastructure.ollama_controller import controller
        return controller.Controller()
    
class EmbeddingControllerInstance(object):
    def __new__(cls):
        from application.main.infrastructure.embedding import embedding
        return embedding.Embedding()

ollama_controller = OllamaControllerInstance()
embedding_controller = EmbeddingControllerInstance()