'use client';

import React, { useState } from 'react';
import { 
  Search, Filter, Users, CheckCircle, X, Mail, MessageSquare, 
  Phone, Globe, MapPin, Award, TrendingUp, Calendar, ArrowRight,
  ShieldCheck, Zap, Star
} from 'lucide-react';
import Link from 'next/link';
import styles from './page.module.css';
import { useMVPData } from '@/hooks/useMVPData';

export default function AgencyDirectory() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedVehicle, setSelectedVehicle] = useState<any>(null);

  const { data: realVehicles } = useMVPData('profiles', { role: 'vehicle' });

  const vehicles = realVehicles?.map((v: any) => ({
    id: v.id,
    name: v.company_name || 'Veículo HOAS',
    type: v.media_type || 'Digital',
    category: 'Digital',
    reach: '500k+',
    connected: false,
    rating: 4.8
  })) || [];

  const filteredVehicles = vehicles
    .filter(v => {
      const matchesSearch = v.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || v.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });

  const categories = ['All', 'Televisão', 'Rádio', 'Out of Home', 'Digital'];

  return (
    <div className={styles.container}>
      <div className={`${styles.mainContent} ${selectedVehicle ? styles.withSidebar : ''}`}>
        <header className={styles.header}>
          <div>
            <h1>Diretório de Veículos</h1>
            <p>Conecte-se diretamente com os executivos dos maiores veículos do país.</p>
          </div>
        </header>

        <div className={styles.controls}>
          <div className={styles.searchBox}>
            <Search size={20} />
            <input 
              type="text" 
              placeholder="Buscar veículo ou executivo..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className={styles.filterGroup}>
            {categories.map(cat => (
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

        <div className={styles.compactGrid}>
          {filteredVehicles.map((v) => (
            <div 
              key={v.id} 
              className={`${styles.compactCard} ${selectedVehicle?.id === v.id ? styles.selectedCard : ''} ${v.connected ? styles.connectedCard : ''}`}
              onClick={() => setSelectedVehicle(v)}
            >
              <div className={styles.cardAvatar}>
                <div className={styles.avatarInitial}>{v.name[0]}</div>
                {v.connected && <div className={styles.connIndicator}><CheckCircle size={10} /></div>}
              </div>
              <div className={styles.cardName}>{v.name}</div>
              <div className={styles.cardCompany}>{v.type}</div>
              
              <div className={styles.quickActions}>
                <button onClick={(e) => { e.stopPropagation(); alert('Iniciando chat...'); }} title="Chat"><MessageSquare size={14} /></button>
                <button onClick={(e) => { e.stopPropagation(); alert('Enviando email...'); }} title="Email"><Mail size={14} /></button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedVehicle && (
        <aside className={styles.detailsSidebar}>
          <button className={styles.closeSidebar} onClick={() => setSelectedVehicle(null)}><X size={20} /></button>
          
          <div className={styles.sidebarHeader}>
            <div className={styles.largeAvatar}>
              <div className={styles.sidebarInitial}>{selectedVehicle.name[0]}</div>
              <div className={styles.ratingLabel}><Star size={12} fill="currentColor" /> 4.8</div>
            </div>
            <h2>{selectedVehicle.name}</h2>
            <p className={styles.sidebarRole}>{selectedVehicle.type}</p>
            <p className={styles.sidebarCompany}>{selectedVehicle.category}</p>
          </div>

          <div className={styles.sidebarActions}>
            <button className={styles.mainChatBtn}>
              <MessageSquare size={18} /> Chat agora
            </button>
            <button className={styles.secondarySidebarBtn}>
              <Mail size={18} /> E-mail
            </button>
          </div>

          <div className={styles.sidebarInfo}>
            <div className={styles.infoSection}>
              <label><Award size={14} /> Sobre o Veículo</label>
              <p>Veículo líder em audiência na categoria {selectedVehicle.category}, com alcance de {selectedVehicle.reach}.</p>
            </div>

            <div className={styles.infoSection}>
              <label><TrendingUp size={14} /> Alcance & Impacto</label>
              <div className={styles.perfBar}>
                <div className={styles.perfFill} style={{ width: '85%' }}></div>
                <span>{selectedVehicle.reach}</span>
              </div>
            </div>
          </div>

          <Link 
            href={`/dashboard/directory/${selectedVehicle.name.toLowerCase().replace(/ /g, '-')}`} 
            className={styles.viewFullProfileBtn}
          >
            Ver Media Kit Completo <ArrowRight size={16} />
          </Link>
        </aside>
      )}
    </div>
  );
}
