from typing import Protocol


class ImageEmbedder(Protocol):
    """Porta do domínio: transforma bytes de uma imagem em um vetor de características.

    Implementações concretas (ex: CLIP) vivem na camada de infraestrutura e são
    injetadas via o container de composição em main.py — o domínio e os casos de
    uso não sabem (nem precisam saber) que modelo ou biblioteca é usado.
    """

    def embed(self, image_bytes: bytes) -> list[float]: ...
