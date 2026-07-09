insert into public.families (id, name)
values ('00000000-0000-0000-0000-000000000001', '暖暖家')
on conflict (id) do nothing;

insert into public.profiles (id, family_id, display_name, role)
values
  ('00000000-0000-0000-0000-000000000101', '00000000-0000-0000-0000-000000000001', '爸爸', 'father'),
  ('00000000-0000-0000-0000-000000000102', '00000000-0000-0000-0000-000000000001', '妈妈', 'mother'),
  ('00000000-0000-0000-0000-000000000103', '00000000-0000-0000-0000-000000000001', '暖暖', 'child')
on conflict (id) do nothing;
