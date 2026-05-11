'use client';

import React, { useState } from 'react';
import ProfileCard from '@/components/ProfileCard';
import { 
  ShoppingBag, Zap, TrendingUp, Calendar, MessageSquare, 
  Users, Target, LayoutDashboard, Users2, Clock, CheckCircle2,
  Tv, Radio, Newspaper, ChevronRight
} from 'lucide-react';
import styles from './page.module.css';
import { useMVPData } from '@/hooks/useMVPData';

export default function AgencyDashboard() {
  const [viewMode, setViewMode] = useState<'personal' | 'team'>('team');
  const [expandedStat, setExpandedStat] = useState<string | null>(null);

  const { data: briefings } = useMVPData('briefings');
  const { data: meetings } = useMVPData('meetings');
  const { data: vehicles } = useMVPData('profiles', { role: 'vehicle' });

  const stats = [
    { 
      id: 'briefings', 
      label: 'Briefings Ativos', 
      value: briefings?.length.toString() || '0', 
      icon: ShoppingBag,
      details: [
        { label: 'Em Negociação', value: briefings?.filter((b: any) => b.status === 'negotiating').length.toString() || '0' },
        { label: 'Aguardando Veículo', value: briefings?.filter((b: any) => b.status === 'pending').length.toString() || '0' }
      ]
    },
    { 
      id: 'ai_matches', 
      label: 'Agendamentos', 
      value: meetings?.length.toString() || '0', 
      icon: Calendar,
      details: [
        { label: 'Hoje', value: '0' },
        { label: 'Próximos', value: meetings?.length.toString() || '0' }
      ]
    },
    { 
      id: 'partners', 
      label: 'Veículos Conectados', 
      value: vehicles?.length.toString() || '0', 
      icon: Users,
      details: [
        { label: 'Favoritos', value: '0' },
        { label: 'Ativos', value: vehicles?.length.toString() || '0' }
      ]
    },
  ];

  const categories = [
    { id: 'tv', name: 'TV & Vídeo', count: 0, icon: Tv, color: '#6366f1' },
    { id: 'radio', name: 'Áudio & Podcast', count: 0, icon: Radio, color: '#ec4899' },
    { id: 'ooh', name: 'Digital & OOH', count: 0, icon: Newspaper, color: '#10b981' },
  ];

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <h1>Dashboard de Mídia</h1>
          <p>Explore oportunidades e gerencie as conexões da sua agência.</p>
        </div>

        <div className={styles.headerRight}>
          <div className={styles.viewToggle}>
            <button 
              className={`${styles.toggleBtn} ${viewMode === 'personal' ? styles.active : ''}`}
              onClick={() => setViewMode('personal')}
            >
              <LayoutDashboard size={16} /> Meus Projetos
            </button>
            <button 
              className={`${styles.toggleBtn} ${viewMode === 'team' ? styles.active : ''}`}
              onClick={() => setViewMode('team')}
            >
              <Users2 size={16} /> Visão Agência
            </button>
          </div>
          <div className={styles.dateDisplay}>
            {new Date().toLocaleDateString('pt-BR', { weekday: 'short', day: 'numeric', month: 'long' })}
          </div>
        </div>
      </header>

      <div className={styles.statsRow}>
        {stats.map((stat) => (
          <div 
            key={stat.id} 
            className={`${styles.statCard} ${expandedStat === stat.id ? styles.active : ''}`}
            onClick={() => setExpandedStat(expandedStat === stat.id ? null : stat.id)}
          >
            <div className={styles.statHeader}>
              <stat.icon className={styles.statIcon} />
              <div className={styles.statInfo}>
                <span className={styles.statLabel}>{stat.label}</span>
                <span className={styles.statValue}>{stat.value}</span>
              </div>
            </div>
            
            {expandedStat === stat.id && (
              <div className={styles.statDetails}>
                {stat.details.map((detail, idx) => (
                  <div key={idx} className={styles.detailItem}>
                    <span>{detail.label}</span>
                    <span>{detail.value}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className={styles.grid}>
        <section className={styles.mainSection}>
          <div className={styles.sectionHeader}>
            <h2>Explorar por Categoria</h2>
            <button className={styles.seeAllBtn}>Ver Todos <ChevronRight size={14} /></button>
          </div>
          <div className={styles.categories}>
            {categories.map(cat => (
              <div key={cat.id} className={styles.categoryCard}>
                <div className={styles.categoryIcon} style={{ color: cat.color }}>
                  <cat.icon size={24} />
                </div>
                <h3>{cat.name}</h3>
                <p>{cat.count} Veículos ativos</p>
                <div className={styles.catAction}>Explorar <ChevronRight size={12} /></div>
              </div>
            ))}
          </div>

          <div className={styles.aiRecommendationBox}>
            <div className={styles.aiBadge}>Recomendação Prioritária</div>
            <div className={styles.aiContent}>
              <p>Nenhuma recomendação disponível para sua agência no momento.</p>
            </div>
          </div>
        </section>

        <aside className={styles.sideSection}>
          <div className={styles.sectionHeader}>
            <h2>Destaque da Semana</h2>
          </div>
          <div className={styles.emptyCard}>
             <Users size={40} opacity={0.2} />
             <p>Nenhum destaque disponível</p>
          </div>
          
          <div className={styles.quickTasks}>
            <h3>Ações Pendentes</h3>
            <p className={styles.emptyTasks}>Nenhuma ação pendente.</p>
          </div>
        </aside>
      </div>
    </div>
  );
}
