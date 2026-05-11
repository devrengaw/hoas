'use client';

import React, { useState } from 'react';
import ProfileCard from '@/components/ProfileCard';
import MeetingModal from '@/components/MeetingModal';
import { 
  Calendar, MessageSquare, TrendingUp, Users, Target, CheckCircle2, 
  Clock, ChevronRight, LayoutDashboard, Users2 
} from 'lucide-react';
import styles from './page.module.css';
import { useRouter } from 'next/navigation';
import { mockMeetings, Meeting } from '@/lib/mockData';
import { getMeetings } from '@/lib/database';

export default function DashboardHome() {
  const router = useRouter();
  const [viewMode, setViewMode] = useState<'personal' | 'team'>('team');
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showRanking, setShowRanking] = useState(false);
  const [rankingType, setRankingType] = useState<'month' | 'quarter'>('month');
  const [selectedMeeting, setSelectedMeeting] = useState<Meeting | null>(null);

  // Mock Company ID for MVP
  const COMPANY_ID = '00000000-0000-0000-0000-000000000000';

  React.useEffect(() => {
    fetchMeetings();
  }, []);

  const fetchMeetings = async () => {
    try {
      setIsLoading(true);
      const data = await getMeetings(COMPANY_ID);
      const mapped: Meeting[] = data.map((m: any) => {
        const d = new Date(m.scheduled_at);
        return {
          id: m.id,
          title: m.title,
          with: m.guest_name || 'Participante Externo',
          time: d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
          date: d.toISOString().split('T')[0],
          status: m.status as any,
          hasSummary: !!m.ai_summary?.insights
        };
      });
      // Filter for "Today" (simulation: show all for now since it's an empty DB)
      setMeetings(mapped);
    } catch (error) {
      console.error('Error fetching meetings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const teamRanking = [
    { id: 1, name: 'Lucas Wagner', value: 'R$ 320k', progress: 85, avatar: 'LW' },
    { id: 2, name: 'Ana Oliveira', value: 'R$ 280k', progress: 74, avatar: 'AO' },
    { id: 3, name: 'Pedro Santos', value: 'R$ 150k', progress: 40, avatar: 'PS' },
    { id: 4, name: 'Juliana Lima', value: 'R$ 90k', progress: 24, avatar: 'JL' },
  ];

  const handleUpdateMeeting = (updated: Meeting) => {
    setMeetings(prev => prev.map(m => m.id === updated.id ? updated : m));
    setSelectedMeeting(updated);
    
    // Simulação de sincronização com o "backend" (mockMeetings)
    const idx = mockMeetings.findIndex(m => m.id === updated.id);
    if (idx !== -1) mockMeetings[idx] = updated;
  };

  const toggleMeeting = (e: React.MouseEvent, id: number | string) => {
    e.stopPropagation();
    const meeting = meetings.find(m => m.id === id);
    if (!meeting) return;
    
    const updated = { ...meeting, status: meeting.status === 'completed' ? 'upcoming' : 'completed' as any };
    handleUpdateMeeting(updated);
  };

  const pendingMeetings = meetings.filter(m => m.status !== 'completed' && m.status !== 'cancelled');
  const [expandedStat, setExpandedStat] = useState<string | null>(null);

  const stats = [
    { 
      id: 'pipeline', 
      label: `Pipeline ${viewMode === 'team' ? 'Total' : ''}`, 
      value: viewMode === 'team' ? 'R$ 8.4M' : 'R$ 2.4M', 
      icon: TrendingUp,
      details: [
        { label: 'Projetos Ativos', value: viewMode === 'team' ? '24' : '6' },
        { label: 'Conversão Média', value: '18%' }
      ]
    },
    { 
      id: 'meetings', 
      label: 'Reuniões Hoje', 
      value: pendingMeetings.length.toString(), 
      icon: Calendar,
      details: [
        { label: 'Concluídas', value: (meetings.filter(m => m.status === 'completed').length).toString() },
        { label: 'Próxima', value: pendingMeetings[0]?.time || 'Nenhuma' }
      ]
    },
    { 
      id: 'proposals', 
      label: 'Propostas Enviadas', 
      value: viewMode === 'team' ? '48' : '12', 
      icon: MessageSquare,
      details: [
        { label: 'Aguardando', value: '15' },
        { label: 'Aprovadas', value: '8' }
      ]
    },
    { 
      id: 'connections', 
      label: 'Conexões Ativas', 
      value: viewMode === 'team' ? '124' : '+8', 
      icon: Users,
      details: [
        { label: 'Novas este mês', value: '+12' },
        { label: 'Nível Médio', value: 'Sênior' }
      ]
    },
  ];

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <h1>Olá, Lucas</h1>
          <p>Aqui está o resumo do HOAS para hoje.</p>
        </div>

        <div className={styles.headerRight}>
          <div className={styles.viewToggle}>
            <button 
              className={`${styles.toggleBtn} ${viewMode === 'personal' ? styles.active : ''}`}
              onClick={() => setViewMode('personal')}
            >
              <LayoutDashboard size={16} /> Pessoal
            </button>
            <button 
              className={`${styles.toggleBtn} ${viewMode === 'team' ? styles.active : ''}`}
              onClick={() => setViewMode('team')}
            >
              <Users2 size={16} /> Equipe
            </button>
          </div>
          <div className={styles.dateDisplay}>
            {new Date().toLocaleDateString('pt-BR', { weekday: 'short', day: 'numeric', month: 'long' })}
          </div>
        </div>
      </header>

      {viewMode === 'team' && (
        <div className={styles.goalsRow}>
          <div 
            className={`${styles.goalCard} ${styles.clickable}`} 
            onClick={() => { setRankingType('month'); setShowRanking(true); }}
          >
            <div className={styles.goalHeader}>
              <Target size={18} className={styles.goalIcon} />
              <span>Meta do Mês (Vendas)</span>
              <span className={styles.goalProgress}>75%</span>
            </div>
            <div className={styles.progressBar}>
              <div className={styles.progressFill} style={{ width: '75%' }} />
            </div>
            <div className={styles.goalFooter}>
              <span>R$ 750k de R$ 1.0M</span>
              <div className={styles.rankingHint}>Ver Ranking <ChevronRight size={12} /></div>
            </div>
          </div>
          <div 
            className={`${styles.goalCard} ${styles.clickable}`}
            onClick={() => { setRankingType('quarter'); setShowRanking(true); }}
          >
            <div className={styles.goalHeader}>
              <TrendingUp size={18} className={styles.goalIcon} />
              <span>Meta do Quarter (Q2)</span>
              <span className={styles.goalProgress}>42%</span>
            </div>
            <div className={styles.progressBar}>
              <div className={styles.progressFill} style={{ width: '42%' }} />
            </div>
            <div className={styles.goalFooter}>
              <span>R$ 1.26M de R$ 3.0M</span>
              <div className={styles.rankingHint}>Ver Ranking <ChevronRight size={12} /></div>
            </div>
          </div>
        </div>
      )}

      {/* Ranking Modal */}
      {showRanking && (
        <div className={styles.modalOverlay} onClick={() => setShowRanking(false)}>
          <div className={styles.rankingModal} onClick={e => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <div className={styles.modalTitle}>
                <TrendingUp size={20} color="#6366f1" />
                <h2>Ranking de Vendas {rankingType === 'month' ? 'Mensal' : 'Trimestral'}</h2>
              </div>
              <button className={styles.closeBtn} onClick={() => setShowRanking(false)}>×</button>
            </div>
            
            <div className={styles.rankingList}>
              {teamRanking.map((member, index) => (
                <div key={member.id} className={styles.rankingItem}>
                  <div className={styles.rankPosition}>{index + 1}º</div>
                  <div className={styles.memberAvatar}>{member.avatar}</div>
                  <div className={styles.memberInfo}>
                    <div className={styles.memberName}>{member.name}</div>
                    <div className={styles.memberProgress}>
                      <div className={styles.miniProgressBar}>
                        <div className={styles.miniProgressFill} style={{ width: `${member.progress}%` }} />
                      </div>
                      <span>{member.progress}%</span>
                    </div>
                  </div>
                  <div className={styles.memberValue}>{member.value}</div>
                </div>
              ))}
            </div>

            <div className={styles.modalFooter}>
              <p>A métrica é baseada em propostas fechadas e convertidas este {rankingType === 'month' ? 'mês' : 'trimestre'}.</p>
            </div>
          </div>
        </div>
      )}

      {selectedMeeting && (
        <MeetingModal 
          meeting={selectedMeeting} 
          onClose={() => setSelectedMeeting(null)} 
          onUpdate={handleUpdateMeeting} 
        />
      )}

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
          <div className={styles.meetingBox}>
            <div className={styles.sectionHeader}>
              <h2>Reuniões do Dia</h2>
              <span className={styles.badge}>{pendingMeetings.length} pendentes</span>
            </div>
            <div className={styles.meetingList}>
              {meetings.length > 0 ? (
                meetings.map((m) => (
                  <div 
                    key={m.id} 
                    className={`${styles.meetingItem} ${m.status === 'completed' ? styles.completed : ''} ${m.status === 'cancelled' ? styles.cancelled : ''}`}
                    onClick={() => setSelectedMeeting(m)}
                    style={{ cursor: 'pointer' }}
                  >
                    <div className={styles.meetingTime}>
                      <Clock size={14} />
                      <span>{m.time.split(' - ')[0]}</span>
                    </div>
                    <div className={styles.meetingDetails}>
                      <h3>{m.title}</h3>
                      <p>{m.with}</p>
                      {m.status === 'cancelled' && <span className={styles.cancelLabel}>Cancelada</span>}
                    </div>
                    <button 
                      className={styles.checkBtn}
                      onClick={(e) => toggleMeeting(e, m.id)}
                      disabled={m.status === 'cancelled'}
                    >
                      {m.status === 'completed' ? <CheckCircle2 size={20} fill="#10b981" color="white" /> : <div className={styles.checkCircle} />}
                    </button>
                  </div>
                ))
              ) : (
                <div className={styles.emptyMeetings}>
                  <CheckCircle2 size={40} />
                  <p>Todas as reuniões concluídas!</p>
                </div>
              )}
            </div>
          </div>

          <div className={styles.aiInsightBox}>
            <div className={styles.aiBadge}>Insights da Equipe</div>
            <h3>Oportunidade na Vertical de Varejo</h3>
            <p>Identificamos um aumento de 15% nas buscas por campanhas de Black Friday antecipada. Sugerimos abordar a agência **XYZ** para o projeto **Premium Display**.</p>
            <button className={styles.aiAction}>Ver Estratégia</button>
          </div>
        </section>

        <aside className={styles.sideSection}>
          <div className={styles.sectionHeader}>
            <h2>Destaque da Semana</h2>
          </div>
          <ProfileCard 
            name="Mariana Silva"
            role="Diretora de Mídia"
            company="Agência Global"
            rating={92}
            imageUrl="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=300&h=400"
          />
        </aside>
      </div>
    </div>
  );
}
