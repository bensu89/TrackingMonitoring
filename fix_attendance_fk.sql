-- Fix attendance_logs foreign key to reference lecturers table instead of profiles
-- This resolves the "violates foreign key constraint" error
ALTER TABLE public.attendance_logs
DROP CONSTRAINT IF EXISTS attendance_logs_lecturer_id_fkey;

ALTER TABLE public.attendance_logs
ADD CONSTRAINT attendance_logs_lecturer_id_fkey
FOREIGN KEY (lecturer_id)
REFERENCES public.lecturers(id)
ON DELETE SET NULL;
