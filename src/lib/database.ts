import { supabase } from './supabase';

/**
 * PROFILES & COMPANIES
 */

export async function getProfile(userId: string) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*, companies(*)')
    .eq('id', userId)
    .single();
  
  if (error) throw error;
  return data;
}

/**
 * MEETINGS & BOOKING
 */

export async function createMeeting(meetingData: {
  company_id: string;
  creator_id: string;
  title: string;
  scheduled_at: string;
  duration_minutes?: number;
  guest_email?: string;
  guest_name?: string;
  location?: string;
  meeting_url?: string;
  notes?: string;
}) {
  const { data, error } = await supabase
    .from('meetings')
    .insert([
      {
        ...meetingData,
        status: 'scheduled'
      }
    ])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getMeetings(companyId: string) {
  const { data, error } = await supabase
    .from('meetings')
    .select('*')
    .eq('company_id', companyId)
    .order('scheduled_at', { ascending: true });

  if (error) throw error;
  return data;
}

/**
 * BRIEFINGS
 */

export async function createBriefing(briefingData: any) {
  const { data, error } = await supabase
    .from('briefings')
    .insert([briefingData])
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * MARKETPLACE PROJECTS
 */

export async function getProjects() {
  const { data, error } = await supabase
    .from('projects')
    .select('*, companies(name, logo_url)');

  if (error) throw error;
  return data;
}
