# Imagem única para o Render: Next.js (frontend) + FastAPI/CLIP (backend),
# orquestrados pelo supervisord dentro do mesmo container.

FROM node:22-slim

RUN apt-get update && apt-get install -y --no-install-recommends \
    python3 \
    python3-pip \
    python3-venv \
    supervisor \
    libgomp1 \
    curl \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# --- Backend Python ---
COPY backend/requirements.txt ./backend/requirements.txt
RUN pip3 install --no-cache-dir --break-system-packages -r backend/requirements.txt

COPY backend/app ./backend/app

# Baixa os pesos do CLIP no build: o startup não depende de rede e fica bem mais rápido.
RUN cd backend && python3 -c "from app.config import settings; from app.infrastructure.clip_image_embedder import ClipImageEmbedder; ClipImageEmbedder(settings.model_repo, settings.model_file)"

# --- Frontend Next.js ---
COPY frontend/package.json frontend/package-lock.json* ./frontend/
RUN cd frontend && npm ci

COPY frontend ./frontend

# Variáveis NEXT_PUBLIC_* são embutidas no bundle já em tempo de build.
# O Render injeta as env vars configuradas no serviço também como build args.
ARG NEXT_PUBLIC_SUPABASE_URL
ARG NEXT_PUBLIC_SUPABASE_ANON_KEY
ENV NEXT_PUBLIC_SUPABASE_URL=$NEXT_PUBLIC_SUPABASE_URL
ENV NEXT_PUBLIC_SUPABASE_ANON_KEY=$NEXT_PUBLIC_SUPABASE_ANON_KEY

RUN cd frontend && npm run build

# --- Supervisor ---
COPY docker/supervisord.conf /etc/supervisor/conf.d/supervisord.conf

ENV NODE_ENV=production
ENV PYTHON_BACKEND_URL=http://127.0.0.1:8000

EXPOSE 3000

CMD ["supervisord", "-c", "/etc/supervisor/conf.d/supervisord.conf"]
