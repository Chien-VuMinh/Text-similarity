from typing import Optional, Dict, List
from pydantic import Field
from pydantic_settings import BaseSettings

class GlobalConfig(BaseSettings):
    MODEL: Dict[str, List[str]] = {
        "gemini": ["remote", "gemini-embedding-001"],
        "bge": ["local", "bge-m3:567m"]
    }
    
    API_NAME: Optional[str] = Field(None, env="API_NAME")
    API_DESCRIPTION: Optional[str] = Field(None, env="API_DESCRIPTION")
    API_VERSION: Optional[str] = Field(None, env="API_VERSION")

    GEMINI_API_KEY: Optional[str] = Field(None, env="GEMINI_API_KEY")

    CHUNK_LIMIT: int = 20

    class Config:
        env_file: str = '.env'

settings = GlobalConfig()