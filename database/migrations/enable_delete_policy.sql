-- Enable delete access for authenticated users
CREATE POLICY "Enable delete for authenticated users only" ON "public"."properties"
AS PERMISSIVE FOR DELETE
TO authenticated
USING (true);
