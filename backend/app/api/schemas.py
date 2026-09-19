from pydantic import BaseModel


class EmbeddingResponse(BaseModel):
    embedding: list[float]
    dim: int


class HealthResponse(BaseModel):
    status: str
    model: str
