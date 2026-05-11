'use client';

import React, { useState } from 'react';
import { 
  Search, Filter, Users, CheckCircle, X, Mail, MessageSquare, 
  Phone, Globe, MapPin, Award, TrendingUp, Calendar, ArrowRight,
  ShieldCheck, Zap, Star
} from 'lucide-react';
import Link from 'next/link';
import styles from './page.module.css';

export default function MediaDirectory() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedPerson, setSelectedPerson] = useState<any>(null);

  const mediaPros = [
    { 
      id: 1, 
      name: "Mariana Silva", 
      role: "Diretora de Mídia", 
      company: "Agência Global", 
      rating: 92, 
      connected: true, 
      category: "Diretoria",
      email: "mariana@global.com.br",
      phone: "(11) 98888-7777",
      bio: "Especialista em negociações estratégicas de grandes volumes OOH e Digital.",
      specialties: ["OOH", "Digital", "TV"],
      performance: 98
    },
    { 
      id: 2, 
      name: "Pedro Santos", 
      role: "Planejamento", 
      company: "XYZ Media", 
      rating: 88, 
      connected: false, 
      category: "Planejamento",
      email: "pedro@xyzmedia.com",
      phone: "(11) 97777-6666",
      bio: "Focado em análise de dados e performance para campanhas de varejo.",
      specialties: ["Retail", "Data Analytics"],
      performance: 85
    },
    { 
      id: 3, 
      name: "Bia Oliveira", 
      role: "Mídia Online", 
      company: "Creative Co", 
      rating: 91, 
      connected: true, 
      category: "Mídia",
      email: "bia@creative.co",
      phone: "(11) 96666-5555",
      bio: "Expert em mídias sociais e parcerias com influenciadores.",
      specialties: ["Social Ads", "Influence"],
      performance: 94
    },
    { 
      id: 4, 
      name: "Roberto Lima", 
      role: "Sócio Diretor", 
      company: "Impact Agency", 
      rating: 95, 
      connected: false, 
      category: "Diretoria",
      email: "roberto@impact.com",
      phone: "(11) 95555-4444",
      bio: "Liderança executiva com mais de 20 anos no mercado publicitário.",
      specialties: ["Business Strategy", "Networking"],
      performance: 99
    },
  ];

  const filteredPros = mediaPros
    .filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            p.company.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      if (a.connected && !b.connected) return -1;
      if (!a.connected && b.connected) return 1;
      return 0;
    });

  const categories = ['All', 'Diretoria', 'Planejamento', 'Mídia'];

  const handleChat = (e: React.MouseEvent, person: any) => {
    e.stopPropagation();
    alert(`Abrindo chat com ${person.name}...`);
  };

  const handleEmail = (e: React.MouseEvent, person: any) => {
    e.stopPropagation();
    window.location.href = `mailto:${person.email}`;
  };

  return (
    <div className={styles.container}>
      <div className={`${styles.mainContent} ${selectedPerson ? styles.withSidebar : ''}`}>
        <header className={styles.header}>
          <div>
            <h1>Diretório do Ecossistema</h1>
            <p>Conecte-se diretamente com os tomadores de decisão do mercado.</p>
          </div>
        </header>

        <div className={styles.controls}>
          <div className={styles.searchBox}>
            <Search size={20} />
            <input 
              type="text" 
              placeholder="Buscar por nome, cargo ou empresa..." 
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
          {filteredPros.map((p) => (
            <div 
              key={p.id} 
              className={`${styles.compactCard} ${selectedPerson?.id === p.id ? styles.selectedCard : ''} ${p.connected ? styles.connectedCard : ''}`}
              onClick={() => setSelectedPerson(p)}
            >
              <div className={styles.cardAvatar}>
                <div className={styles.avatarInitial}>{p.name[0]}</div>
                {p.connected && <div className={styles.connIndicator}><CheckCircle size={10} /></div>}
              </div>
              <div className={styles.cardName}>{p.name}</div>
              <div className={styles.cardCompany}>{p.company}</div>
              <div className={styles.cardRole}>{p.role}</div>
              
              <div className={styles.quickActions}>
                <button onClick={(e) => handleChat(e, p)} title="Chat"><MessageSquare size={14} /></button>
                <button onClick={(e) => handleEmail(e, p)} title="Email"><Mail size={14} /></button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedPerson && (
        <aside className={styles.detailsSidebar}>
          <button className={styles.closeSidebar} onClick={() => setSelectedPerson(null)}><X size={20} /></button>
          
          <div className={styles.sidebarHeader}>
            <div className={styles.largeAvatar}>
              <div className={styles.sidebarInitial}>{selectedPerson.name[0]}</div>
              <div className={styles.ratingLabel}><Star size={12} fill="currentColor" /> {selectedPerson.rating}% Match</div>
            </div>
            <h2>{selectedPerson.name}</h2>
            <p className={styles.sidebarRole}>{selectedPerson.role}</p>
            <p className={styles.sidebarCompany}>{selectedPerson.company}</p>
          </div>

          <div className={styles.sidebarActions}>
            <button className={styles.mainChatBtn} onClick={(e) => handleChat(e, selectedPerson)}>
              <MessageSquare size={18} /> Chat agora
            </button>
            <button className={styles.secondarySidebarBtn} onClick={(e) => handleEmail(e, selectedPerson)}>
              <Mail size={18} /> E-mail
            </button>
          </div>

          <div className={styles.sidebarInfo}>
            <div className={styles.infoSection}>
              <label><Award size={14} /> Bio</label>
              <p>{selectedPerson.bio || 'Sem biografia disponível.'}</p>
            </div>

            <div className={styles.infoSection}>
              <label><ShieldCheck size={14} /> Especialidades</label>
              <div className={styles.sidebarTags}>
                {(selectedPerson.specialties || []).map((s: string) => (
                  <span key={s} className={styles.sidebarTag}>{s}</span>
                ))}
              </div>
            </div>

            <div className={styles.infoSection}>
              <label><TrendingUp size={14} /> Performance de Negociação</label>
              <div className={styles.perfBar}>
                <div 
                  className={styles.perfFill} 
                  style={{ width: `${selectedPerson.performance || 0}%` }}
                ></div>
                <span>{selectedPerson.performance || 0}%</span>
              </div>
            </div>

            <div className={styles.contactList}>
              <div className={styles.contactItem}>
                <Phone size={14} />
                <span>{selectedPerson.phone || 'Não informado'}</span>
              </div>
              <div className={styles.contactItem}>
                <Globe size={14} />
                <span>LinkedIn Profile</span>
              </div>
            </div>
          </div>

          <Link 
            href={`/dashboard/directory/${selectedPerson.company.toLowerCase().replace(/ /g, '-')}`} 
            className={styles.viewFullProfileBtn}
          >
            Ver Perfil da Empresa <ArrowRight size={16} />
          </Link>
        </aside>
      )}
    </div>
  );
}
