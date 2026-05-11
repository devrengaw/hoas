'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Search, Filter, ShoppingBag, Sparkles, Building2, Target, 
  DollarSign, ArrowRight, Star, MapPin, Eye, ExternalLink, 
  SlidersHorizontal, CheckCircle, Zap, ShieldAlert, X,
  Users, Globe, Award, BarChart3, Briefcase, Calendar, FileText, CheckCircle2,
  MessageSquare, Info, Smartphone
} from 'lucide-react';
import styles from './page.module.css';
import { useMVPData } from '@/hooks/useMVPData';
import { mockProposals, currentUser, mockOrganizations } from '@/lib/mockData';

export default function AgencyMarketplacePage() {
  const [activeTab, setActiveTab] = useState<'vehicles' | 'clients'>('vehicles');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Modals state
  const { data: realVehicles } = useMVPData('profiles', { role: 'vehicle' });
  const { data: realClients } = useMVPData('profiles', { role: 'client' });

  // Modals state
  const [selectedVehicle, setSelectedVehicle] = useState<any>(null);
  const [selectedClientNeed, setSelectedClientNeed] = useState<any>(null);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isClientNeedModalOpen, setIsClientNeedModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Mapping DB to UI
  const vehicles = realVehicles?.map((v: any) => ({
    id: v.id,
    name: v.company_name || 'Veículo HOAS',
    type: v.media_type || 'Digital',
    category: 'Digital',
    reach: '500k+',
    connected: false,
    rating: 4.8,
    tags: ['Brand Awareness', 'Performance'],
    description: 'Veículo parceiro da plataforma HOAS.'
  })) || [];

  const clientNeeds = realClients?.map((c: any) => ({
    id: c.id,
    company: c.company_name || 'Anunciante',
    client: c.company_name || 'Anunciante',
    title: c.objective || 'Campanha Nacional',
    objective: c.objective || 'Campanha Nacional',
    budget: 'R$ 50k - 100k',
    date: 'Junho 2026',
    contact: c.full_name,
    description: 'Busca parceiros para lançamento estratégico.',
    match: 95,
    tags: ['Brand Awareness', 'Performance']
  })) || [];

  const isMaster = currentUser.role === 'MASTER';

  const handleOpenProfile = (vehicle: any) => {
    setSelectedVehicle(vehicle);
    setIsProfileModalOpen(true);
  };

  const handleOpenClientNeed = (need: any) => {
    setSelectedClientNeed(need);
    setIsClientNeedModalOpen(true);
  };

  const showSuccess = (msg: string) => {
    setSuccessMessage(msg);
    setIsSuccessModalOpen(true);
  };

  const handleAction = (action: string) => {
    if (action === 'download') showSuccess('Download do material iniciado com sucesso!');
    if (action === 'contact') showSuccess('Solicitação de contato enviada! Aguarde retorno.');
    if (action === 'proposal') {
      setIsClientNeedModalOpen(false);
      showSuccess('Proposta estratégica enviada com sucesso para o anunciante!');
    }
  };

  // Logic: Prioritize connected vehicles for the agency
  const filteredVehicles = vehicles
    .filter(v => {
      const matchesSearch = v.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            v.type.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || v.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });

  const filteredClients = clientNeeds.filter(c => 
    c.company.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.objective.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const vehicleCategories = ['All', 'Televisão', 'Rádio', 'Out of Home', 'Digital'];

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.headerTitle}>
          <h1>Marketplace de Oportunidades</h1>
          <p>Encontre projetos de veículos ou atenda necessidades diretas de anunciantes.</p>
        </div>
        {isMaster && (
          <div className={styles.masterBadge}>
            <ShieldAlert size={16} />
            <span>Visão Administrativa</span>
          </div>
        )}
      </header>

      <div className={styles.topActions}>
        <div className={styles.tabContainer}>
          <button 
            className={`${styles.tab} ${activeTab === 'vehicles' ? styles.activeTab : ''}`}
            onClick={() => setActiveTab('vehicles')}
          >
            <ShoppingBag size={18} />
            <span>Marketplace de Veículos</span>
          </button>
          <button 
            className={`${styles.tab} ${activeTab === 'clients' ? styles.activeTab : ''}`}
            onClick={() => setActiveTab('clients')}
          >
            <Sparkles size={18} />
            <span>Necessidades de Clientes</span>
          </button>
        </div>
      </div>

      <div className={styles.searchSection}>
        <div className={styles.controls}>
          <div className={styles.searchBox}>
            <Search size={18} />
            <input 
              type="text" 
              placeholder={`Buscar em ${activeTab === 'vehicles' ? 'veículos' : 'clientes'}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className={styles.filterGroup}>
            {activeTab === 'vehicles' && vehicleCategories.map(cat => (
              <button 
                key={cat} 
                className={`${styles.filterTag} ${selectedCategory === cat ? styles.activeTag : ''}`}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {activeTab === 'vehicles' ? (
        <div className={styles.grid}>
          {filteredVehicles.map((v) => (
            <div key={v.id} className={`${styles.vehicleCard} ${v.connected ? styles.connectedCard : ''}`}>
              <div className={styles.cardHeader}>
                <div className={styles.typeTag}>{v.type}</div>
                {v.connected && <span className={styles.connBadge}><CheckCircle size={14} /> Conectado</span>}
              </div>
              <div className={styles.cardBody}>
                <div className={styles.vehicleAvatar}>{v.name[0]}</div>
                <h3>{v.name}</h3>
                <div className={styles.reachInfo}><Users size={14} /> {v.reach} de alcance</div>
                <div className={styles.categoryTag}>{v.category}</div>
              </div>
              <div className={styles.cardFooter}>
                <button className={styles.viewBtn} onClick={() => handleOpenProfile(v)}>Ver Perfil</button>
                <button 
                  className={v.connected ? styles.primaryActionBtn : styles.connectBtn}
                  onClick={() => v.connected ? showSuccess('Solicitação de cota enviada para ' + v.name) : showSuccess('Solicitação de conexão enviada!')}
                >
                  {v.connected ? 'Solicitar Cota' : 'Solicitar Conexão'}
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className={styles.grid}>
          {filteredClients.map((n) => (
            <div key={n.id} className={styles.clientCard}>
              <div className={styles.aiMatchBadge}><Zap size={14} /> {n.match}% Match IA</div>
              <div className={styles.clientHeader}>
                <div className={styles.avatar}>{n.client[0]}</div>
                <div>
                  <h4>{n.client}</h4>
                  <p>Necessidade Publicada</p>
                </div>
              </div>
              <div className={styles.clientBody}>
                <h3>{n.title}</h3>
                <p>{n.description}</p>
                <div className={styles.budgetInfo}>
                  <DollarSign size={16} />
                  <span>Investimento: <strong>{n.budget}</strong></span>
                </div>
                <div className={styles.tagCloud}>
                  {n.tags.map((t: string) => <span key={t} className={styles.tag}>{t}</span>)}
                </div>
              </div>
              <div className={styles.cardFooter}>
                <button className={styles.proposalBtn} onClick={() => handleOpenClientNeed(n)}>
                  Ver Detalhes do Briefing
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Vehicle Profile Modal (Standard Design) */}
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
                <button className={styles.primaryContactBtn} onClick={() => handleAction('contact')}>
                  <MessageSquare size={18} /> Entrar em Contato
                </button>
              </div>
            </div>

            <div className={styles.standardGrid}>
              <div className={styles.standardLeftCol}>
                <section className={styles.standardSection}>
                  <h3 className={styles.standardSectionTitle}><Info size={18} color="#11C76F" /> Sobre o Veículo</h3>
                  <p>Líder em audiência na categoria {selectedVehicle.category}, oferecendo soluções integradas de mídia com alto impacto e conversão. Especialista em entregas customizadas.</p>
                </section>

                <section className={styles.standardSection}>
                  <h3 className={styles.standardSectionTitle}><Target size={18} color="#11C76F" /> Diferenciais</h3>
                  <div className={styles.featureList}>
                    <div className={styles.featureItem}>
                      <div className={styles.featureIcon}><Smartphone size={18} /></div>
                      <span>Mídia com alto nível de atenção e engajamento.</span>
                    </div>
                    <div className={styles.featureItem}>
                      <div className={styles.featureIcon}><BarChart3 size={18} /></div>
                      <span>Segmentação qualificada baseada em comportamento.</span>
                    </div>
                  </div>
                </section>
              </div>

              <div className={styles.standardRightCol}>
                <div className={styles.sideWidget}>
                  <h3>Métricas HOAS</h3>
                  <div className={styles.statRow}><span>Alcance</span><strong>{selectedVehicle.reach}</strong></div>
                  <div className={styles.statRow}><span>Match</span><strong>94%</strong></div>
                </div>

                <div className={styles.sideWidget}>
                  <h3>Media Kit</h3>
                  <button className={styles.downloadBtnFull} onClick={() => handleAction('download')}>
                    <FileText size={16} /> Download PDF
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

      {/* Client Need Modal (Briefing) */}
      {isClientNeedModalOpen && selectedClientNeed && (
        <div className={styles.modalOverlay} onClick={() => setIsClientNeedModalOpen(false)}>
          <div className={styles.modal} onClick={e => e.stopPropagation()}>
            <button className={styles.closeBtn} onClick={() => setIsClientNeedModalOpen(false)}><X size={24} /></button>
            <div className={styles.modalHeaderCenter}>
              <div className={styles.modalIconWrapper}><FileText size={24} /></div>
              <h2>Oportunidade de Anunciante</h2>
              <p>Publicada por <strong>{selectedClientNeed.client}</strong></p>
            </div>
            
            <div className={styles.briefingDetails}>
              <div className={styles.detailRow}>
                <div className={styles.detailItem}>
                  <label><Target size={14} /> Campanha</label>
                  <strong>{selectedClientNeed.title}</strong>
                </div>
                <div className={styles.detailItem}>
                  <label><DollarSign size={14} /> Investimento</label>
                  <strong className={styles.highlight}>{selectedClientNeed.budget}</strong>
                </div>
              </div>
              
              <div className={styles.detailItem}>
                <label><Calendar size={14} /> Cronograma</label>
                <strong>{selectedClientNeed.period}</strong>
              </div>

              <div className={styles.descriptionBox}>
                <label>Briefing & Requisitos</label>
                <p>{selectedClientNeed.description}</p>
              </div>

              <button className={styles.sendProposalBtn} onClick={() => handleAction('proposal')}>
                <Zap size={18} /> Enviar Proposta Estratégica
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {isSuccessModalOpen && (
        <div className={styles.modalOverlay} onClick={() => setIsSuccessModalOpen(false)}>
          <div className={styles.modal} style={{ maxWidth: '400px', textAlign: 'center' }} onClick={e => e.stopPropagation()}>
            <div className={styles.successIconWrapper}><CheckCircle2 size={40} /></div>
            <h2>Operação Concluída</h2>
            <p>{successMessage}</p>
            <button className={styles.primaryBtn} onClick={() => setIsSuccessModalOpen(false)}>Entendido</button>
          </div>
        </div>
      )}
    </div>
  );
}
