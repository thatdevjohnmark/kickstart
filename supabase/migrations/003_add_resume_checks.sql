create table resume_checks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  filename text not null,
  extracted_text text not null,
  score integer not null,
  checks jsonb not null,
  recommendations text[] not null,
  missing_keywords text[] not null default '{}',
  job_description text,
  created_at timestamptz default now()
);

alter table resume_checks enable row level security;

create policy "Users can access own resume checks"
on resume_checks
for all
using (auth.uid() = user_id);

create index idx_resume_checks_user_id on resume_checks(user_id);
