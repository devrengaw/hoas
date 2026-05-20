const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function checkSchema() {
  console.log('Fetching columns from information_schema for profiles...');
  
  // Let's try to do a select on profiles to see what columns are in the returned object.
  const { data: selectData, error: selectErr } = await supabase.from('profiles').select('*').limit(1);
  if (selectErr) {
    console.error('Select error:', selectErr.message);
  } else if (selectData && selectData.length > 0) {
    console.log('Columns in profiles:', Object.keys(selectData[0]));
  } else {
    console.log('No data in profiles to infer columns. Let\'s try to insert a dummy row and read the error.');
    const { data: dummy, error: insertErr } = await supabase.from('profiles').insert({
      id: '00000000-0000-0000-0000-000000000000',
      full_name: 'Test',
      email: 'test@test.com'
    }).select();
    console.log('Insert dummy error:', insertErr ? insertErr.message : 'No error');
  }

  // Let's check company columns as well.
  const { data: compData } = await supabase.from('companies').select('*').limit(1);
  if (compData && compData.length > 0) {
    console.log('Columns in companies:', Object.keys(compData[0]));
  }
}

checkSchema();
