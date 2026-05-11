'use client';

import React, { useState } from 'react';
import { 
  Target, TrendingUp, Users, DollarSign, Calendar, Save, 
  ArrowUpRight, Zap, BarChart, User, CheckCircle2, X, Clock
} from 'lucide-react';
import styles from './page.module.css';

export default function GoalsPage() {
  const [activeTab, setActiveTab] = useState<'individual' | 'global'>('individual');
  const [isSaving, setIsSaving] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

  const [individualGoals, setIndividualGoals] = useState([
    { id: 1, name: "Lucas Wagner", role: "Admin", monthlyRevenue: "200000", quarterRevenue: "600000", meetings: "15" },
    { id: 2, name: "Ana Beatriz", role: "Executivo", monthlyRevenue: "150000", quarterRevenue: "450000", meetings: "20" },
    { id: 3, name: "Carlos Melo", role: "Analista", monthlyRevenue: "50000", quarterRevenue: "150000", meetings: "10" },
  ]);

  const [globalGoals, setGlobalGoals] = useState({
    monthlyRevenue: "500000",
    quarterRevenue: "1500000",
    proposalsSent: "45",
    newClients: "12"
  });

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setIsSuccessModalOpen(true);
    }, 1500);
  };

  const updateIndividualGoal = (id: number, field: string, value: string) => {
    setIndividualGoals(prev => prev.map(g => g.id === id ? { ...g, [field]: value } : g));
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div>
          <div className={styles.breadcrumb}>Configurações • Administração da Organização</div>
          <h1>Gestão de Metas</h1>
          <p>Defina os objetivos de performance para sua equipe e para a empresa.</p>
        </div>
        <button 
          className={styles.saveBtn} 
          onClick={handleSave}
          disabled={isSaving}
        >
          {isSaving ? <div className={styles.loader} /> : <><Save size={18} /><span>Salvar Metas</span></>}
        </button>
      </header>

      <div className={styles.tabs}>
        <button 
          className={`${styles.tab} ${activeTab === 'individual' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('individual')}
        >
          <User size={18} />
          <span>Metas Individuais</span>
        </button>
        <button 
          className={`${styles.tab} ${activeTab === 'global' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('global')}
        >
          <Target size={18} />
          <span>Metas Globais (Org)</span>
        </button>
      </div>

      {activeTab === 'individual' ? (
        <div className={styles.contentBox}>
          <div className={styles.sectionTitle}>
            <BarChart size={20} />
            <h2>Alocação por Colaborador</h2>
          </div>

          <div className={styles.tableWrapper}>
            <table className={styles.userTable}>
              <thead>
                <tr>
                  <th>Colaborador</th>
                  <th>Meta Mensal (R$)</th>
                  <th>Meta Quarter (R$)</th>
                  <th>Reuniões / Mês</th>
                  <th>Produtividade</th>
                </tr>
              </thead>
              <tbody>
                {individualGoals.map((user) => (
                  <tr key={user.id}>
                    <td>
                      <div className={styles.userInfo}>
                        <div className={styles.avatar}>{user.name[0]}</div>
                        <div>
                          <strong>{user.name}</strong>
                          <span>{user.role}</span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className={styles.inputWrapper}>
                        <DollarSign size={14} />
                        <input 
                          type="number" 
                          value={user.monthlyRevenue}
                          onChange={(e) => updateIndividualGoal(user.id, 'monthlyRevenue', e.target.value)}
                        />
                      </div>
                    </td>
                    <td>
                      <div className={styles.inputWrapper}>
                        <TrendingUp size={14} />
                        <input 
                          type="number" 
                          value={user.quarterRevenue}
                          onChange={(e) => updateIndividualGoal(user.id, 'quarterRevenue', e.target.value)}
                        />
                      </div>
                    </td>
                    <td>
                      <div className={styles.inputWrapper}>
                        <Clock size={14} />
                        <input 
                          type="number" 
                          value={user.meetings}
                          onChange={(e) => updateIndividualGoal(user.id, 'meetings', e.target.value)}
                        />
                      </div>
                    </td>
                    <td>
                      <div className={styles.prodRow}>
                        <div className={styles.miniTrack}>
                          <div className={styles.miniFill} style={{ width: `${Math.min(100, (Number(user.meetings) / 25) * 100)}%` }} />
                        </div>
                        <span>{Math.round((Number(user.meetings) / 25) * 100)}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className={styles.globalGrid}>
          <div className={styles.mainCard}>
            <div className={styles.cardHeader}><Target size={24} /><h2>Objetivos da Organização</h2></div>
            <div className={styles.inputGrid}>
              <div className={styles.field}>
                <label>Faturamento Mensal Alvo</label>
                <div className={styles.fieldInput}>
                  <DollarSign size={18} />
                  <input type="number" value={globalGoals.monthlyRevenue} onChange={e => setGlobalGoals({...globalGoals, monthlyRevenue: e.target.value})} />
                </div>
              </div>
              <div className={styles.field}>
                <label>Faturamento Quarter (Q2)</label>
                <div className={styles.fieldInput}>
                  <TrendingUp size={18} />
                  <input type="number" value={globalGoals.quarterRevenue} onChange={e => setGlobalGoals({...globalGoals, quarterRevenue: e.target.value})} />
                </div>
              </div>
              <div className={styles.field}>
                <label>Meta de Novos Clientes</label>
                <div className={styles.fieldInput}>
                  <Users size={18} />
                  <input type="number" value={globalGoals.newClients} onChange={e => setGlobalGoals({...globalGoals, newClients: e.target.value})} />
                </div>
              </div>
              <div className={styles.field}>
                <label>Propostas / Mês</label>
                <div className={styles.fieldInput}>
                  <Zap size={18} />
                  <input type="number" value={globalGoals.proposalsSent} onChange={e => setGlobalGoals({...globalGoals, proposalsSent: e.target.value})} />
                </div>
              </div>
            </div>
          </div>

          <aside className={styles.infoAside}>
            <div className={styles.infoCard}>
              <Zap size={20} color="#f59e0b" />
              <h3>Impacto no Dashboard</h3>
              <p>As metas configuradas aqui serão exibidas para toda a equipe, servindo como base para o ranking de performance e indicadores de sucesso.</p>
            </div>
          </aside>
        </div>
      )}

      {/* Success Modal */}
      {isSuccessModalOpen && (
        <div className={styles.modalOverlay} onClick={() => setIsSuccessModalOpen(false)}>
          <div className={styles.modal} onClick={e => e.stopPropagation()}>
            <div className={styles.successIconWrapper}><CheckCircle2 size={40} /></div>
            <h2>Metas Atualizadas</h2>
            <p>Os novos objetivos foram salvos e já estão refletidos no dashboard da equipe.</p>
            <button className={styles.primaryBtn} onClick={() => setIsSuccessModalOpen(false)}>Confirmar</button>
          </div>
        </div>
      )}
    </div>
  );
}
