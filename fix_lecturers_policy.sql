-- Allow public access to lecturers table so Monitoring Dashboard works without login
DROP POLICY IF EXISTS "Everyone can view lecturers" ON public.lecturers;

CREATE POLICY "Public and Auth can view lecturers" 
ON public.lecturers FOR SELECT 
TO anon, authenticated
USING (true);
