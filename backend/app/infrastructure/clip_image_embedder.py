import gc
import io

import open_clip
import torch
from PIL import Image, UnidentifiedImageError

from app.domain.exceptions import InvalidImageError


class ClipImageEmbedder:
    """Implementação da porta ImageEmbedder usando CLIP (open_clip) via torch (CPU).

    Detalhe de infraestrutura importante: os checkpoints da OpenAI usam ativação
    QuickGELU, então o nome do modelo precisa do sufixo "-quickgelu" — sem isso
    a ativação não bate com os pesos pré-treinados e os embeddings saem piores.
    """

    def __init__(self, model_name: str = "ViT-B-32-quickgelu", pretrained: str = "openai"):
        model, _, preprocess = open_clip.create_model_and_transforms(
            model_name, pretrained=pretrained
        )
        # Só a torre de imagem é usada (não há busca por texto). Descartar o resto
        # do CLIP corta centenas de MB de RAM, importante em instâncias pequenas.
        self._visual = model.visual.eval()
        del model
        gc.collect()
        self._preprocess = preprocess

    def embed(self, image_bytes: bytes) -> list[float]:
        try:
            image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
        except UnidentifiedImageError as exc:
            raise InvalidImageError("Não foi possível ler a imagem.") from exc

        tensor = self._preprocess(image).unsqueeze(0)
        with torch.inference_mode():
            features = self._visual(tensor)
            features = features / features.norm(dim=-1, keepdim=True)

        return features.squeeze(0).tolist()
