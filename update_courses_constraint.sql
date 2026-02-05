-- Drop the unique constraint on the 'code' column in the 'courses' table
-- This allows multiple courses to have the same code (e.g. for different departments/types)

ALTER TABLE public.courses DROP CONSTRAINT IF EXISTS courses_code_key;
