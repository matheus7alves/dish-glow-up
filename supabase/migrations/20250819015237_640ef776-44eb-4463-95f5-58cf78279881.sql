-- Tabela de trials por e-mail (sem auth)
create table if not exists public.email_trials (
  email text primary key,
  name text,
  consumed boolean not null default false,
  locked boolean not null default false,        -- evita duplo clique no processamento
  created_at timestamptz default now(),
  consumed_at timestamptz,
  ip text,
  user_agent text
);

alter table public.email_trials enable row level security;

-- Políticas: permitir apenas operações via RPC; bloquear acesso direto.
create policy if not exists "no direct select"
  on public.email_trials for select
  using (false);
create policy if not exists "no direct insert"
  on public.email_trials for insert
  with check (false);
create policy if not exists "no direct update"
  on public.email_trials for update
  using (false) with check (false);

-- Função RPC: reivindicar trial (cria se não existir; retorna se é elegível)
create or replace function public.claim_trial_by_email(in_email text, in_name text, in_ip text default null, in_ua text default null)
returns table(eligible boolean, already_used boolean) 
language plpgsql security definer
as $$
declare
  v_rec public.email_trials%rowtype;
begin
  -- normaliza e-mail simples (lower/trim)
  in_email := lower(trim(in_email));

  -- tenta inserir se não existir
  insert into public.email_trials (email, name, ip, user_agent)
  values (in_email, in_name, in_ip, in_ua)
  on conflict (email) do nothing;

  select * into v_rec from public.email_trials where email = in_email;

  if v_rec.consumed is false then
    return query select true as eligible, false as already_used;
  else
    return query select false as eligible, true as already_used;
  end if;
end;
$$;

revoke all on function public.claim_trial_by_email(text, text, text, text) from public;
grant execute on function public.claim_trial_by_email(text, text, text, text) to anon;

-- Função RPC: "travar" a execução do job de trial (impede clicar duas vezes)
create or replace function public.lock_trial_job(in_email text)
returns table(lock_ok boolean)
language plpgsql security definer
as $$
declare
  updated int;
begin
  in_email := lower(trim(in_email));
  update public.email_trials
    set locked = true
  where email = in_email
    and consumed = false
    and locked = false;
  GET DIAGNOSTICS updated = ROW_COUNT;

  if updated = 1 then
    return query select true;
  else
    return query select false;
  end if;
end;
$$;

revoke all on function public.lock_trial_job(text) from public;
grant execute on function public.lock_trial_job(text) to anon;

-- Função RPC: consumir de fato a demo após job concluído
create or replace function public.consume_trial(in_email text)
returns table(consumed_now boolean)
language plpgsql security definer
as $$
declare
  updated int;
begin
  in_email := lower(trim(in_email));
  update public.email_trials
    set consumed = true, consumed_at = now()
  where email = in_email
    and consumed = false;
  GET DIAGNOSTICS updated = ROW_COUNT;

  if updated = 1 then
    return query select true;
  else
    return query select false;
  end if;
end;
$$;

revoke all on function public.consume_trial(text) from public;
grant execute on function public.consume_trial(text) to anon;