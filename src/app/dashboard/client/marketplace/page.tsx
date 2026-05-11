'use client';

import React, { useState } from 'react';
import { 
  Search, Filter, ShoppingBag, Sparkles, Building2, Target, 
  DollarSign, ArrowRight, Star, MapPin, Eye, ExternalLink, 
  SlidersHorizontal, CheckCircle, Zap, ShieldAlert, Users
} from 'lucide-react';
import styles from './page.module.css';
import { useMVPData } from '@/hooks/useMVPData';

export default function ClientMarketplacePage() {
  const [activeTab, setActiveTab] = useState<'vehicles' | 'agencies'>('vehicles');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const { data: realVehicles } = useMVPData('profiles', { role: 'vehicle' });
  const { data: realAgencies } = useMVPData('profiles', { role: 'agency' });

  const vehicles = realVehicles?.map((v: any) => ({
    id: v.id,
    name: v.company_name || 'Veículo HOAS',
    type: v.media_type || 'Digital',
    category: 'Digital',
    reach: '500k+',
    connected: false,
    rating: 4.8
  })) || [];

  const agencies = realAgencies?.map((a: any) => ({
    id: a.id,
    name: a.company_name || 'Agência HOAS',
    specialty: a.position || 'Full Service',
    rating: 4.9,
    projects: 12,
    tags: ['Estratégia', 'Mídia'],
    match: 98
  })) || [];

  const filteredVehicles = vehicles
    .filter(v => {
      const matchesSearch = v.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || v.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });

  const filteredAgencies = agencies.filter(a => 
    a.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    a.specialty.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const vehicleCategories = ['All', 'Televisão', 'Rádio', 'Out of Home', 'Digital'];

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.headerTitle}>
          <h1>Marketplace de Mídia</h1>
          <p>Descubra os melhores veículos e agências para potencializar sua marca.</p>
        </div>
      </header>

      <div className={styles.topActions}>
        <div className={styles.tabContainer}>
          <button 
            className={`${styles.tab} ${activeTab === 'vehicles' ? styles.activeTab : ''}`}
            onClick={() => setActiveTab('vehicles')}
          >
            <ShoppingBag size={18} />
            <span>Veículos em Destaque</span>
          </button>
          <button 
            className={`${styles.tab} ${activeTab === 'agencies' ? styles.activeTab : ''}`}
            onClick={() => setActiveTab('agencies')}
          >
            <Users size={18} />
            <span>Agências Recomendadas</span>
          </button>
        </div>
      </div>

      <div className={styles.searchSection}>
        <div className={styles.controls}>
          <div className={styles.searchBox}>
            <Search size={18} />
            <input 
              type="text" 
              placeholder={`Buscar ${activeTab === 'vehicles' ? 'veículos' : 'agências'}...`}
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
                {v.connected && <span className={styles.connBadge}><CheckCircle size={14} /> Parceiro Ativo</span>}
              </div>
              <div className={styles.cardBody}>
                <div className={styles.vehicleAvatar}>{v.name[0]}</div>
                <h3>{v.name}</h3>
                <div className={styles.reachInfo}><Users size={14} /> {v.reach} de alcance</div>
                <div className={styles.categoryTag}>{v.category}</div>
              </div>
              <div className={styles.cardFooter}>
                <button className={styles.viewBtn}>Ver Media Kit</button>
                <button className={styles.primaryActionBtn}>
                  Solicitar Contato
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className={styles.grid}>
          {filteredAgencies.map((a) => (
            <div key={a.id} className={styles.agencyCard}>
              <div className={styles.aiMatchBadge}><Zap size={14} /> {a.match}% Match</div>
              <div className={styles.agencyHeader}>
                <div className={styles.avatar}>{a.name[0]}</div>
                <div>
                  <h4>{a.name}</h4>
                  <div className={styles.ratingInfo}><Star size={12} fill="#f59e0b" color="#f59e0b" /> <span>{a.rating}</span></div>
                </div>
              </div>
              <div className={styles.agencyBody}>
                <h3>{a.specialty}</h3>
                <p>Agência com sólida experiência em campanhas de alto impacto e performance comprovada.</p>
                <div className={styles.projectCount}>
                  <strong>{a.projects}</strong> projetos entregues via HOAS
                </div>
                <div className={styles.tagCloud}>
                  {a.tags.map((t: string) => <span key={t} className={styles.tag}>{t}</span>)}
                </div>
              </div>
              <div className={styles.cardFooter}>
                <button className={styles.proposalBtn}>
                  Ver Portfólio & Cases
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
