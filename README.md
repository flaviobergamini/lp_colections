# Bergas — Coleção de LPs

Web app (PWA) para catalogar sua coleção de discos de vinil por foto, e checar
por foto se você já tem um disco antes de comprá-lo de novo.

- **Frontend:** Next.js 16 (App Router, TypeScript, Tailwind), PWA instalável.
- **Backend:** Python (FastAPI) gerando embeddings de imagem com CLIP (open-clip),
  usado só para a busca por foto.
- **Dados:** Supabase (Postgres + pgvector para similaridade de imagem, Storage
  para as fotos de capa, Auth para login).
- **Deploy:** um único serviço Docker no Render (Next.js e o backend Python
  rodam juntos no mesmo container, orquestrados pelo `supervisord`).

## 1. Configurar o Supabase

1. Crie um projeto em https://supabase.com.
2. No SQL editor, rode o conteúdo de [`supabase/migrations/0001_init.sql`](supabase/migrations/0001_init.sql).
   Isso cria a tabela `records`, habilita `pgvector`, cria as funções de busca
   (`match_records` por foto, `search_records` por texto), o bucket de storage
   `covers` e as políticas de RLS (cada usuário só vê os próprios discos).
3. Em **Project Settings → API**, copie a `Project URL` e a `anon public key`.
4. (Opcional) Em **Authentication → Providers**, desative a confirmação por
   e-mail se quiser logar imediatamente após criar a conta — é uma coleção
   pessoal, então normalmente só existirá um usuário.

## 2. Rodar localmente

Backend (Python):

```bash
cd backend
python3 -m venv .venv && source .venv/bin/activate  # no Windows: .venv\Scripts\activate
pip install -r requirements.txt --extra-index-url https://download.pytorch.org/whl/cpu
uvicorn app.main:app --reload --port 8000
```

Frontend (Next.js), em outro terminal:

```bash
cd frontend
cp ../.env.example .env.local   # preencha com as chaves do Supabase
npm install
npm run dev
```

Abra http://localhost:3000 — o `next.config.js` já faz proxy de `/py/*` para
o backend Python em `http://127.0.0.1:8000`.

## 3. Deploy no Render (serviço único)

1. Suba este repositório no GitHub.
2. No Render, crie um **Blueprint** apontando para o repo (ele lê o
   [`render.yaml`](render.yaml)) — ou crie manualmente um **Web Service** com
   `env: docker` e o `Dockerfile` da raiz.
3. Configure as variáveis de ambiente do serviço:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Use o plano **Standard** (ou superior) do Render. O modelo CLIP precisa de
   mais RAM do que o free tier (512 MB) oferece — em planos menores o processo
   Python pode ser encerrado por falta de memória (OOM).
5. O Render injeta a variável `PORT`; o `supervisord` já inicia o Next.js
   nessa porta e mantém o backend Python interno em `127.0.0.1:8000`.

> **Nota:** variáveis `NEXT_PUBLIC_*` são embutidas no bundle do Next.js já
> durante o `npm run build`, não em tempo de execução. O Render injeta
> automaticamente as env vars do serviço como build args do Docker, e o
> `Dockerfile` já declara `ARG`/`ENV` para repassá-las — por isso é importante
> configurar `NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_ANON_KEY` no
> serviço *antes* do primeiro deploy.

## Como funciona a busca por foto

- Ao **adicionar um disco**, a foto da capa é enviada ao Supabase Storage e o
  backend Python gera um embedding CLIP (vetor de 512 dimensões) que é salvo
  junto com o registro no Postgres.
- Ao **buscar por foto** (antes de comprar), a foto tirada é convertida no
  mesmo tipo de embedding e comparada com os embeddings salvos via
  similaridade de cosseno (`pgvector`, função `match_records`). O app mostra
  o percentual de similaridade dos discos mais parecidos e indica se você
  provavelmente já tem aquele disco.
- A busca por texto usa `ilike` sobre artista, título, gravadora e gênero
  (função `search_records`).

## Arquitetura

Backend e frontend seguem Clean Architecture: regra de dependência única em
direção ao domínio, e um único ponto de composição por app que conhece as
implementações concretas.

```
domínio          Entidades e portas (interfaces). Zero dependência de framework/lib externa.
casos de uso      Orquestram o domínio. Dependem só das portas, nunca de infraestrutura.
infraestrutura    Implementações concretas das portas (Supabase, CLIP/torch, HTTP).
api / apresentação  Adaptadores de entrada (rotas FastAPI, páginas Next.js). Chamam casos de uso.
composição        main.py (backend) / infrastructure/container.ts (frontend) — só aqui
                  tudo se conhece e é montado.
```

**Backend** ([backend/app](backend/app)):

```
domain/           entities.py (Embedding), ports.py (ImageEmbedder), exceptions.py
use_cases/        generate_image_embedding.py
infrastructure/   clip_image_embedder.py — implementação da porta ImageEmbedder com CLIP/torch
api/              routes/ (health, embedding) + schemas.py (Pydantic)
main.py           composição: instancia ClipImageEmbedder, injeta no caso de uso via app.state
config.py         Settings (nome do modelo CLIP, etc.)
```

Trocar CLIP por outro modelo/serviço de embedding no futuro significa criar uma
nova classe em `infrastructure/` que implemente `ImageEmbedder` e trocar uma
linha em `main.py` — nada em `domain/`, `use_cases/` ou `api/` muda.

**Frontend** ([frontend/src](frontend/src)):

```
domain/           entities/record.ts, repositories/*.ts (RecordRepository, CoverStorage,
                  AuthProvider — interfaces), services/embedding-service.ts
application/      casos de uso: records/ (list, search por texto/foto, add, update, delete,
                  get) e auth/ (sign-in, sign-up, sign-out)
infrastructure/   supabase/ (implementações das portas com Supabase + mappers linha↔entidade),
                  embedding/http-embedding-service.ts (chama o backend Python),
                  container.ts — composição: monta as implementações e expõe useAppContainer()
app/, components/ apresentação (rotas Next.js e componentes React). Só importam
                  @/infrastructure/container e @/application/*, nunca o cliente do Supabase direto.
```

Páginas e componentes não sabem que o banco é o Supabase nem que a busca por
foto usa CLIP — só conhecem as portas do domínio. Isso facilita testar os
casos de uso com implementações falsas e trocar Supabase/CLIP por outra coisa
sem reescrever a UI.

## Estrutura

```
backend/          FastAPI + CLIP em Clean Architecture (ver Arquitetura acima)
frontend/         Next.js App Router + Tailwind + PWA, também em Clean Architecture
supabase/         Migrations SQL (schema, pgvector, RLS, RPCs)
docker/           supervisord.conf usado pelo Dockerfile
Dockerfile        Build único: frontend + backend no mesmo container
render.yaml       Blueprint de deploy no Render
```
