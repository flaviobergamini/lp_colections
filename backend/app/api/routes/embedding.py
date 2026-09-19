from fastapi import APIRouter, Depends, File, HTTPException, Request, UploadFile

from app.api.schemas import EmbeddingResponse
from app.domain.exceptions import InvalidImageError
from app.use_cases.generate_image_embedding import GenerateImageEmbedding

router = APIRouter()


def get_generate_embedding_use_case(request: Request) -> GenerateImageEmbedding:
    return request.app.state.generate_embedding_use_case


@router.post("/embed", response_model=EmbeddingResponse)
async def embed(
    file: UploadFile = File(...),
    use_case: GenerateImageEmbedding = Depends(get_generate_embedding_use_case),
):
    if not file.content_type or not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Envie um arquivo de imagem.")

    raw = await file.read()
    try:
        embedding = use_case.execute(raw)
    except InvalidImageError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc

    return EmbeddingResponse(embedding=embedding.vector, dim=embedding.dimensions)
