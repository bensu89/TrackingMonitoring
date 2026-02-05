-- Setup courses table and RLS policies
-- Run this in Supabase SQL Editor

-- Enable RLS on courses table
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;

-- Allow admin users to insert courses
CREATE POLICY "Admin can insert courses"
ON courses
FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'admin'
  )
);

-- Allow admin users to update courses
CREATE POLICY "Admin can update courses"
ON courses
FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'admin'
  )
);

-- Allow admin users to delete courses
CREATE POLICY "Admin can delete courses"
ON courses
FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'admin'
  )
);

-- Allow everyone to view courses (for dropdown lists)
CREATE POLICY "Everyone can read courses"
ON courses
FOR SELECT
TO authenticated
USING (true);
