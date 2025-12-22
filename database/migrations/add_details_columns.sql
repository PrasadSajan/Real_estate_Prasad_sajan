-- Add bedroom, bathroom, and area columns to properties table
ALTER TABLE properties
ADD COLUMN videos text[] DEFAULT '{}',
ADD COLUMN bedrooms integer DEFAULT 0,
ADD COLUMN bathrooms integer DEFAULT 0,
ADD COLUMN area_sqft integer;

-- Update RLS to allow these new columns (implicit in current policies, but good habit)
