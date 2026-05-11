/**
 * HOAS Mock Data System (MVP - Initializing with Empty States)
 */

export interface Meeting {
  id: number | string;
  title: string;
  with: string;
  date: string;
  time: string;
  status: 'scheduled' | 'ongoing' | 'completed' | 'cancelled' | 'requested' | 'upcoming';
  hasSummary: boolean;
  email?: string;
  phone?: string;
  transcript?: string;
  summary?: any;
  notes?: string;
}

export interface Organization {
  id: string | number;
  name: string;
  type: string;
  status: string;
  masterName: string;
  masterEmail: string;
  users: any[];
  plan?: string;
  paymentsCount?: number;
  usersCount?: number;
  profile?: {
    description: string;
    website: string;
    address: string;
  };
}

export interface Proposal {
  id: number | string;
  title: string;
  agency: string;
  project: string;
  company: string;
  value: string;
  budget: string;
  status: string;
  date: string;
  contact: string;
  description?: string;
  hasConnection?: boolean;
  assignedTo?: string;
  fullBriefing?: any;
}

export interface Vehicle {
  id: number | string;
  name: string;
  category: string;
  reach: string;
  type: string;
  logo: string;
  description: string;
  stats?: any;
  connected?: boolean;
}

// Initializing with empty arrays to transition to Supabase real-time data
export const mockProposals: Proposal[] = [];
export const mockMeetings: Meeting[] = [];
export const mockOrganizations: Organization[] = [];
export const mockVehicles: Vehicle[] = [];

// Module Refresh
export const _moduleVersion = "1.0.1";

export const currentUser: any = { role: 'GUEST' };

export const notifications: any[] = [];
export const recentActivity: any[] = [];
