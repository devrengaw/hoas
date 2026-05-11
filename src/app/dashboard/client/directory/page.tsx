'use client';

import React, { useState } from 'react';
import { 
  Search, Filter, Users, CheckCircle, X, Mail, MessageSquare, 
  Phone, Globe, MapPin, Award, TrendingUp, Calendar, ArrowRight,
  ShieldCheck, Zap, Star
} from 'lucide-react';
import styles from './page.module.css';

export default function ClientDirectory() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedAgency, setSelectedAgency] = useState<any>(null);

  const agencies = [
    { id: 1, name: "Agência Global", type: "Full Service", category: "Premium", rating: 4.9, connected: true, bio: "Especialista em grandes contas e marketing de influência.", specialties: ["Influência", "OOH", "TV"] },
    { id: 2, name: "XYZ Media", type: "Performance", category: "Data Driven", rating: 4.7, connected: false, bio: "Foco total em ROI e análise de dados para varejo.", specialties: ["Retail", "Data Analytics"] },
    { id: 3, name: "Creative Co", type: "Branding", category: "Creative", rating: 4.8, connected: true, bio: "Transformando marcas através de criatividade e design.", specialties: ["Design", "Social Media"] },
  ];

  const filteredAgencies = agencies
    .filter(a => {
      const matchesSearch = a.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || a.category === selectedCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      if (a.connected && !b.connected) return -1;
      if (!a.connected && b.connected) return 1;
      return 0;
    });

  const categories = ['All', 'Premium', 'Data Driven', 'Creative'];

  return (
    <div className={styles.container}>
      <div className={`${styles.mainContent} ${selectedAgency ? styles.withSidebar : ''}`}>
        <header className={styles.header}>
          <div>
            <h1>Diretório de Agências</h1>
            <p>Encontre a agência ideal para gerenciar suas campanhas de mídia.</p>
          </div>
        </header>

        <div className={styles.controls}>
          <div className={styles.searchBox}>
            <Search size={20} />
            <input 
              type="text" 
              placeholder="Buscar agência..." 
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
          {filteredAgencies.map((a) => (
            <div 
              key={a.id} 
              className={`${styles.compactCard} ${selectedAgency?.id === a.id ? styles.selectedCard : ''} ${a.connected ? styles.connectedCard : ''}`}
              onClick={() => setSelectedAgency(a)}
            >
              <div className={styles.cardAvatar}>
                <div className={styles.avatarInitial}>{a.name[0]}</div>
                {a.connected && <div className={styles.connIndicator}><CheckCircle size={10} /></div>}
              </div>
              <div className={styles.cardName}>{a.name}</div>
              <div className={styles.cardCompany}>{a.type}</div>
              
              <div className={styles.quickActions}>
                <button onClick={(e) => { e.stopPropagation(); alert('Iniciando chat...'); }} title="Chat"><MessageSquare size={14} /></button>
                <button onClick={(e) => { e.stopPropagation(); alert('Enviando email...'); }} title="Email"><Mail size={14} /></button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedAgency && (
        <aside className={styles.detailsSidebar}>
          <button className={styles.closeSidebar} onClick={() => setSelectedAgency(null)}><X size={20} /></button>
          
          <div className={styles.sidebarHeader}>
            <div className={styles.largeAvatar}>
              <div className={styles.sidebarInitial}>{selectedAgency.name[0]}</div>
              <div className={styles.ratingLabel}><Star size={12} fill="currentColor" /> {selectedAgency.rating}</div>
            </div>
            <h2>{selectedAgency.name}</h2>
            <p className={styles.sidebarRole}>{selectedAgency.type}</p>
            <p className={styles.sidebarCompany}>{selectedAgency.category}</p>
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
              <label><Award size={14} /> Sobre a Agência</label>
              <p>{selectedAgency.bio}</p>
            </div>

            <div className={styles.infoSection}>
              <label><ShieldCheck size={14} /> Especialidades</label>
              <div className={styles.sidebarTags}>
                {selectedAgency.specialties.map((s: string) => <span key={s} className={styles.sidebarTag}>{s}</span>)}
              </div>
            </div>
          </div>

          <button className={styles.viewFullProfileBtn}>
            Ver Portfólio Completo <ArrowRight size={16} />
          </button>
        </aside>
      )}
    </div>
  );
}
