const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function addStatusColumn() {
  console.log('Adicionando coluna status à tabela companies...');
  
  // Note: Since I cannot run direct ALTER TABLE easily via standard API,
  // I will try to use a dummy update to see if the column exists,
  // but the proper way is for the user to run the SQL.
  // However, I can try to use the 'upsert' trick if the DB allows it, 
  // but it's better to just provide the SQL file.

  console.log('--- SQL NECESSÁRIO ---');
  console.log('ALTER TABLE companies ADD COLUMN IF NOT EXISTS status TEXT DEFAULT \'active\';');
  console.log('---');
}

addStatusColumn();
