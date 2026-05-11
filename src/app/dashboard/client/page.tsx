'use client';

import React, { useState } from 'react';
import ProfileCard from '@/components/ProfileCard';
import { 
  Target, TrendingUp, Zap, Calendar, MessageSquare, 
  BarChart3, ShieldCheck, CheckCircle2, Clock, 
  ChevronRight, LayoutDashboard, Users2, DollarSign
} from 'lucide-react';
import styles from './page.module.css';

export default function ClientDashboard() {
  const [viewMode, setViewMode] = useState<'personal' | 'team'>('team');
  const [expandedStat, setExpandedStat] = useState<string | null>(null);

  const stats = [
    { 
      id: 'campaigns', 
      label: 'Campanhas Ativas', 
      value: '12', 
      icon: Target,
      details: [
        { label: 'Em Veiculação', value: '8' },
        { label: 'Em Aprovação', value: '4' }
      ]
    },
    { 
      id: 'roi', 
      label: 'ROI Estimado', 
      value: '4.2x', 
      icon: TrendingUp,
      details: [
        { label: 'Conversão', value: '15%' },
        { label: 'Custo por Lead', value: 'R$ 1.20' }
      ]
    },
    { 
      id: 'budget', 
      label: 'Budget Utilizado', 
      value: 'R$ 2.4M', 
      icon: DollarSign,
      details: [
        { label: 'Budget Total Q2', value: 'R$ 5.0M' },
        { label: 'Disponível', value: 'R$ 2.6M' }
      ]
    },
    { 
      id: 'ai_optim', 
      label: 'Economia IA', 
      value: '18%', 
      icon: Zap,
      details: [
        { label: 'Otimização OOH', value: '12%' },
        { label: 'Eficiência TV', value: '6%' }
      ]
    },
  ];

  const projects = [
    { id: 1, name: 'Lançamento Verão 2026', status: 'Running', health: 95, color: '#10b981' },
    { id: 2, name: 'Black Friday Antecipada', status: 'Planning', health: 100, color: '#6366f1' },
    { id: 3, name: 'Branding Institucional', status: 'Review', health: 88, color: '#f59e0b' },
  ];

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <h1>Olá, Mariana</h1>
          <p>Seu portfólio de mídia está performando acima da média este mês.</p>
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
              <Users2 size={16} /> Visão Marca
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
            <h2>Saúde dos Projetos</h2>
            <button className={styles.seeAllBtn}>Relatório Detalhado <ChevronRight size={14} /></button>
          </div>
          
          <div className={styles.projectHealthGrid}>
            {projects.map(p => (
              <div key={p.id} className={styles.healthCard}>
                <div className={styles.healthHeader}>
                  <h3>{p.name}</h3>
                  <span className={styles.statusBadge} style={{ background: `${p.color}20`, color: p.color }}>{p.status}</span>
                </div>
                <div className={styles.healthMetric}>
                  <div className={styles.metricBar}>
                    <div className={styles.metricFill} style={{ width: `${p.health}%`, backgroundColor: p.color }}></div>
                  </div>
                  <span>{p.health}% Eficiência</span>
                </div>
              </div>
            ))}
          </div>

          <div className={styles.approvalBox}>
            <div className={styles.sectionHeader}>
              <h2>Aprovações Pendentes</h2>
            </div>
            <div className={styles.approvalItem}>
              <div className={styles.approvalInfo}>
                <strong>Plano de Mídia - Outubro/25</strong>
                <p>Agência Global • R$ 450.000,00</p>
              </div>
              <div className={styles.approvalActions}>
                <button className={styles.viewBtn}>Ver Plano</button>
                <button className={styles.approveBtn}>Aprovar PI</button>
              </div>
            </div>
          </div>
        </section>

        <aside className={styles.sideSection}>
          <div className={styles.sectionHeader}>
            <h2>Seu Executivo de Contas</h2>
          </div>
          <ProfileCard 
            name="Roberto Lima"
            role="Diretor de Atendimento"
            company="Agência Global"
            rating={95}
            imageUrl="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=300&h=400"
          />

          <div className={styles.aiInsightBox}>
            <div className={styles.aiHeader}>
              <Zap size={16} />
              <span>Otimização Sugerida</span>
            </div>
            <p>Sugerimos realocar 10% do budget de Digital para OOH no projeto "Lançamento Verão". A IA prevê um aumento de 15% no alcance orgânico.</p>
            <button className={styles.aiActionBtn}>Aplicar Otimização</button>
          </div>
        </aside>
      </div>
    </div>
  );
}
