from typing import Optional, Dict, List
from pydantic import BaseModel, Field
from pydantic_settings import BaseSettings
from pathlib import Path


class AppConfig(BaseModel):
    BASE_DIR: Path = Path(__file__).resolve().parent.parent.parent
    
    VEC_DB: Path = BASE_DIR.joinpath('chromadb')
    VEC_DB.mkdir(parents=True, exist_ok=True)


class GlobalConfig(BaseSettings):
    APP_CONFIG: AppConfig = AppConfig()

    MODEL: Dict[str, List[str]] = {
        "gemini": ["remote", "gemini-embedding-001"],
        "bge": ["local", "bge-m3:567m"]
    }
    
    API_NAME: Optional[str] = Field(None, env="API_NAME")
    API_DESCRIPTION: Optional[str] = Field(None, env="API_DESCRIPTION")
    API_VERSION: Optional[str] = Field(None, env="API_VERSION")

    GEMINI_API_KEY: Optional[str] = Field(None, env="GEMINI_API_KEY")

    CHUNK_LIMIT: int = 15

    class Config:
        env_file: str = '.env'

settings = GlobalConfig()