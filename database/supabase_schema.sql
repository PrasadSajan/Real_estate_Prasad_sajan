-- Create properties table
create table public.properties (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  title text not null,
  title_mr text,
  description text not null,
  description_mr text,
  price text not null,
  imageSrc text default 'https://placehold.co/600x400'::text,
  imageAlt text default 'Property Image'::text
);

-- Enable Row Level Security (RLS)
alter table public.properties enable row level security;

-- Create policies
-- 1. Allow public read access
create policy "Public properties are viewable by everyone."
  on public.properties for select
  using ( true );

-- 2. Allow authenticated users (Admins) to insert/update/delete
create policy "Admins can insert properties."
  on public.properties for insert
  with check ( auth.role() = 'authenticated' );

create policy "Admins can update properties."
  on public.properties for update
  using ( auth.role() = 'authenticated' );

create policy "Admins can delete properties."
  on public.properties for delete
  using ( auth.role() = 'authenticated' );
