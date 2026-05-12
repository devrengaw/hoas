const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function fixAdmins() {
  const admins = ['contato@rengawdev.com', 'lucaslws@hotmail.com'];
  console.log('--- Criando perfis administrativos ---');

  let { data: hoas } = await supabase.from('companies').select('id').eq('name', 'HOAS Ecosystem').single();
  
  if (!hoas) {
    console.log('Criando empresa HOAS Ecosystem...');
    const { data: newHoas, error: err } = await supabase
      .from('companies')
      .insert({ name: 'HOAS Ecosystem', type: 'agency', is_public: false })
      .select()
      .single();
    if (err) {
      console.error('Erro ao criar empresa:', err.message);
      return;
    }
    hoas = newHoas;
  }

  const { data: usersData } = await supabase.auth.admin.listUsers();
  
  for (const email of admins) {
    const user = usersData.users.find(u => u.email === email);
    if (user) {
      const { error: profileError } = await supabase.from('profiles').upsert({
        id: user.id,
        company_id: hoas.id,
        full_name: user.user_metadata?.full_name || 'Admin HOAS',
        role: 'admin',
        email: email,
        onboarding_completed: true,
        is_master: true,
        is_test: false
      });

      if (profileError) {
        console.error(`Erro ao criar perfil para ${email}:`, profileError.message);
      } else {
        console.log(`Sucesso: Perfil admin criado para ${email}`);
      }
    } else {
      console.log(`Usuário não encontrado no Auth: ${email}`);
    }
  }

  console.log('--- Finalizado ---');
}

fixAdmins();
