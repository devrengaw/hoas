const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const testUsers = [
  {
    email: 'veiculo@hoas.tech',
    password: '123456',
    company_type: 'vehicle',
    profile_role: 'admin',
    name: 'Veículo Teste HOAS',
    company: 'Veículo Hub'
  },
  {
    email: 'agencia@hoas.tech',
    password: '123456',
    company_type: 'agency',
    profile_role: 'admin',
    name: 'Agência Teste HOAS',
    company: 'Agência Hub'
  },
  {
    email: 'cliente@hoas.tech',
    password: '123456',
    company_type: 'client',
    profile_role: 'admin',
    name: 'Cliente Teste HOAS',
    company: 'Anunciante Hub'
  }
];

async function createTestUsers() {
  console.log('--- Iniciando criação de usuários de teste ---');

  for (const user of testUsers) {
    console.log(`Criando ${user.email}...`);

    // 1. Create Auth User
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: user.email,
      password: user.password,
      email_confirm: true,
      user_metadata: {
        full_name: user.name,
        role: user.company_type,
        company_name: user.company
      }
    });

    if (authError) {
      if (authError.message.toLowerCase().includes('already registered') || authError.status === 422) {
        console.log(`Usuário ${user.email} já existe. Atualizando perfil...`);
      } else {
        console.error(`Erro ao criar auth para ${user.email}:`, authError.message);
        continue;
      }
    }

    let targetUserId = authData?.user?.id;
    if (!targetUserId) {
      const { data: existingUsers } = await supabase.auth.admin.listUsers();
      targetUserId = existingUsers?.users?.find(u => u.email === user.email)?.id;
    }

    if (!targetUserId) {
      console.error(`Não foi possível determinar o ID para ${user.email}`);
      continue;
    }

    // 2. Create Company
    let companyId;
    const { data: existingCompany } = await supabase
      .from('companies')
      .select('id')
      .eq('name', user.company)
      .single();

    if (existingCompany) {
      companyId = existingCompany.id;
    } else {
      const { data: newCompany, error: companyError } = await supabase
        .from('companies')
        .insert({ 
          name: user.company, 
          type: user.company_type,
          is_public: true 
        })
        .select()
        .single();
      
      if (companyError) {
        console.error(`Erro ao criar empresa para ${user.email}:`, companyError.message);
      } else {
        companyId = newCompany.id;
      }
    }

    // 3. Create/Update Profile
    if (targetUserId && companyId) {
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert({
          id: targetUserId,
          company_id: companyId,
          full_name: user.name,
          role: user.profile_role,
          email: user.email,
          onboarding_completed: true,
          is_master: true
        });

      if (profileError) {
        console.error(`Erro ao criar perfil para ${user.email}:`, profileError.message);
      } else {
        console.log(`Sucesso: ${user.email} criado e configurado.`);
      }
    }
  }

  console.log('--- Finalizado ---');
}

createTestUsers();
