'use client';

import React, { useState } from 'react';
import ProfileCard from '@/components/ProfileCard';
import { 
  Target, TrendingUp, Zap, Calendar, MessageSquare, 
  BarChart3, ShieldCheck, CheckCircle2, Clock, 
  ChevronRight, LayoutDashboard, Users2, DollarSign
} from 'lucide-react';
import styles from './page.module.css';

import { useMVPData } from '@/hooks/useMVPData';
import { supabase } from '@/lib/supabase';

export default function ClientDashboard() {
  const [viewMode, setViewMode] = useState<'personal' | 'team'>('team');
  const [expandedStat, setExpandedStat] = useState<string | null>(null);
  const [companyId, setCompanyId] = useState<string | null>(null);

  React.useEffect(() => {
    const fetchCompany = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data: profile } = await supabase
        .from('profiles')
        .select('company_id')
        .eq('id', user.id)
        .single();
      if (profile?.company_id) setCompanyId(profile.company_id);
    };
    fetchCompany();
  }, []);

  const { data: briefings } = useMVPData<any>('briefings', companyId ? { company_id: companyId } : undefined);
  const { data: meetings } = useMVPData<any>('meetings', companyId ? { company_id: companyId } : undefined);

  const stats = [
    { 
      id: 'campaigns', 
      label: 'Campanhas Ativas', 
      value: briefings?.length.toString() || '0', 
      icon: Target,
      details: [
        { label: 'Em Veiculação', value: briefings?.filter((b: any) => b.status === 'active').length.toString() || '0' },
        { label: 'Em Aprovação', value: briefings?.filter((b: any) => b.status === 'pending').length.toString() || '0' }
      ]
    },
    { 
      id: 'roi', 
      label: 'Agendamentos', 
      value: meetings?.length.toString() || '0', 
      icon: Calendar,
      details: [
        { label: 'Confirmados', value: meetings?.length.toString() || '0' }
      ]
    },
    { 
      id: 'budget', 
      label: 'Budget Planejado', 
      value: 'R$ 0', 
      icon: DollarSign,
      details: [
        { label: 'Budget Total', value: 'R$ 0' },
        { label: 'Disponível', value: 'R$ 0' }
      ]
    },
    { 
      id: 'ai_optim', 
      label: 'Economia IA', 
      value: '0%', 
      icon: Zap,
      details: [
        { label: 'Otimização OOH', value: '0%' }
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
          <h1>Olá</h1>
          <p>Seu portfólio de mídia está sendo preparado.</p>
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
            <p className={styles.emptyProjects}>Nenhum projeto ativo no momento.</p>
          </div>

          <div className={styles.approvalBox}>
            <div className={styles.sectionHeader}>
              <h2>Aprovações Pendentes</h2>
            </div>
            <p className={styles.emptyApprovals}>Nenhuma aprovação pendente.</p>
          </div>
        </section>

        <aside className={styles.sideSection}>
          <div className={styles.sectionHeader}>
            <h2>Seu Executivo de Contas</h2>
          </div>
          <div className={styles.emptyCard}>
             <Users2 size={40} opacity={0.2} />
             <p>Aguardando atribuição</p>
          </div>

          <div className={styles.aiInsightBox}>
            <div className={styles.aiHeader}>
              <Zap size={16} />
              <span>Otimização Sugerida</span>
            </div>
            <p>Nenhuma sugestão de otimização disponível no momento.</p>
          </div>
        </aside>
      </div>
    </div>
  );
}
