create table public.page_drafts (
	id uuid primary key default gen_random_uuid(),
	slug text not null unique,
	owner_id uuid not null references auth.users (id) on delete cascade,
	content jsonb not null,
	created_at timestamptz not null default now(),
	updated_at timestamptz not null default now(),
	constraint page_drafts_content_is_object
		check (jsonb_typeof(content) = 'object')
);

create table public.published_pages (
	id uuid primary key default gen_random_uuid(),
	slug text not null unique,
	owner_id uuid not null references auth.users (id) on delete cascade,
	content jsonb not null,
	published_at timestamptz not null default now(),
	created_at timestamptz not null default now(),
	updated_at timestamptz not null default now(),
	constraint published_pages_content_is_object
		check (jsonb_typeof(content) = 'object')
);

create index page_drafts_owner_id_idx on public.page_drafts (owner_id);
create index published_pages_owner_id_idx on public.published_pages (owner_id);

alter table public.page_drafts enable row level security;
alter table public.published_pages enable row level security;

grant usage on schema public to anon, authenticated;

grant select, insert, update, delete
	on public.page_drafts to authenticated;
grant select (slug, content, published_at, created_at, updated_at)
	on public.published_pages to anon;
grant select, insert, update, delete
	on public.published_pages to authenticated;

create policy "Owners can manage page drafts"
	on public.page_drafts
	for all
	to authenticated
	using ((select auth.uid()) = owner_id)
	with check ((select auth.uid()) = owner_id);

create policy "Published pages are publicly readable"
	on public.published_pages
	for select
	to anon, authenticated
	using (true);

create policy "Owners can manage published pages"
	on public.published_pages
	for all
	to authenticated
	using ((select auth.uid()) = owner_id)
	with check ((select auth.uid()) = owner_id);
