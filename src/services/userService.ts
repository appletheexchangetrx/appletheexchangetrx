import { supabase } from '../utils/supabase';
import type { Address } from '../types/store';

export interface UserRecord {
  phone: string;
  full_name: string;
  password: string;
  avatar_url: string | null;
  is_active: boolean;
  preferences: Record<string, unknown>;
  metadata: Record<string, unknown>;
  user_addresses: Address[];
  user_wishlist: string[];
  created_at: string;
  updated_at: string;
}

export type UserUpdate = Partial<Pick<
  UserRecord,
  'full_name' | 'avatar_url' | 'preferences' | 'metadata' | 'user_addresses' | 'user_wishlist'
>>;

export async function getUserByPhone(phone: string): Promise<UserRecord | null> {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('phone', phone)
    .maybeSingle();

  if (error) throw error;
  return data ? (data as UserRecord) : null;
}

export async function updateUser(
  phone: string,
  updates: UserUpdate
): Promise<UserRecord> {
  const { data, error } = await supabase
    .from('users')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('phone', phone)
    .select('*')
    .single();

  if (error) throw error;
  return data as UserRecord;
}
