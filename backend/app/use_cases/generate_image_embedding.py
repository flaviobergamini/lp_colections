from app.domain.entities import Embedding
from app.domain.ports import ImageEmbedder


class GenerateImageEmbedding:
    """Caso de uso: gerar o embedding de uma foto de capa de disco.

    Depende apenas da porta ImageEmbedder (domínio), nunca de FastAPI, torch
    ou open_clip diretamente — isso é o que permite trocar o modelo de visão
    no futuro sem tocar nesta classe.
    """

    def __init__(self, embedder: ImageEmbedder):
        self._embedder = embedder

    def execute(self, image_bytes: bytes) -> Embedding:
        vector = self._embedder.embed(image_bytes)
        return Embedding(vector=vector)
