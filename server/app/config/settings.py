from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    GROQ_API_KEY: str
    SERPER_API_KEY: str
    WEATHER_API_KEY: str
    MODEL_NAME: str
    CHROMA_PATH: str

    # Hybrid Search Configuration
    USE_HYBRID_SEARCH: bool = True
    TOP_K_VECTOR: int = 10
    TOP_K_BM25: int = 10
    TOP_K_FINAL: int = 30
    QUERY_EXPANSION_COUNT: int = 4
    USE_RERANKER: bool = True
    RRF_K: int = 60
    # Cohere Rerank Configuration
    COHERE_API_KEY: str = ""
    COHERE_MODEL: str = "rerank-english-v3.0"
    # Query Expansion Cache
    QUERY_EXPANSION_CACHE_SIZE: int = 128
    # RRF Filtering
    MIN_RRF_SCORE: float = 0.02

    # LangSmith Configuration
    LANGCHAIN_TRACING_V2: bool = True
    LANGCHAIN_ENDPOINT: str = "https://api.smith.langchain.com"
    LANGCHAIN_PROJECT: str = "PlanMyTrip"
    # LANGCHAIN_API_KEY will be read from .env

    model_config = SettingsConfigDict(
        env_file=".env",
        extra="ignore"
    )

settings = Settings()
