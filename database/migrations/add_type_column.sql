-- Add 'type' column to properties table
alter table properties 
add column type text;

-- Optional: Add constraint to ensure valid types if desired, 
-- but text is flexible for now.
-- alter table properties 
-- add constraint valid_type check (type in ('rowhouse', 'flat', 'plot', 'land', 'commercial'));
