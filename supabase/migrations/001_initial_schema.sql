-- KickStart Database Migration
-- Run this in your Supabase SQL Editor

-- Enable UUID extension
create extension if not exists pgcrypto;

-- Create applications table
create table if not exists applications (
    id uuid primary key default gen_random_uuid(),
    user_id uuid not null references auth.users(id) on delete cascade,
    company text not null,
    role text not null,
    stage text not null default 'saved',
    location text,
    salary text,
    job_url text,
    notes text,
    resume_id uuid,
    date_applied date,
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);

-- Create resumes table
create table if not exists resumes (
    id uuid primary key default gen_random_uuid(),
    user_id uuid not null references auth.users(id) on delete cascade,
    name text not null,
    file_url text,
    description text,
    created_at timestamptz default now()
);

-- Create activity_logs table
create table if not exists activity_logs (
    id uuid primary key default gen_random_uuid(),
    user_id uuid not null references auth.users(id) on delete cascade,
    application_id uuid references applications(id) on delete cascade,
    action text not null,
    old_stage text,
    new_stage text,
    created_at timestamptz default now()
);

-- Add foreign key constraint safely
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'fk_resume') THEN
        ALTER TABLE applications
        ADD CONSTRAINT fk_resume
        FOREIGN KEY (resume_id)
        REFERENCES resumes(id)
        ON DELETE SET NULL;
    END IF;
END
$$;

-- Add stage check constraint safely
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'applications_stage_check') THEN
        ALTER TABLE applications
        ADD CONSTRAINT applications_stage_check
        CHECK (
          stage in (
            'saved', 'applied', 'assessment', 'interviewing', 
            'offer', 'rejected', 'ghosted'
          )
        );
    END IF;
END
$$;

-- Create indexes
create index if not exists idx_applications_user_id on applications(user_id);
create index if not exists idx_applications_stage on applications(stage);
create index if not exists idx_applications_created_at on applications(created_at);
create index if not exists idx_resumes_user_id on resumes(user_id);
create index if not exists idx_logs_user_id on activity_logs(user_id);

-- Create updated_at trigger function
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Create trigger for applications
drop trigger if exists applications_updated_at on applications;
create trigger applications_updated_at
before update on applications
for each row
execute function update_updated_at_column();

-- Enable Row Level Security
alter table applications enable row level security;
alter table resumes enable row level security;
alter table activity_logs enable row level security;

-- Applications Policies
drop policy if exists "applications_select" on applications;
create policy "applications_select"
on applications
for select
using (auth.uid() = user_id);

drop policy if exists "applications_insert" on applications;
create policy "applications_insert"
on applications
for insert
with check (auth.uid() = user_id);

drop policy if exists "applications_update" on applications;
create policy "applications_update"
on applications
for update
using (auth.uid() = user_id);

drop policy if exists "applications_delete" on applications;
create policy "applications_delete"
on applications
for delete
using (auth.uid() = user_id);

-- Resume Policies
drop policy if exists "resumes_all" on resumes;
create policy "resumes_all"
on resumes
for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

-- Activity Logs Policies
drop policy if exists "logs_all" on activity_logs;
create policy "logs_all"
on activity_logs
for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);