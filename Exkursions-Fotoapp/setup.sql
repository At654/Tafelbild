-- Einmalig in Supabase ausführen: SQL Editor > New query > einfügen > Run
create table if not exists posts (
  id uuid primary key default gen_random_uuid(),
  klasse text not null,
  autor text not null,
  text text default '',
  bild text not null,
  pfad text not null,
  created_at timestamptz default now()
);
create table if not exists comments (
  id uuid primary key default gen_random_uuid(),
  post_id uuid references posts(id) on delete cascade,
  autor text not null,
  text text not null,
  created_at timestamptz default now()
);
create table if not exists likes (
  post_id uuid references posts(id) on delete cascade,
  autor text not null,
  primary key (post_id, autor)
);
alter table posts enable row level security;
alter table comments enable row level security;
alter table likes enable row level security;
create policy "alle lesen posts" on posts for select using (true);
create policy "alle schreiben posts" on posts for insert with check (true);
create policy "alle loeschen posts" on posts for delete using (true);
create policy "alle lesen comments" on comments for select using (true);
create policy "alle schreiben comments" on comments for insert with check (true);
create policy "alle loeschen comments" on comments for delete using (true);
create policy "alle lesen likes" on likes for select using (true);
create policy "alle schreiben likes" on likes for insert with check (true);
create policy "alle loeschen likes" on likes for delete using (true);
insert into storage.buckets (id, name, public) values ('fotos','fotos',true) on conflict do nothing;
create policy "fotos lesen" on storage.objects for select using (bucket_id='fotos');
create policy "fotos hochladen" on storage.objects for insert with check (bucket_id='fotos');
create policy "fotos loeschen" on storage.objects for delete using (bucket_id='fotos');
