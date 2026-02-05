-- Update the handle_new_user function to include nip_nim
-- This allows saving the Student ID (NIM) automatically upon registration

create or replace function public.handle_new_user() 
returns trigger as $$
begin
  insert into public.profiles (id, full_name, role, nip_nim)
  values (
    new.id,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'role',
    new.raw_user_meta_data->>'nip_nim'
  );
  return new;
end;
$$ language plpgsql security definer;
