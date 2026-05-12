'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Plus, LayoutGrid, List, Trash2, Eye, ExternalLink, Image as ImageIcon, 
  Zap, Building2, MapPin, ShieldAlert, Users, Search, Filter, X, 
  Calendar, DollarSign, Target, FileText, Globe, Award, CheckCircle2,
  Mail, Phone, Briefcase, BarChart3, Info, Smartphone, Gift, CreditCard, TrendingUp,
  MessageSquare
} from 'lucide-react';
import styles from './page.module.css';
import { mockVehicles, mockProposals, currentUser, mockOrganizations, Proposal, Vehicle } from '@/lib/mockData';
import { supabase } from '@/lib/supabase';

export default function MarketplacePage() {
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [vehicleSearch, setVehicleSearch] = useState('');
  const [vehicleCategory, setVehicleCategory] = useState('All');
  
  // Modals state
  const [selectedBriefing, setSelectedBriefing] = useState<any>(null);
  const [selectedVehicle, setSelectedVehicle] = useState<any>(null);
  const [selectedAgency, setSelectedAgency] = useState<any>(null);
  
  const [isBriefingModalOpen, setIsBriefingModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isAgencyModalOpen, setIsAgencyModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const isMaster = currentUser.role === 'MASTER';

  // State for filtered opportunities (briefings from agencies)
  const [recommendations, setRecommendations] = useState<Proposal[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      
      // Get current profile test status
      const { data: { user } } = await supabase.auth.getUser();
      const { data: profile } = await supabase
        .from('profiles')
        .select('is_test')
        .eq('id', user?.id)
        .single();
      
      const isTestUser = profile?.is_test || false;

      // Fetch Projects (Opportunities) - filter by is_test
      const { data: projects, error: projError } = await supabase
        .from('projects')
        .select('*, companies!inner(name, is_test, status)')
        .eq('companies.is_test', isTestUser)
        .eq('companies.status', 'active');
      
      if (projError) throw projError;

      const mappedProposals: Proposal[] = (projects || []).map(p => ({
        id: p.id,
        title: p.title,
        agency: (p.companies as any)?.name || 'Agência Parceira',
        project: p.title,
        company: (p.companies as any)?.name || 'Empresa',
        value: 'R$ ' + (p.budget_value?.toLocaleString('pt-BR') || 'Sob consulta'),
        budget: 'R$ ' + (p.budget_value?.toLocaleString('pt-BR') || 'Sob consulta'),
        status: p.status,
        date: new Date(p.created_at).toLocaleDateString('pt-BR'),
        contact: 'Pelo Marketplace',
        description: p.description,
        hasConnection: true
      }));

      // Fetch Vehicles (Directory) - filter by is_test and is_public
      const { data: vehiclesData, error: vehError } = await supabase
        .from('companies')
        .select('*')
        .eq('type', 'vehicle')
        .eq('is_public', true)
        .eq('is_test', isTestUser)
        .eq('status', 'active');
      
      if (vehError) throw vehError;

      const mappedVehicles: Vehicle[] = vehiclesData.map(v => ({
        id: v.id,
        name: v.name,
        category: v.category || 'Mídia',
        reach: v.reach_description || 'Audiência Qualificada',
        type: v.type?.toUpperCase() || 'VEHICLE',
        logo: '',
        description: v.description || 'Veículo de mídia parceiro do ecossistema HOAS.',
        connected: true
      } as any));

      setRecommendations(mappedProposals);
      setVehicles(mappedVehicles);
    } catch (error) {
      console.error('Error fetching marketplace data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenBriefing = (briefing: any) => {
    setSelectedBriefing(briefing);
    setIsBriefingModalOpen(true);
  };

  const handleOpenProfile = (vehicle: any) => {
    setSelectedVehicle(vehicle);
    setIsProfileModalOpen(true);
  };

  const handleOpenAgency = (agencyName: string) => {
    const agency = mockOrganizations.find(o => o.name === agencyName && o.type === 'AGENCY') || {
      name: agencyName,
      type: 'AGENCY',
      profile: {
        description: "Agência especializada em estratégias multimeios e performance digital, com foco em resultados escaláveis.",
        website: "www." + agencyName.toLowerCase().replace(/ /g, '') + ".com.br",
        address: "Av. Faria Lima, 1200 - São Paulo, SP"
      },
      plan: 'Enterprise',
      users: []
    };
    setSelectedAgency(agency);
    setIsAgencyModalOpen(true);
  };

  const showSuccess = (msg: string) => {
    setSuccessMessage(msg);
    setIsSuccessModalOpen(true);
  };

  const handleAction = (action: string) => {
    if (action === 'download') showSuccess('Download do material iniciado com sucesso!');
    if (action === 'contact') showSuccess('Solicitação de contato enviada! Em breve a equipe retornará.');
    if (action === 'proposal') {
      setIsBriefingModalOpen(false);
      showSuccess('Proposta enviada para análise da agência!');
    }
  };

  // Logic: Filter and prioritize connected vehicles
  const filteredVehicles = vehicles
    .filter(v => {
      const matchesSearch = v.name.toLowerCase().includes(vehicleSearch.toLowerCase());
      const matchesCategory = vehicleCategory === 'All' || v.category === vehicleCategory;
      return matchesSearch && matchesCategory;
    });

  const vehicleCategories = ['All', 'Televisão', 'Rádio', 'Out of Home', 'Digital'];

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div>
          <h1>Marketplace de Oportunidades</h1>
          <p>Descubra briefings e veículos que dão match com seu perfil.</p>
        </div>
        <div className={styles.headerActions}>
          {isMaster && (
            <div className={styles.masterIndicator}>
              <ShieldAlert size={16} />
              <span>Visão Master Ativa</span>
            </div>
          )}
          <Link href="/dashboard/marketplace/new" className={styles.primaryBtn}>
            <Plus size={18} />
            <span>Publicar Novo Projeto</span>
          </Link>
        </div>
      </header>

      {/* Recommended Opportunities Section */}
      <section className={styles.matchSection}>
        <div className={styles.sectionHeader}>
          <div className={styles.titleWithIcon}>
            <Zap size={20} className={styles.zapIcon} />
            <h2>Oportunidades de Negócio (IA Match)</h2>
          </div>
          <p>{isMaster ? 'Exibindo todos os briefings.' : 'Exibindo propostas de agências conectadas.'}</p>
        </div>
        
        <div className={styles.matchGrid}>
          {recommendations.length > 0 ? (
            recommendations.map((b) => (
              <div key={b.id} className={`${styles.matchCard} ${!b.hasConnection ? styles.newOpportunity : ''}`}>
                <div className={styles.matchBadge}>{b.hasConnection ? 'Conexão Direta' : 'Match Sugerido'}</div>
                <div className={styles.matchContent}>
                  <div className={styles.agencyHeader} onClick={() => handleOpenAgency(b.agency)} style={{ cursor: 'pointer' }}>
                    <Building2 size={16} />
                    <span>{b.agency}</span>
                    <ExternalLink size={12} className={styles.inlineIcon} />
                  </div>
                  <h3>{b.project}</h3>
                  <p>{b.description}</p>
                  <div className={styles.matchFooter}>
                    <span className={styles.budgetValue}>{b.budget}</span>
                    <button className={styles.proposalBtn} onClick={() => handleOpenBriefing(b)}>Ver Briefing</button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className={styles.emptyState}><Users size={32} /><p>Nenhuma oportunidade encontrada.</p></div>
          )}
        </div>
      </section>

      <div className={styles.divider} />

      {/* Vehicles Directory with Filters */}
      <section className={styles.vehiclesSection}>
        <div className={styles.sectionHeader}>
          <h2>Veículos Disponíveis</h2>
          <p>Priorizando parceiros com conexão ativa.</p>
        </div>

        <div className={styles.directoryControls}>
          <div className={styles.searchBox}>
            <Search size={18} />
            <input 
              type="text" 
              placeholder="Buscar veículos..." 
              value={vehicleSearch}
              onChange={(e) => setVehicleSearch(e.target.value)}
            />
          </div>
          <div className={styles.filterGroup}>
            {vehicleCategories.map(cat => (
              <button 
                key={cat} 
                className={`${styles.filterTag} ${vehicleCategory === cat ? styles.activeTag : ''}`}
                onClick={() => setVehicleCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
        
        <div className={styles.vehicleGrid}>
          {filteredVehicles.map((v) => (
            <div key={v.id} className={`${styles.vehicleCard} ${v.connected ? styles.connectedVehicle : ''}`}>
              <div className={styles.vehicleHeader}>
                <div className={styles.vehicleType}>{v.type}</div>
                {v.connected && <span className={styles.connectionBadge}>✓ Conectado</span>}
              </div>
              <div className={styles.vehicleMain}>
                <div className={styles.vehicleAvatar}>{v.name[0]}</div>
                <h3>{v.name}</h3>
                <span className={styles.reachInfo}>{v.reach} de alcance</span>
              </div>
              <div className={styles.vehicleFooter}>
                <span className={styles.category}>{v.category}</span>
                <button 
                  className={v.connected ? styles.viewProfileBtn : styles.connectBtn}
                  onClick={() => handleOpenProfile(v)}
                >
                  {v.connected ? 'Ver Perfil' : 'Solicitar Conexão'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Profile Modal (Unified - PicPay Ads Standard) */}
      {isProfileModalOpen && selectedVehicle && (
        <div className={styles.modalOverlay} onClick={() => setIsProfileModalOpen(false)}>
          <div className={`${styles.modal} ${styles.standardProfile}`} onClick={e => e.stopPropagation()}>
            <button className={styles.closeBtn} onClick={() => setIsProfileModalOpen(false)}><X size={24} /></button>
            
            <div className={styles.standardCover}>
              <h1 className={styles.coverTitle}>{selectedVehicle.name}</h1>
            </div>

            <div className={styles.standardHeader}>
              <div className={styles.standardLogo}>{selectedVehicle.name[0]}</div>
              <div className={styles.standardHeaderInfo}>
                <div className={styles.categoryTag}>{selectedVehicle.type}</div>
                <h2>{selectedVehicle.name}</h2>
                <p>{selectedVehicle.category} • {selectedVehicle.reach} alcance</p>
              </div>
              <div className={styles.standardActions}>
                {selectedVehicle.connected && <span className={styles.connectedBadge}><CheckCircle2 size={14} /> Conectado</span>}
                <button className={styles.primaryContactBtn} onClick={() => handleAction('contact')}>
                  <MessageSquare size={18} /> Entrar em Contato
                </button>
              </div>
            </div>

            <div className={styles.standardGrid}>
              <div className={styles.standardLeftCol}>
                <section className={styles.standardSection}>
                  <h3 className={styles.standardSectionTitle}><Info size={18} color="#11C76F" /> Sobre o Veículo</h3>
                  <p>Líder em audiência na categoria {selectedVehicle.category}, oferecendo soluções integradas de mídia com alto impacto e conversão. Atuação nacional com foco em entregas customizadas para grandes anunciantes e agências.</p>
                </section>

                <section className={styles.standardSection}>
                  <h3 className={styles.standardSectionTitle}><Target size={18} color="#11C76F" /> Possibilidades & Formatos</h3>
                  <div className={styles.featureList}>
                    <div className={styles.featureItem}>
                      <div className={styles.featureIcon}><Smartphone size={18} /></div>
                      <span>Mídia com alto nível de atenção e engajamento do público-alvo.</span>
                    </div>
                    <div className={styles.featureItem}>
                      <div className={styles.featureIcon}><BarChart3 size={18} /></div>
                      <span>Segmentação qualificada baseada em comportamento e dados demográficos.</span>
                    </div>
                    <div className={styles.featureItem}>
                      <div className={styles.featureIcon}><Zap size={18} /></div>
                      <span>Integração de múltiplos canais para jornadas de consumo completas.</span>
                    </div>
                  </div>
                </section>

                <section className={styles.standardSection}>
                  <h3 className={styles.standardSectionTitle}><ImageIcon size={18} color="#11C76F" /> Cases e Audiência</h3>
                  <div className={styles.standardGallery}>
                    <div className={styles.galleryPlaceholder}><ImageIcon size={24} /><span>Impacto Real</span></div>
                    <div className={styles.galleryPlaceholder}><BarChart3 size={24} /><span>Métricas de Q1</span></div>
                  </div>
                </section>
              </div>

              <div className={styles.standardRightCol}>
                <div className={styles.sideWidget}>
                  <h3>Alcance e Performance</h3>
                  <div className={styles.statRow}><span>Alcance Mensal</span><strong>{selectedVehicle.reach}</strong></div>
                  <div className={styles.statRow}><span>Aderência Média</span><strong>92%</strong></div>
                  <div className={styles.statRow}><span>Abrangência</span><strong>Nacional</strong></div>
                  <div className={styles.statRow}><span>Modelos</span><strong>CPM, CPA</strong></div>
                </div>

                <div className={styles.sideWidget}>
                  <h3>Media Kit 2026</h3>
                  <div className={styles.formatCloud}>
                    {['Display', 'Native', 'Push', 'Video', 'Branded Content'].map(f => (
                      <span key={f} className={styles.formatTag}>{f}</span>
                    ))}
                  </div>
                  <button className={styles.downloadBtnFull} onClick={() => handleAction('download')}>
                    <FileText size={16} /> Download Media Kit (PDF)
                  </button>
                </div>
                <Link 
                  href={`/dashboard/directory/${selectedVehicle.name.toLowerCase().replace(/ /g, '-')}`} 
                  className={styles.viewFullProfileLink}
                >
                  <ExternalLink size={16} /> Ver Perfil Completo
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Briefing Modal */}
      {isBriefingModalOpen && selectedBriefing && (
        <div className={styles.modalOverlay} onClick={() => setIsBriefingModalOpen(false)}>
          <div className={styles.modal} onClick={e => e.stopPropagation()}>
            <button className={styles.closeBtn} onClick={() => setIsBriefingModalOpen(false)}><X size={24} /></button>
            <div className={styles.modalHeader}>
              <div className={styles.modalIconWrapper}><FileText size={24} /></div>
              <h2>Detalhamento do Briefing</h2>
              <p>Oportunidade publicada por <strong className={styles.clickableAgency} onClick={() => { setIsBriefingModalOpen(false); handleOpenAgency(selectedBriefing.agency); }}>{selectedBriefing.agency}</strong></p>
            </div>
            
            <div className={styles.briefingDetails}>
              <div className={styles.detailRow}>
                <div className={styles.detailItem}>
                  <label><Target size={14} /> Projeto</label>
                  <strong>{selectedBriefing.project}</strong>
                </div>
                <div className={styles.detailItem}>
                  <label><DollarSign size={14} /> Verba Estimada</label>
                  <strong className={styles.highlight}>{selectedBriefing.budget}</strong>
                </div>
              </div>
              
              <div className={styles.detailItem}>
                <label><Calendar size={14} /> Período da Campanha</label>
                <strong>Outubro 2026 - Dezembro 2026</strong>
              </div>

              <div className={styles.descriptionBox}>
                <label>Objetivo & Contexto</label>
                <p>{selectedBriefing.description} O objetivo principal é aumentar o brand awareness nas regiões metropolitanas através de uma estratégia multimeios integrada.</p>
              </div>

              <button className={styles.sendProposalBtn} onClick={() => handleAction('proposal')}>
                <Zap size={18} /> Enviar Proposta Agora
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Agency Profile Modal (PicPay Ads Standard) */}
      {isAgencyModalOpen && selectedAgency && (
        <div className={styles.modalOverlay} onClick={() => setIsAgencyModalOpen(false)}>
          <div className={`${styles.modal} ${styles.standardProfile}`} onClick={e => e.stopPropagation()}>
            <button className={styles.closeBtn} onClick={() => setIsAgencyModalOpen(false)}><X size={24} /></button>
            
            <div className={styles.standardCover} style={{ background: 'linear-gradient(135deg, #11C76F, #0fa35a)' }}>
              <h1 className={styles.coverTitle}>{selectedAgency.name}</h1>
            </div>

            <div className={styles.standardHeader}>
              <div className={styles.standardLogo} style={{ background: '#11C76F', color: 'white' }}>{selectedAgency.name[0]}</div>
              <div className={styles.standardHeaderInfo}>
                <div className={styles.categoryTag}>Agency Partner</div>
                <h2>{selectedAgency.name}</h2>
                <p>Agência Full Service • {selectedAgency.plan} Plan</p>
              </div>
              <div className={styles.standardActions}>
                <button className={styles.primaryContactBtn} onClick={() => handleAction('contact')}>
                  <MessageSquare size={18} /> Solicitar Reunião
                </button>
              </div>
            </div>

            <div className={styles.standardGrid}>
              <div className={styles.standardLeftCol}>
                <section className={styles.standardSection}>
                  <h3 className={styles.standardSectionTitle}><Info size={18} color="#11C76F" /> Sobre a Agência</h3>
                  <p>{selectedAgency.profile.description}</p>
                  <p>Com vasta experiência em planejamento e compra de mídia, entregamos soluções que unem criatividade e performance para os maiores anunciantes do país.</p>
                </section>

                <section className={styles.standardSection}>
                  <h3 className={styles.standardSectionTitle}><Briefcase size={18} color="#11C76F" /> Áreas de Atuação</h3>
                  <div className={styles.featureList}>
                    <div className={styles.featureItem}>
                      <div className={styles.featureIcon}><TrendingUp size={18} /></div>
                      <span>Planejamento Estratégico de Mídia Offline e Online.</span>
                    </div>
                    <div className={styles.featureItem}>
                      <div className={styles.featureIcon}><BarChart3 size={18} /></div>
                      <span>Análise de Dados e Business Intelligence para campanhas.</span>
                    </div>
                    <div className={styles.featureItem}>
                      <div className={styles.featureIcon}><Award size={18} /></div>
                      <span>Gestão de Projetos Especiais e Ativações de Marca.</span>
                    </div>
                  </div>
                </section>
              </div>

              <div className={styles.standardRightCol}>
                <div className={styles.sideWidget}>
                  <h3>Informações de Contato</h3>
                  <div className={styles.statRow}><span>Website</span><strong>{selectedAgency.profile.website}</strong></div>
                  <div className={styles.statRow}><span>Localização</span><strong>{selectedAgency.profile.address.split(' - ')[1]}</strong></div>
                </div>

                <div className={styles.sideWidget}>
                  <h3>Portfólio & Cases</h3>
                  <div className={styles.formatCloud}>
                    {['Performance', 'Social', 'TV', 'OOH', 'Influência'].map(f => (
                      <span key={f} className={styles.formatTag}>{f}</span>
                    ))}
                  </div>
                  <button className={styles.downloadBtnFull} onClick={() => handleAction('download')}>
                    <FileText size={16} /> Ver Apresentação (PDF)
                  </button>
                </div>
                <Link 
                  href={`/dashboard/directory/${selectedAgency.name.toLowerCase().replace(/ /g, '-')}`} 
                  className={styles.viewFullProfileLink}
                >
                  <ExternalLink size={16} /> Ver Perfil Completo
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {isSuccessModalOpen && (
        <div className={styles.modalOverlay} onClick={() => setIsSuccessModalOpen(false)}>
          <div className={styles.modal} style={{ maxWidth: '400px', textAlign: 'center' }} onClick={e => e.stopPropagation()}>
            <div className={styles.successIconWrapper}><CheckCircle2 size={40} /></div>
            <h2>Ação Concluída!</h2>
            <p>{successMessage}</p>
            <button className={styles.primaryBtn} onClick={() => setIsSuccessModalOpen(false)}>Entendido</button>
          </div>
        </div>
      )}
    </div>
  );
}
