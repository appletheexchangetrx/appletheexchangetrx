import { supabase } from '../utils/supabase';
import type { UserRecord } from './userService';

export async function checkPhoneExists(phone: string): Promise<boolean> {
  const { data, error } = await supabase
    .from('users')
    .select('phone')
    .eq('phone', phone)
    .maybeSingle();

  if (error) throw error;
  return Boolean(data);
}

export async function registerUser(params: {
  phone: string;
  fullName: string;
  password: string;
}): Promise<UserRecord> {
  const { data, error } = await supabase
    .from('users')
    .insert({
      phone: params.phone,
      full_name: params.fullName,
      password: params.password,
    })
    .select('*')
    .single();

  if (error) throw error;
  return data as UserRecord;
}

export async function loginUser(phone: string, password: string): Promise<UserRecord | null> {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('phone', phone)
    .maybeSingle();

  if (error) throw error;
  if (!data || !data.is_active || data.password !== password) return null;
  return data as UserRecord;
}
