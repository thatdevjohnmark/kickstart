# KickStart Database Schema

## Extensions

```sql
create extension if not exists pgcrypto;
```

---

# Applications

```sql
create table applications (
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

    reminder_date date,

    created_at timestamptz default now(),
    updated_at timestamptz default now()
);
```

---

# Resumes

```sql
create table resumes (
    id uuid primary key default gen_random_uuid(),

    user_id uuid not null references auth.users(id) on delete cascade,

    name text not null,

    file_url text,

    description text,

    created_at timestamptz default now()
);
```

---

# Activity Logs

```sql
create table activity_logs (
    id uuid primary key default gen_random_uuid(),

    user_id uuid not null references auth.users(id) on delete cascade,

    application_id uuid references applications(id) on delete cascade,

    action text not null,

    old_stage text,
    new_stage text,

    created_at timestamptz default now()
);
```

---

# Foreign Key

```sql
alter table applications
add constraint fk_resume
foreign key (resume_id)
references resumes(id)
on delete set null;
```

---

# Application Stages

Allowed values:

```txt
saved
applied
assessment
interviewing
offer
rejected
ghosted
```

Optional constraint:

```sql
alter table applications
add constraint applications_stage_check
check (
  stage in (
    'saved',
    'applied',
    'assessment',
    'interviewing',
    'offer',
    'rejected',
    'ghosted'
  )
);
```

---

# Indexes

```sql
create index idx_applications_user_id
on applications(user_id);

create index idx_applications_stage
on applications(stage);

create index idx_applications_created_at
on applications(created_at);

create index idx_resumes_user_id
on resumes(user_id);

create index idx_logs_user_id
on activity_logs(user_id);
```

---

# Updated At Trigger

```sql
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;
```

```sql
create trigger applications_updated_at
before update on applications
for each row
execute function update_updated_at_column();
```

---

# Row Level Security

```sql
alter table applications enable row level security;
alter table resumes enable row level security;
alter table activity_logs enable row level security;
```

---

# Applications Policies

```sql
create policy "applications_select"
on applications
for select
using (
  auth.uid() = user_id
);

create policy "applications_insert"
on applications
for insert
with check (
  auth.uid() = user_id
);

create policy "applications_update"
on applications
for update
using (
  auth.uid() = user_id
);

create policy "applications_delete"
on applications
for delete
using (
  auth.uid() = user_id
);
```

---

# Resume Policies

```sql
create policy "resumes_all"
on resumes
for all
using (
  auth.uid() = user_id
)
with check (
  auth.uid() = user_id
);
```

---

# Activity Policies

```sql
create policy "logs_all"
on activity_logs
for all
using (
  auth.uid() = user_id
)
with check (
  auth.uid() = user_id
);
```

---

# Dashboard Queries

Total Applications

```sql
select count(*)
from applications
where user_id = auth.uid();
```

Applications by Stage

```sql
select
stage,
count(*)
from applications
where user_id = auth.uid()
group by stage;
```

Response Rate

```sql
select
round(
(
count(*) filter (
where stage in ('interviewing','offer')
)::numeric
/
nullif(
count(*) filter (
where stage != 'saved'
),
0
)
) * 100,
2
)
as response_rate
from applications
where user_id = auth.uid();
```

Offers

```sql
select count(*)
from applications
where stage = 'offer'
and user_id = auth.uid();
```

