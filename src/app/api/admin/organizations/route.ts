import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

    // Using Service Role to bypass RLS for Platform Admin
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

    const { data: companies, error: compError } = await supabaseAdmin
      .from('companies')
      .select('*, profiles(*)');

    if (compError) throw compError;

    return NextResponse.json(companies);
  } catch (error: any) {
    console.error('Admin API Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { companyId, status } = await request.json();
    
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

    const { data, error } = await supabaseAdmin
      .from('companies')
      .update({ status })
      .eq('id', companyId)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Admin API POST Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
