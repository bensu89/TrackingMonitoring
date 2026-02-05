-- 1. Replace 'admin@baak.ac.id' with YOUR actual email address
--    (The one you use to login to Supabase or the App)
DO $$
DECLARE
    target_email TEXT := 'bebensutara@gmail.com'; -- GANTI EMAIL INI JIKA PERLU / CHANGE THIS EMAIL
    target_user_id UUID;
BEGIN
    -- Find the user ID from auth.users
    SELECT id INTO target_user_id FROM auth.users WHERE email = target_email;

    IF target_user_id IS NOT NULL THEN
        -- Check if profile exists
        IF EXISTS (SELECT 1 FROM public.profiles WHERE id = target_user_id) THEN
            -- Update existing profile
            UPDATE public.profiles
            SET role = 'admin'
            WHERE id = target_user_id;
            RAISE NOTICE 'User % (ID: %) updated to admin.', target_email, target_user_id;
        ELSE
            -- Insert new profile if missing
            INSERT INTO public.profiles (id, username, full_name, role)
            VALUES (target_user_id, 'admin', 'Super Admin', 'admin');
            RAISE NOTICE 'Profile created for user % (ID: %) as admin.', target_email, target_user_id;
        END IF;
    ELSE
        RAISE NOTICE 'User with email % not found in auth.users. Please create the user first in the Authentication tab.', target_email;
    END IF;
END $$;
