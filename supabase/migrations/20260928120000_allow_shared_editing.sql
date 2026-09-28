-- Allow any authenticated user to manage page content and portfolio images,
-- not just the row/file's original owner, so multiple editors can collaborate.

drop policy "Owners can manage page drafts" on public.page_drafts;
drop policy "Owners can manage published pages" on public.published_pages;

create policy "Authenticated users can manage page drafts"
	on public.page_drafts
	for all
	to authenticated
	using (true)
	with check (true);

create policy "Authenticated users can manage published pages"
	on public.published_pages
	for all
	to authenticated
	using (true)
	with check (true);

drop policy "Owners can read portfolio images" on storage.objects;
drop policy "Owners can upload portfolio images" on storage.objects;
drop policy "Owners can update portfolio images" on storage.objects;
drop policy "Owners can delete portfolio images" on storage.objects;

create policy "Authenticated users can read portfolio images"
	on storage.objects
	for select
	to authenticated
	using (bucket_id = 'portfolio-images');

create policy "Authenticated users can upload portfolio images"
	on storage.objects
	for insert
	to authenticated
	with check (bucket_id = 'portfolio-images');

create policy "Authenticated users can update portfolio images"
	on storage.objects
	for update
	to authenticated
	using (bucket_id = 'portfolio-images')
	with check (bucket_id = 'portfolio-images');

create policy "Authenticated users can delete portfolio images"
	on storage.objects
	for delete
	to authenticated
	using (bucket_id = 'portfolio-images');
