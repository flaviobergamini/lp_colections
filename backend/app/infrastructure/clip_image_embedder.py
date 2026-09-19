import io

import numpy as np
import onnxruntime as ort
from huggingface_hub import hf_hub_download
from PIL import Image, ImageOps, UnidentifiedImageError

from app.domain.exceptions import InvalidImageError

_MEAN = np.array([0.48145466, 0.4578275, 0.40821073], dtype=np.float32)
_STD = np.array([0.26862954, 0.26130258, 0.27577711], dtype=np.float32)
_SIZE = 224


class ClipImageEmbedder:
    """Implementação da porta ImageEmbedder: torre de imagem do CLIP ViT-B/32 (OpenAI) via ONNX Runtime.

    Usa ONNX Runtime em vez de PyTorch de propósito: o pico de RAM no carregamento
    cai de ~1,5 GB para ~0,5 GB e produz o mesmo embedding (cosseno 1.0 com o
    open_clip original), o que importa em instâncias pequenas do Render.
    """

    def __init__(self, repo_id: str, filename: str):
        model_path = hf_hub_download(repo_id, filename)
        options = ort.SessionOptions()
        options.intra_op_num_threads = 1
        self._session = ort.InferenceSession(
            model_path, options, providers=["CPUExecutionProvider"]
        )
        self._input_name = self._session.get_inputs()[0].name

    def embed(self, image_bytes: bytes) -> list[float]:
        try:
            image = Image.open(io.BytesIO(image_bytes))
            image = ImageOps.exif_transpose(image).convert("RGB")
        except UnidentifiedImageError as exc:
            raise InvalidImageError("Não foi possível ler a imagem.") from exc

        (embeds,) = self._session.run(None, {self._input_name: self._preprocess(image)})
        vector = embeds[0]
        vector = vector / np.linalg.norm(vector)
        return vector.astype(np.float64).tolist()

    @staticmethod
    def _preprocess(image: Image.Image) -> np.ndarray:
        # Mesmo pré-processamento do CLIP: resize bicúbico do lado menor, crop central, normalização.
        width, height = image.size
        scale = _SIZE / min(width, height)
        image = image.resize(
            (max(_SIZE, round(width * scale)), max(_SIZE, round(height * scale))),
            Image.BICUBIC,
        )
        width, height = image.size
        left, top = (width - _SIZE) // 2, (height - _SIZE) // 2
        image = image.crop((left, top, left + _SIZE, top + _SIZE))

        pixels = (np.asarray(image, dtype=np.float32) / 255.0 - _MEAN) / _STD
        return pixels.transpose(2, 0, 1)[None]
