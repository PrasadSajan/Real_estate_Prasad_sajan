-- Enable RLS
alter table properties enable row level security;

-- Create policy for public read access
create policy "Public read access"
  on properties for select
  using ( true );
