const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const testEmails = ['veiculo@hoas.tech', 'agencia@hoas.tech', 'cliente@hoas.tech'];

async function setupDemoData() {
  console.log('--- Configurando Dados de Demonstração ---');

  // 1. Mark users and companies as is_test
  for (const email of testEmails) {
    const { data: profile } = await supabase
      .from('profiles')
      .update({ is_test: true })
      .eq('email', email)
      .select('id, company_id')
      .single();

    if (profile?.company_id) {
      await supabase
        .from('companies')
        .update({ is_test: true, is_public: true }) // keep public so they see each other
        .eq('id', profile.company_id);
    }
  }

  // Get IDs for data creation
  const { data: veiculo } = await supabase.from('profiles').select('id, company_id').eq('email', 'veiculo@hoas.tech').single();
  const { data: agencia } = await supabase.from('profiles').select('id, company_id').eq('email', 'agencia@hoas.tech').single();
  const { data: cliente } = await supabase.from('profiles').select('id, company_id').eq('email', 'cliente@hoas.tech').single();

  if (veiculo && agencia && cliente) {
    console.log('Criando Briefings para Agência e Cliente...');
    
    // Briefings from Agency
    await supabase.from('briefings').insert([
      {
        company_id: agencia.company_id,
        creator_id: agencia.id,
        title: 'Campanha Black Friday 2026',
        description: 'Lançamento nacional para setor de varejo focado em eletrônicos.',
        target_audience: 'Homens e Mulheres, 25-45 anos, classe ABC',
        budget: 1500000,
        status: 'active'
      },
      {
        company_id: agencia.company_id,
        creator_id: agencia.id,
        title: 'Posicionamento Sustentável - Pharma',
        description: 'Projeto de awareness sobre novas embalagens biodegradáveis.',
        target_audience: 'Pessoas interessadas em sustentabilidade',
        budget: 450000,
        status: 'active'
      }
    ]);

    // Briefings from Client
    await supabase.from('briefings').insert([
      {
        company_id: cliente.company_id,
        creator_id: cliente.id,
        title: 'Lançamento Novo SUV Híbrido',
        description: 'Campanha de pré-venda e test drive regional (SP/RJ).',
        target_audience: 'Famílias alta renda',
        budget: 800000,
        status: 'active'
      }
    ]);

    console.log('Criando Projetos/Oportunidades para o Veículo...');
    // Projects (Marketplace items) for the Vehicle
    await supabase.from('projects').insert([
      {
        company_id: veiculo.company_id,
        title: 'Super Prime Time - Pacote Especial',
        description: 'Inserções de 30" no horário nobre com entrega cross-media (TV + Digital).',
        category: 'Televisão',
        media_type: 'Vídeo',
        pricing_model: 'CPM'
      },
      {
        company_id: veiculo.company_id,
        title: 'Rede Social HoasCare - Patrocínio',
        description: 'Integração de marca em todas as ativações de impacto social do trimestre.',
        category: 'Social Impact',
        media_type: 'Branded Content',
        pricing_model: 'Fixed'
      }
    ]);

    console.log('Criando Oportunidades no Pipeline...');
    // Pipeline entries
    await supabase.from('opportunities').insert([
      {
        company_id: veiculo.company_id,
        title: 'Negociação Black Friday (Agência Hub)',
        value: 250000,
        stage: 'negotiation'
      },
      {
        company_id: veiculo.company_id,
        title: 'Projeto SUV (Anunciante Hub)',
        value: 120000,
        stage: 'proposal'
      }
    ]);
  }

  console.log('--- Demonstração configurada com sucesso! ---');
}

setupDemoData();
