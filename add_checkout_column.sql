-- Add check_out_time column to attendance_logs
ALTER TABLE public.attendance_logs
ADD COLUMN IF NOT EXISTS check_out_time timestamp with time zone;
