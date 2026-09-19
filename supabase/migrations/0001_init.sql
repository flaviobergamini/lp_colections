-- Coleção de LPs: schema inicial
-- Requer a extensão pgvector (disponível por padrão nos projetos Supabase)
create extension if not exists vector;

create table if not exists public.records (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  artist text not null,
  title text not null,
  year int,
  label text,
  genre text,
  notes text,
  cover_path text not null,
  embedding vector(512) not null,
  created_at timestamptz not null default now()
);

create index if not exists records_user_id_idx on public.records (user_id);

-- Busca por texto (artista/título/gravadora/gênero)
create index if not exists records_search_idx on public.records
  using gin (to_tsvector('portuguese', coalesce(artist, '') || ' ' || coalesce(title, '') || ' ' || coalesce(label, '') || ' ' || coalesce(genre, '')));

-- Busca por similaridade de imagem (cosine distance)
create index if not exists records_embedding_idx on public.records
  using hnsw (embedding vector_cosine_ops);

alter table public.records enable row level security;

create policy "records_select_own" on public.records
  for select using (auth.uid() = user_id);

create policy "records_insert_own" on public.records
  for insert with check (auth.uid() = user_id);

create policy "records_update_own" on public.records
  for update using (auth.uid() = user_id);

create policy "records_delete_own" on public.records
  for delete using (auth.uid() = user_id);

-- RPC: busca por similaridade de foto, restrita ao usuário autenticado
create or replace function public.match_records(
  query_embedding vector(512),
  match_count int default 5
)
returns table (
  id uuid,
  artist text,
  title text,
  year int,
  label text,
  genre text,
  notes text,
  cover_path text,
  created_at timestamptz,
  similarity float
)
language sql
stable
security definer
set search_path = public
as $$
  select
    r.id, r.artist, r.title, r.year, r.label, r.genre, r.notes, r.cover_path, r.created_at,
    1 - (r.embedding <=> query_embedding) as similarity
  from public.records r
  where r.user_id = auth.uid()
  order by r.embedding <=> query_embedding
  limit match_count;
$$;

-- Busca por texto simples (ilike), restrita ao usuário autenticado
create or replace function public.search_records(query text)
returns setof public.records
language sql
stable
security definer
set search_path = public
as $$
  select *
  from public.records
  where user_id = auth.uid()
    and (
      artist ilike '%' || query || '%'
      or title ilike '%' || query || '%'
      or label ilike '%' || query || '%'
      or genre ilike '%' || query || '%'
    )
  order by created_at desc;
$$;

-- Storage: bucket privado para as capas, um objeto por usuário em <user_id>/<arquivo>
insert into storage.buckets (id, name, public)
values ('covers', 'covers', false)
on conflict (id) do nothing;

create policy "covers_select_own" on storage.objects
  for select using (bucket_id = 'covers' and (storage.foldername(name))[1] = auth.uid()::text);

create policy "covers_insert_own" on storage.objects
  for insert with check (bucket_id = 'covers' and (storage.foldername(name))[1] = auth.uid()::text);

create policy "covers_delete_own" on storage.objects
  for delete using (bucket_id = 'covers' and (storage.foldername(name))[1] = auth.uid()::text);
