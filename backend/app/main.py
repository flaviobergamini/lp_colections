import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes import embedding, health
from app.config import settings
from app.infrastructure.clip_image_embedder import ClipImageEmbedder
from app.use_cases.generate_image_embedding import GenerateImageEmbedding

logger = logging.getLogger("uvicorn.error")


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Raiz de composição: só aqui infraestrutura (CLIP) e casos de uso se conhecem.
    logger.info("Carregando modelo CLIP (%s)...", settings.model_repo)
    embedder = ClipImageEmbedder(settings.model_repo, settings.model_file)
    app.state.generate_embedding_use_case = GenerateImageEmbedding(embedder)
    logger.info("Modelo CLIP carregado.")
    yield


app = FastAPI(title="Bergas - Vinyl Embedding Service", lifespan=lifespan)

# O proxy do Next.js chama este serviço internamente (loopback), CORS liberal é seguro aqui.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health.router)
app.include_router(embedding.router)
