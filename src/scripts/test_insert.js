const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function testInsert() {
  console.log('Testing insert with client role...');
  const { data: d1, error: e1 } = await supabase.from('profiles').insert({
    id: '00000000-0000-0000-0000-000000000000',
    full_name: 'Test Client',
    email: 'client_test@hoas.tech',
    role: 'client'
  }).select();
  console.log('Client insert error:', e1 ? e1.message : 'Success!');

  console.log('Testing insert with vehicle role...');
  const { data: d2, error: e2 } = await supabase.from('profiles').insert({
    id: '11111111-1111-1111-1111-111111111111',
    full_name: 'Test Vehicle',
    email: 'vehicle_test@hoas.tech',
    role: 'vehicle'
  }).select();
  console.log('Vehicle insert error:', e2 ? e2.message : 'Success!');

  console.log('Testing insert with agency role...');
  const { data: d3, error: e3 } = await supabase.from('profiles').insert({
    id: '22222222-2222-2222-2222-222222222222',
    full_name: 'Test Agency',
    email: 'agency_test@hoas.tech',
    role: 'agency'
  }).select();
  console.log('Agency insert error:', e3 ? e3.message : 'Success!');

  // Cleanup
  console.log('Cleaning up...');
  await supabase.from('profiles').delete().in('id', [
    '00000000-0000-0000-0000-000000000000',
    '11111111-1111-1111-1111-111111111111',
    '22222222-2222-2222-2222-222222222222'
  ]);
}

testInsert();
