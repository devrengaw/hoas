import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Validates if an email is a corporate one (not Gmail, Outlook, etc.)
 */
export function isCorporateEmail(email: string): boolean {
  const commonDomains = ['gmail.com', 'outlook.com', 'hotmail.com', 'yahoo.com', 'icloud.com', 'uol.com.br', 'bol.com.br'];
  const domain = email.split('@')[1]?.toLowerCase();
  
  if (!domain) return false;
  return !commonDomains.includes(domain);
}

/**
 * Gets the company domain from an email
 */
export function getEmailDomain(email: string): string {
  return email.split('@')[1]?.toLowerCase() || '';
}
