-- 1. Create LECTURERS Table
-- This table is independent of auth.users to allow unlimited data entry
CREATE TABLE public.lecturers (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  nidn text UNIQUE NOT NULL,
  name text NOT NULL,
  jabatan text,
  homebase text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Enable RLS
ALTER TABLE public.lecturers ENABLE ROW LEVEL SECURITY;

-- 3. Policies for Lecturers
-- Everyone (authenticated) can view
CREATE POLICY "Everyone can view lecturers" 
ON public.lecturers FOR SELECT 
TO authenticated 
USING (true);

-- Only Admins can insert/update/delete
CREATE POLICY "Admins can manage lecturers" 
ON public.lecturers FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'admin'
  )
);

-- 4. Update SCHEDULES Table Relationship
-- Remove the old link to profiles and link to lecturers instead

-- First, drop the old constraint if it exists (name might vary, generic drop is safer if we knew name, but let's try standard naming or just alter column)
ALTER TABLE public.schedules 
DROP CONSTRAINT IF EXISTS schedules_lecturer_id_fkey;

-- Add new constraint
ALTER TABLE public.schedules
ADD CONSTRAINT schedules_lecturer_id_fkey 
FOREIGN KEY (lecturer_id) 
REFERENCES public.lecturers(id)
ON DELETE SET NULL;
