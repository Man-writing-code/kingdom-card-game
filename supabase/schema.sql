-- Kingdom private-room multiplayer schema.
-- Run this entire file once in Supabase Dashboard -> SQL Editor.

create extension if not exists pgcrypto;

create table if not exists public.kingdom_matches (
  id uuid primary key default gen_random_uuid(),
  room_code text not null unique check (room_code ~ '^[A-Z0-9]{6}$'),
  host_id uuid not null references auth.users(id) on delete cascade,
  guest_id uuid references auth.users(id) on delete set null,
  host_name text not null check (char_length(host_name) between 1 and 24),
  guest_name text check (guest_name is null or char_length(guest_name) between 1 and 24),
  host_deck jsonb not null,
  guest_deck jsonb,
  decree_id text not null,
  status text not null default 'waiting' check (status in ('waiting','playing','finished')),
  phase text not null default 'lobby' check (phase in ('lobby','planning','resolving','finished')),
  round integer not null default 0,
  version integer not null default 0,
  game_state jsonb,
  revealed_plans jsonb,
  winner text check (winner is null or winner in ('host','guest','draw')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.kingdom_plans (
  match_id uuid not null references public.kingdom_matches(id) on delete cascade,
  player_id uuid not null references auth.users(id) on delete cascade,
  seat text not null check (seat in ('host','guest')),
  round integer not null,
  side_state jsonb not null,
  committed_at timestamptz not null default now(),
  primary key (match_id, player_id)
);

alter table public.kingdom_matches enable row level security;
alter table public.kingdom_plans enable row level security;

drop policy if exists "players can read their kingdom match" on public.kingdom_matches;
create policy "players can read their kingdom match" on public.kingdom_matches
for select to authenticated using (auth.uid() = host_id or auth.uid() = guest_id);

drop policy if exists "host can advance kingdom match" on public.kingdom_matches;
create policy "host can advance kingdom match" on public.kingdom_matches
for update to authenticated using (auth.uid() = host_id) with check (auth.uid() = host_id);

drop policy if exists "players can read only their own plan" on public.kingdom_plans;
create policy "players can read only their own plan" on public.kingdom_plans
for select to authenticated using (auth.uid() = player_id);

create or replace function public.create_kingdom_match(p_name text, p_deck jsonb, p_decree text)
returns public.kingdom_matches
language plpgsql security definer set search_path = public
as $$
declare created public.kingdom_matches;
begin
  if auth.uid() is null then raise exception 'Sign in is required'; end if;
  if jsonb_array_length(p_deck) <> 20 then raise exception 'A 20-card deck is required'; end if;
  loop
    begin
      insert into public.kingdom_matches(room_code,host_id,host_name,host_deck,decree_id)
      values (upper(substr(md5(gen_random_uuid()::text),1,6)),auth.uid(),left(trim(p_name),24),p_deck,p_decree)
      returning * into created;
      exit;
    exception when unique_violation then null;
    end;
  end loop;
  return created;
end $$;

create or replace function public.join_kingdom_match(p_code text, p_name text, p_deck jsonb)
returns public.kingdom_matches
language plpgsql security definer set search_path = public
as $$
declare joined public.kingdom_matches;
begin
  if auth.uid() is null then raise exception 'Sign in is required'; end if;
  if jsonb_array_length(p_deck) <> 20 then raise exception 'A 20-card deck is required'; end if;
  update public.kingdom_matches
    set guest_id=auth.uid(),guest_name=left(trim(p_name),24),guest_deck=p_deck,
        status='playing',updated_at=now()
    where room_code=upper(trim(p_code)) and guest_id is null and host_id<>auth.uid()
    returning * into joined;
  if joined.id is null then raise exception 'Room not found or already full'; end if;
  return joined;
end $$;

create or replace function public.submit_kingdom_plan(p_match uuid, p_round integer, p_side jsonb)
returns boolean
language plpgsql security definer set search_path = public
as $$
declare m public.kingdom_matches; my_seat text; host_plan jsonb; guest_plan jsonb;
begin
  select * into m from public.kingdom_matches where id=p_match for update;
  if m.id is null or (auth.uid()<>m.host_id and auth.uid()<>m.guest_id) then raise exception 'Match not found'; end if;
  if m.phase<>'planning' or m.round<>p_round then raise exception 'Round is no longer accepting plans'; end if;
  my_seat := case when auth.uid()=m.host_id then 'host' else 'guest' end;
  insert into public.kingdom_plans(match_id,player_id,seat,round,side_state)
  values(p_match,auth.uid(),my_seat,p_round,p_side)
  on conflict(match_id,player_id) do update set round=excluded.round,side_state=excluded.side_state,seat=excluded.seat,committed_at=now();
  select side_state into host_plan from public.kingdom_plans where match_id=p_match and seat='host' and round=p_round;
  select side_state into guest_plan from public.kingdom_plans where match_id=p_match and seat='guest' and round=p_round;
  if host_plan is not null and guest_plan is not null then
    update public.kingdom_matches set phase='resolving',revealed_plans=jsonb_build_object('host',host_plan,'guest',guest_plan),updated_at=now() where id=p_match;
    return true;
  end if;
  return false;
end $$;

grant execute on function public.create_kingdom_match(text,jsonb,text) to authenticated;
grant execute on function public.join_kingdom_match(text,text,jsonb) to authenticated;
grant execute on function public.submit_kingdom_plan(uuid,integer,jsonb) to authenticated;

do $$ begin
  alter publication supabase_realtime add table public.kingdom_matches;
exception when duplicate_object then null;
end $$;
