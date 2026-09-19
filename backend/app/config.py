from dataclasses import dataclass


@dataclass(frozen=True)
class Settings:
    # CLIP ViT-B/32 (pesos da OpenAI) exportado para ONNX, torre de imagem apenas.
    model_repo: str = "Xenova/clip-vit-base-patch32"
    model_file: str = "onnx/vision_model.onnx"


settings = Settings()
