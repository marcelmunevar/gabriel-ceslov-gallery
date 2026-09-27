create policy "Owners can read portfolio images"
	on storage.objects
	for select
	to authenticated
	using (
		bucket_id = 'portfolio-images'
		and (storage.foldername(name))[1] = (select auth.uid())::text
	);

create policy "Owners can upload portfolio images"
	on storage.objects
	for insert
	to authenticated
	with check (
		bucket_id = 'portfolio-images'
		and (storage.foldername(name))[1] = (select auth.uid())::text
	);

create policy "Owners can update portfolio images"
	on storage.objects
	for update
	to authenticated
	using (
		bucket_id = 'portfolio-images'
		and (storage.foldername(name))[1] = (select auth.uid())::text
	)
	with check (
		bucket_id = 'portfolio-images'
		and (storage.foldername(name))[1] = (select auth.uid())::text
	);

create policy "Owners can delete portfolio images"
	on storage.objects
	for delete
	to authenticated
	using (
		bucket_id = 'portfolio-images'
		and (storage.foldername(name))[1] = (select auth.uid())::text
	);
