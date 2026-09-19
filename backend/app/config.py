from dataclasses import dataclass


@dataclass(frozen=True)
class Settings:
    model_name: str = "ViT-B-32-quickgelu"
    pretrained: str = "openai"


settings = Settings()
