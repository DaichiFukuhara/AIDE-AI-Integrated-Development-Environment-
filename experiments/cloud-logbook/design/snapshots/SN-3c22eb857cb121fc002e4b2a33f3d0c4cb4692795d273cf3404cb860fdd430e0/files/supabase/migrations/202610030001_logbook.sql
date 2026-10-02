begin;
create table public.logbook_events (
  sequence bigint generated always as identity primary key,
  owner uuid not null references auth.users(id),
  event_id text not null,
  event jsonb not null,
  received_at timestamptz not null default now(),
  unique(owner,event_id),
  check (jsonb_typeof(event)='object' and event->>'id'=event_id and length(event_id) between 1 and 96)
);
create index on public.logbook_events(owner,sequence desc);
alter table public.logbook_events enable row level security;
create policy logbook_owner_read on public.logbook_events for select to authenticated using (owner=(select auth.uid()));
revoke all on public.logbook_events from public,anon,authenticated,service_role;
grant select on public.logbook_events to authenticated;
grant select,insert on public.logbook_events to service_role;
revoke all on sequence public.logbook_events_sequence_seq from public,anon,authenticated;
grant usage on sequence public.logbook_events_sequence_seq to service_role;

create function public.logbook_record(p_owner uuid,p_event jsonb) returns jsonb
language plpgsql security invoker set search_path='' as $$
declare saved public.logbook_events%rowtype; inserted_count int;
begin
  insert into public.logbook_events(owner,event_id,event) values(p_owner,p_event->>'id',p_event)
    on conflict(owner,event_id) do nothing returning * into saved;
  get diagnostics inserted_count=row_count;
  if inserted_count=1 then return jsonb_build_object('status','inserted','sequence',saved.sequence::text); end if;
  select * into saved from public.logbook_events where owner=p_owner and event_id=p_event->>'id';
  if saved.event=p_event then return jsonb_build_object('status','duplicate','sequence',saved.sequence::text); end if;
  return jsonb_build_object('status','conflict');
end $$;
revoke all on function public.logbook_record(uuid,jsonb) from public,anon,authenticated;
grant execute on function public.logbook_record(uuid,jsonb) to service_role;

create function public.logbook_list(p_project text default null,p_source text default null,p_run text default null,p_query text default '',p_before bigint default null,p_limit int default 51)
returns table(sequence text,event jsonb)
language sql stable security invoker set search_path='' as $$
  select l.sequence::text,l.event from public.logbook_events l
  where l.owner=(select auth.uid())
    and (p_project is null or l.event->>'project'=p_project)
    and (p_source is null or l.event->>'source'=p_source)
    and (p_run is null or l.event->>'run'=p_run)
    and (p_before is null or l.sequence<p_before)
    and position(lower(coalesce(p_query,'')) in lower(concat_ws(' ',l.event->>'title',l.event->>'body',l.event->>'reason',l.event->>'actor',l.event->>'project',l.event->>'run',l.event->>'next',l.event->'evidence'))) > 0
  order by l.sequence desc limit greatest(1,least(p_limit,51))
$$;
revoke all on function public.logbook_list(text,text,text,text,bigint,int) from public,anon,service_role;
grant execute on function public.logbook_list(text,text,text,text,bigint,int) to authenticated;
commit;
