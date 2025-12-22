-- Add images column as text array
alter table public.properties 
add column if not exists images text[] default array[]::text[];

-- Migrate existing imageSrc to images array (if images matches default empty)
update public.properties
set images = array[imagesrc]
where imagesrc is not null and (images is null or cardinality(images) = 0);
