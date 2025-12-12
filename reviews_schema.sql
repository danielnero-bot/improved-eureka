-- Create reviews table with CORRECT types
create table public.reviews (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  
  -- CHANGED: restaurant_id is now bigint to match public.restaurants(id)
  restaurant_id bigint references public.restaurants(id) on delete cascade not null,
  
  -- user_id remains uuid because auth.users(id) is uuid
  user_id uuid references auth.users(id) on delete cascade not null,
  
  rating integer check (rating >= 1 and rating <= 5) not null,
  comment text,
  
  -- Create unique constraint so a user can only review a restaurant once
  unique(user_id, restaurant_id)
);

-- Enable Row Level Security (RLS)
alter table public.reviews enable row level security;

-- Create policies

-- 1. Anyone can read reviews
create policy "Reviews are viewable by everyone" 
  on public.reviews for select 
  using ( true );

-- 2. Authenticated users can insert their own reviews
create policy "Users can insert their own reviews" 
  on public.reviews for insert 
  with check ( auth.uid() = user_id );

-- 3. Users can update their own reviews
create policy "Users can update their own reviews" 
  on public.reviews for update 
  using ( auth.uid() = user_id );

-- 4. Users can delete their own reviews
create policy "Users can delete their own reviews" 
  on public.reviews for delete 
  using ( auth.uid() = user_id );

-- OPTIONAL Trigger: Automatically update 'updated_at' column
create or replace function update_updated_at_column()
returns trigger as $$
begin
    new.updated_at = now();
    return new;
end;
$$ language plpgsql;

create trigger update_reviews_updated_at
before update on public.reviews
for each row
execute function update_updated_at_column();
