create table public.tasks (
  id uuid primary key default gen_random_uuid(),

  title text not null
    check (
      char_length(trim(title)) between 1 and 150
    ),

  description text,

  status text not null default 'todo'
    check (
      status in (
        'todo',
        'in_progress',
        'in_review',
        'done'
      )
    ),

  priority text not null default 'normal'
    check (
      priority in (
        'low',
        'normal',
        'high'
      )
    ),

  due_date date,

  user_id uuid not null
    references auth.users(id)
    on delete cascade,

  created_at timestamptz not null default now(),

  updated_at timestamptz not null default now()
);

alter table public.tasks
enable row level security;

create policy "Users can view their own tasks"
on public.tasks
for select
to authenticated
using (
  auth.uid() = user_id
);

create policy "Users can create their own tasks"
on public.tasks
for insert
to authenticated
with check (
  auth.uid() = user_id
);

create policy "Users can update their own tasks"
on public.tasks
for update
to authenticated
using (
  auth.uid() = user_id
)
with check (
  auth.uid() = user_id
);

create policy "Users can delete their own tasks"
on public.tasks
for delete
to authenticated
using (
  auth.uid() = user_id
);