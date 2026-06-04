-- Supabase & pgvector Schema Setup
-- Run this in your Supabase SQL Editor to enable semantic search and telemetry tracking.

-- 1. Enable pgvector extension
create extension if not exists vector;

-- 2. Document Embeddings (RAG Pipeline)
create table if not exists public.semantic_memory (
  id uuid default gen_random_uuid() primary key,
  content text not null,
  metadata jsonb default '{}'::jsonb not null,
  embedding vector(1536), -- Standard OpenAI (text-embedding-3-small) / Gemini vector size
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. Chat logs & intent metadata (optional portfolio assistant telemetry)
create table if not exists public.chat_sessions (
  id uuid default gen_random_uuid() primary key,
  intent_tags text[],
  messages jsonb default '[]'::jsonb not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. Semantic Search Vector Match Function
create or replace function match_semantic_memory (
  query_embedding vector(1536),
  match_threshold float,
  match_count int
)
returns table (
  id uuid,
  content text,
  metadata jsonb,
  similarity float
)
language sql stable
as $$
  select
    semantic_memory.id,
    semantic_memory.content,
    semantic_memory.metadata,
    1 - (semantic_memory.embedding <=> query_embedding) as similarity
  from semantic_memory
  where 1 - (semantic_memory.embedding <=> query_embedding) > match_threshold
  order by semantic_memory.embedding <=> query_embedding
  limit match_count;
$$;

-- 5. Row Level Security (RLS) Policies
alter table public.semantic_memory enable row level security;
alter table public.chat_sessions enable row level security;

create policy "Allow anonymous insertions for sessions" on public.chat_sessions
  for insert with check (true);

-- Public can read semantic memory items (for portfolio assistant RAG queries)
create policy "Allow public read access to semantic memory" on public.semantic_memory
  for select using (true);
