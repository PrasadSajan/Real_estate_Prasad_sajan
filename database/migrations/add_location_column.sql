-- Add location column to properties table
ALTER TABLE properties 
ADD COLUMN location TEXT;

-- Update existing records to have a default value (optional but good for 'not null' constraint if we added it, but here we just add the column first)
UPDATE properties SET location = 'Pune' WHERE location IS NULL;
