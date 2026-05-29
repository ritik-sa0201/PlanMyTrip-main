from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    GROQ_API_KEY: str
    SERPER_API_KEY: str
    WEATHER_API_KEY: str
    MODEL_NAME: str
    CHROMA_PATH: str
    model_config = SettingsConfigDict(
        env_file=".env",
        extra="ignore"
    )

settings = Settings()