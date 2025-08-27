-- Corrigir search_path nas funções para resolver warning de segurança
CREATE OR REPLACE FUNCTION public.claim_trial_by_email(in_email text, in_name text, in_ip text DEFAULT NULL::text, in_ua text DEFAULT NULL::text)
 RETURNS TABLE(eligible boolean, already_used boolean)
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = 'public'
AS $function$
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
$function$;

CREATE OR REPLACE FUNCTION public.lock_trial_job(in_email text)
 RETURNS TABLE(lock_ok boolean)
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = 'public'
AS $function$
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
$function$;

CREATE OR REPLACE FUNCTION public.consume_trial(in_email text)
 RETURNS TABLE(consumed_now boolean)
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = 'public'
AS $function$
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
$function$;