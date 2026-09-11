create table if not exists tests (id uuid primary key default gen_random_uuid(), title text not null, category text, total_questions int default 0, duration_minutes int default 150, published boolean default false, created_at timestamptz default now());
create table if not exists questions (id uuid primary key default gen_random_uuid(), test_id uuid references tests(id) on delete cascade, question_number int, question text not null, option_a text, option_b text, option_c text, option_d text, correct_answer text, marks numeric default 1, negative_marks numeric default 0, explanation text);
create table if not exists attempts (id uuid primary key default gen_random_uuid(), test_id uuid references tests(id) on delete cascade, user_id uuid references auth.users(id) on delete cascade, score numeric default 0, correct int default 0, wrong int default 0, unanswered int default 0, time_taken_seconds int default 0, created_at timestamptz default now());
alter table tests enable row level security; alter table questions enable row level security; alter table attempts enable row level security;
create policy "published tests readable" on tests for select using (published=true or auth.uid() is not null);
create policy "questions readable by logged users" on questions for select using (auth.uid() is not null);
create policy "students insert attempts" on attempts for insert with check (auth.uid()=user_id);
create policy "students read own attempts" on attempts for select using (auth.uid()=user_id);
