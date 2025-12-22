-- Create a new bucket for property images
insert into storage.buckets (id, name, public)
values ('property-images', 'property-images', true)
on conflict (id) do nothing;

-- Set up security policies for the bucket

-- 1. Allow public access to view images
create policy "Public Access"
  on storage.objects for select
  using ( bucket_id = 'property-images' );

-- 2. Allow authenticated users to upload images
create policy "Authenticated Users can insert images"
  on storage.objects for insert
  with check ( bucket_id = 'property-images' and auth.role() = 'authenticated' );

-- 3. Allow authenticated users to update/delete images (optional, good for management)
create policy "Authenticated Users can update images"
  on storage.objects for update
  using ( bucket_id = 'property-images' and auth.role() = 'authenticated' );

create policy "Authenticated Users can delete images"
  on storage.objects for delete
  using ( bucket_id = 'property-images' and auth.role() = 'authenticated' );
