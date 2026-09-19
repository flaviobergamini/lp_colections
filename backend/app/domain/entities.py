from dataclasses import dataclass


@dataclass(frozen=True)
class Embedding:
    """Representação vetorial de uma imagem de capa, usada para comparação por similaridade."""

    vector: list[float]

    @property
    def dimensions(self) -> int:
        return len(self.vector)
