import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { email, password, name, role, companyId, userType } = await request.json();

    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || '',
      process.env.SUPABASE_SERVICE_ROLE_KEY || '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    );

    const { data, error } = await supabaseAdmin.auth.admin.createUser({
      email,
      password: password || Math.random().toString(36).slice(-12), // Random password if not provided
      email_confirm: true,
      user_metadata: { 
        full_name: name,
        role: userType, // 'agency', 'client', or 'vehicle'
        position: role, // 'Admin', 'Executivo', etc.
        company_id: companyId
      }
    });

    if (error) throw error;

    return NextResponse.json({ success: true, user: data.user });
  } catch (error: any) {
    console.error('Admin user creation error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
