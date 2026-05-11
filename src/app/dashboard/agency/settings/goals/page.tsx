'use client';

import React, { useState } from 'react';
import { Target, TrendingUp, Users, DollarSign, Calendar, Save, ArrowUpRight, Zap, BarChart, User } from 'lucide-react';
import styles from './page.module.css';

export default function GoalsPage() {
  const [activeTab, setActiveTab] = useState<'global' | 'individual'>('global');
  const [goals, setGoals] = useState({
    monthlyRevenue: "500000",
    proposalsSent: "45",
    meetingsHeld: "28",
    newClients: "12",
    retentionRate: "94"
  });

  const [individualGoals, setIndividualGoals] = useState([
    { id: 1, name: "Lucas Wagner", role: "Admin", revenue: "200000", meetings: "15" },
    { id: 2, name: "Ana Beatriz", role: "Executivo", revenue: "150000", meetings: "20" },
    { id: 3, name: "Carlos Melo", role: "Analista", revenue: "50000", meetings: "10" },
  ]);

  const [isSaving, setIsSaving] = useState(false);

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      alert('Metas atualizadas com sucesso!');
    }, 1500);
  };

  const updateIndividualGoal = (id: number, field: 'revenue' | 'meetings', value: string) => {
    setIndividualGoals(prev => prev.map(g => g.id === id ? { ...g, [field]: value } : g));
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div>
          <div className={styles.breadcrumb}>Configurações • Perfil Master</div>
          <h1>Configuração de Metas</h1>
          <p>Defina os objetivos globais da empresa ou metas individuais por colaborador.</p>
        </div>
        <button 
          className={styles.saveBtn} 
          onClick={handleSave}
          disabled={isSaving}
        >
          {isSaving ? (
            <div className={styles.loader} />
          ) : (
            <>
              <Save size={18} />
              <span>Salvar Alterações</span>
            </>
          )}
        </button>
      </header>

      <div className={styles.tabs}>
        <button 
          className={`${styles.tab} ${activeTab === 'global' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('global')}
        >
          <Target size={18} />
          <span>Metas Globais</span>
        </button>
        <button 
          className={`${styles.tab} ${activeTab === 'individual' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('individual')}
        >
          <Users size={18} />
          <span>Metas Individuais</span>
        </button>
      </div>

      {activeTab === 'global' ? (
        <div className={styles.grid}>
          <div className={styles.mainCard}>
            <div className={styles.cardHeader}>
              <Target size={24} />
              <h2>Metas Mensais Principais</h2>
            </div>
            
            <div className={styles.inputGrid}>
              <div className={styles.field}>
                <label>Receita Alvo (Mensal)</label>
                <div className={styles.inputWrapper}>
                  <DollarSign size={18} />
                  <input 
                    type="number" 
                    value={goals.monthlyRevenue}
                    onChange={(e) => setGoals({...goals, monthlyRevenue: e.target.value})}
                    placeholder="0,00"
                  />
                </div>
                <span>Aparece no gráfico de performance financeira.</span>
              </div>

              <div className={styles.field}>
                <label>Meta de Propostas Enviadas</label>
                <div className={styles.inputWrapper}>
                  <TrendingUp size={18} />
                  <input 
                    type="number" 
                    value={goals.proposalsSent}
                    onChange={(e) => setGoals({...goals, proposalsSent: e.target.value})}
                  />
                </div>
                <span>Indicador de volume de negociações.</span>
              </div>

              <div className={styles.field}>
                <label>Reuniões Realizadas (Semana)</label>
                <div className={styles.inputWrapper}>
                  <Calendar size={18} />
                  <input 
                    type="number" 
                    value={goals.meetingsHeld}
                    onChange={(e) => setGoals({...goals, meetingsHeld: e.target.value})}
                  />
                </div>
                <span>Foco em produtividade e prospecção.</span>
              </div>

              <div className={styles.field}>
                <label>Novos Clientes / Parceiros</label>
                <div className={styles.inputWrapper}>
                  <Users size={18} />
                  <input 
                    type="number" 
                    value={goals.newClients}
                    onChange={(e) => setGoals({...goals, newClients: e.target.value})}
                  />
                </div>
                <span>Meta de expansão de base.</span>
              </div>
            </div>
          </div>

          <aside className={styles.sidebar}>
            <div className={styles.previewCard}>
              <h3>Visualização no Dashboard</h3>
              <div className={styles.previewStats}>
                <div className={styles.previewStat}>
                  <label>Revenue</label>
                  <div className={styles.valRow}>
                    <span className={styles.val}>R$ {(Number(goals.monthlyRevenue) / 1000).toFixed(0)}k</span>
                    <ArrowUpRight size={14} color="#10b981" />
                  </div>
                  <div className={styles.progressTrack}>
                    <div className={styles.progressBar} style={{ width: '65%' }} />
                  </div>
                </div>

                <div className={styles.previewStat}>
                  <label>Meetings</label>
                  <div className={styles.valRow}>
                    <span className={styles.val}>{goals.meetingsHeld}/40</span>
                    <Zap size={14} color="#f59e0b" />
                  </div>
                  <div className={styles.progressTrack}>
                    <div className={styles.progressBar} style={{ width: '45%', background: '#f59e0b' }} />
                  </div>
                </div>
              </div>
              <p className={styles.previewInfo}>Estas metas serão refletidas para todos os membros da sua equipe no Dashboard.</p>
            </div>

            <div className={styles.infoCard}>
              <Zap size={20} />
              <h4>Dica Master</h4>
              <p>Defina metas realistas mas desafiadoras para manter sua equipe de vendas e operação engajada no HOAS.</p>
            </div>
          </aside>
        </div>
      ) : (
        <div className={styles.individualContainer}>
          <div className={styles.individualHeader}>
            <BarChart size={20} />
            <h2>Alocação de Metas por Colaborador</h2>
          </div>

          <div className={styles.userGoalsGrid}>
            <table className={styles.userTable}>
              <thead>
                <tr>
                  <th>Colaborador</th>
                  <th>Cargo</th>
                  <th>Meta de Receita (R$)</th>
                  <th>Meta de Reuniões</th>
                  <th>Produtividade</th>
                </tr>
              </thead>
              <tbody>
                {individualGoals.map((user) => (
                  <tr key={user.id}>
                    <td>
                      <div className={styles.userInfo}>
                        <div className={styles.avatar}>{user.name[0]}</div>
                        <span>{user.name}</span>
                      </div>
                    </td>
                    <td><span className={styles.roleTag}>{user.role}</span></td>
                    <td>
                      <input 
                        type="number" 
                        className={styles.miniInput} 
                        value={user.revenue}
                        onChange={(e) => updateIndividualGoal(user.id, 'revenue', e.target.value)}
                      />
                    </td>
                    <td>
                      <input 
                        type="number" 
                        className={styles.miniInput} 
                        value={user.meetings}
                        onChange={(e) => updateIndividualGoal(user.id, 'meetings', e.target.value)}
                      />
                    </td>
                    <td>
                      <div className={styles.productivity}>
                        <div className={styles.tinyBar} style={{ width: `${Math.min(100, (Number(user.meetings) / 20) * 100)}%` }} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
