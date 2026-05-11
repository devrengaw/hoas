'use client';

import React, { useState } from 'react';
import ProfileCard from '@/components/ProfileCard';
import { 
  ShoppingBag, Zap, TrendingUp, Calendar, MessageSquare, 
  Users, Target, LayoutDashboard, Users2, Clock, CheckCircle2,
  Tv, Radio, Newspaper, ChevronRight
} from 'lucide-react';
import styles from './page.module.css';
import { mockMeetings, Meeting } from '@/lib/mockData';

export default function AgencyDashboard() {
  const [viewMode, setViewMode] = useState<'personal' | 'team'>('team');
  const [expandedStat, setExpandedStat] = useState<string | null>(null);

  const stats = [
    { 
      id: 'briefings', 
      label: 'Briefings Ativos', 
      value: '24', 
      icon: ShoppingBag,
      details: [
        { label: 'Em Negociação', value: '12' },
        { label: 'Aguardando Veículo', value: '8' }
      ]
    },
    { 
      id: 'ai_matches', 
      label: 'Matches da IA', 
      value: '+5', 
      icon: Zap,
      details: [
        { label: 'Alta Afinidade', value: '3' },
        { label: 'Novos Veículos', value: '2' }
      ]
    },
    { 
      id: 'billing', 
      label: 'Investimento Mês', 
      value: 'R$ 1.2M', 
      icon: TrendingUp,
      details: [
        { label: 'Budget Total', value: 'R$ 5.0M' },
        { label: 'Economia via IA', value: 'R$ 45k' }
      ]
    },
    { 
      id: 'partners', 
      label: 'Veículos Conectados', 
      value: '142', 
      icon: Users,
      details: [
        { label: 'Favoritos', value: '12' },
        { label: 'Em Auditoria', value: '4' }
      ]
    },
  ];

  const categories = [
    { id: 'tv', name: 'TV & Vídeo', count: 42, icon: Tv, color: '#6366f1' },
    { id: 'radio', name: 'Áudio & Podcast', count: 18, icon: Radio, color: '#ec4899' },
    { id: 'ooh', name: 'Digital & OOH', count: 35, icon: Newspaper, color: '#10b981' },
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
              <div className={styles.aiMatchScore}>95% Match</div>
              <div>
                <h3>Projeto: "Caminhos do Sol" - Veículo Alpha</h3>
                <p>Este projeto tem alta aderência com o briefing "Verão 2026" e atinge 85% do seu público-alvo principal.</p>
              </div>
              <button className={styles.aiActionBtn}>Ver Detalhes</button>
            </div>
          </div>
        </section>

        <aside className={styles.sideSection}>
          <div className={styles.sectionHeader}>
            <h2>Executivo em Destaque</h2>
          </div>
          <ProfileCard 
            name="David Chen"
            role="VP, Advertising Sales"
            company="HOAS Media"
            rating={94}
            imageUrl="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300&h=400"
          />
          
          <div className={styles.quickTasks}>
            <h3>Ações Pendentes</h3>
            <div className={styles.taskItem}>
              <div className={styles.taskIcon}><MessageSquare size={14} /></div>
              <div className={styles.taskText}>
                <span>Responder Veículo Beta</span>
                <p>Sobre PI #2026-042</p>
              </div>
            </div>
            <div className={styles.taskItem}>
              <div className={styles.taskIcon}><Calendar size={14} /></div>
              <div className={styles.taskText}>
                <span>Reunião de Alinhamento</span>
                <p>Hoje às 16:30</p>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
