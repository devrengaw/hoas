'use client';

import React, { useState, useEffect } from 'react';
import { 
  Kanban, TrendingUp, Search, Filter, MoreHorizontal, Clock, 
  DollarSign, Plus, User, FileText, CheckCircle2, AlertCircle, 
  ArrowRight, Link as LinkIcon, Trash2, X
} from 'lucide-react';
import styles from './page.module.css';
import { mockProposals, Proposal } from '@/lib/mockData';
import { useMVPData } from '@/hooks/useMVPData';

interface Opportunity {
  id: string;
  title: string;
  client_name: string;
  value: string | number;
  stage: string;
  urgency: 'low' | 'normal' | 'high';
  proposal_id?: string;
  contact_name?: string;
  created_at: string;
}

const COLUMNS = [
  { id: 'lead', title: 'Leads / Prospecção', color: '#6366f1' },
  { id: 'briefing', title: 'Em Análise (Briefing)', color: '#a855f7' },
  { id: 'negotiation', title: 'Negociação', color: '#f59e0b' },
  { id: 'closed', title: 'Fechado / Ganho', color: '#10b981' },
];

export default function PipelinePage() {
  const { data: realOpps, loading } = useMVPData('pipeline_deals');
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (realOpps) {
      setOpportunities(realOpps as any);
    }
  }, [realOpps]);
  const [draggedOppId, setDraggedOppId] = useState<string | null>(null);
  
  // Modal State
  const [newOpp, setNewOpp] = useState({
    title: '',
    client: '',
    value: '',
    stage: 'lead',
    urgency: 'normal' as const,
    proposalId: '' as string | number
  });

  const handleDragStart = (e: React.DragEvent, id: string) => {
    setDraggedOppId(id);
    e.dataTransfer.setData('oppId', id);
    e.dataTransfer.effectAllowed = 'move';
    
    // Pequeno atraso para o efeito visual de fantasma ser correto
    setTimeout(() => {
      const el = e.target as HTMLElement;
      el.style.opacity = '0.4';
    }, 0);
  };

  const handleDragEnd = (e: React.DragEvent) => {
    const el = e.target as HTMLElement;
    el.style.opacity = '1';
    setDraggedOppId(null);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, stage: string) => {
    e.preventDefault();
    const id = e.dataTransfer.getData('oppId');
    
    setOpportunities(prev => prev.map(opp => 
      opp.id === id ? { ...opp, stage } : opp
    ));
  };

  const handleAddOpportunity = (e: React.FormEvent) => {
    e.preventDefault();
    const proposal = mockProposals.find(p => p.id === Number(newOpp.proposalId));
    
    const opportunity: Opportunity = {
      id: Date.now().toString(),
      title: newOpp.title,
      client_name: proposal ? proposal.agency : newOpp.client,
      value: proposal ? proposal.budget : newOpp.value,
      stage: newOpp.stage,
      urgency: newOpp.urgency,
      proposal_id: proposal ? String(proposal.id) : undefined,
      contact_name: proposal ? proposal.contact : undefined,
      created_at: new Date().toISOString().split('T')[0]
    };

    setOpportunities([opportunity, ...opportunities]);
    setIsModalOpen(false);
    setNewOpp({ title: '', client: '', value: '', stage: 'lead', urgency: 'normal', proposalId: '' });
  };

  const handleDeleteOpportunity = (id: string) => {
    setOpportunities(prev => prev.filter(opp => opp.id !== id));
  };

  const totalValue = opportunities.reduce((acc, opp) => {
    const val = typeof opp.value === 'string' ? parseInt(opp.value.replace(/[^0-9]/g, '')) : (opp.value || 0);
    return acc + Number(val);
  }, 0);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
  };

  const filteredOpportunities = opportunities.filter(opp => 
    opp.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    opp.client_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.titleArea}>
          <Kanban className={styles.headerIcon} />
          <div>
            <h1>Pipeline Comercial</h1>
            <p>Gerencie o fluxo de fechamento e vincule propostas ativas.</p>
          </div>
        </div>
        
        <div className={styles.headerStats}>
          <div className={styles.statItem}>
            <div className={styles.statIcon}><DollarSign size={20} /></div>
            <div className={styles.statInfo}>
              <span>Pipeline Total</span>
              <strong>{formatCurrency(totalValue)}</strong>
            </div>
          </div>
          <div className={styles.statItem}>
            <div className={styles.statIcon} style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10b981' }}>
              <TrendingUp size={20} />
            </div>
            <div className={styles.statInfo}>
              <span>Probabilidade Média</span>
              <strong>68%</strong>
            </div>
          </div>
        </div>
      </header>

      <div className={styles.actionBar}>
        <div className={styles.searchWrapper}>
          <Search size={18} />
          <input 
            type="text" 
            placeholder="Buscar por cliente ou projeto..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className={styles.actions}>
          <button className={styles.filterBtn}><Filter size={18} /><span>Filtros</span></button>
          <button className={styles.addBtn} onClick={() => setIsModalOpen(true)}>
            <Plus size={18} />
            <span>Nova Oportunidade</span>
          </button>
        </div>
      </div>

      <div className={styles.board}>
        {COLUMNS.map(col => (
          <div 
            key={col.id} 
            className={styles.column}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, col.id)}
          >
            <div className={styles.columnHeader}>
              <div className={styles.columnTitle}>
                <div className={styles.colorDot} style={{ background: col.color }} />
                <h3>{col.title}</h3>
              </div>
              <span className={styles.countBadge}>
                {filteredOpportunities.filter(o => o.stage === col.id).length}
              </span>
            </div>

            <div className={styles.columnContent}>
              {filteredOpportunities
                .filter(opp => opp.stage === col.id)
                .map(opp => (
                  <div 
                    key={opp.id} 
                    className={`${styles.card} ${draggedOppId === opp.id ? styles.dragging : ''}`}
                    draggable
                    onDragStart={(e) => handleDragStart(e, opp.id)}
                    onDragEnd={handleDragEnd}
                  >
                    <div className={styles.cardHeader}>
                      <span className={`${styles.urgencyTag} ${styles[opp.urgency]}`}>
                        {opp.urgency === 'high' ? 'Alta Prioridade' : opp.urgency === 'normal' ? 'Normal' : 'Baixa'}
                      </span>
                      <button className={styles.deleteBtn} onClick={() => handleDeleteOpportunity(opp.id)}>
                        <Trash2 size={14} />
                      </button>
                    </div>

                    <h4 className={styles.cardTitle}>{opp.title}</h4>
                    
                    <div className={styles.cardClient}>
                      <User size={14} />
                      <span>{opp.client_name}</span>
                    </div>

                    {opp.proposal_id && (
                      <div className={styles.linkedProposal}>
                        <LinkIcon size={12} />
                        <span>Proposta #{opp.proposal_id}</span>
                        {opp.contact_name && <span className={styles.contactName}> • {opp.contact_name}</span>}
                      </div>
                    )}

                    <div className={styles.cardFooter}>
                      <div className={styles.value}>
                        <DollarSign size={14} />
                        <span>{formatCurrency(Number(opp.value))}</span>
                      </div>
                      <div className={styles.prediction}>
                        <Clock size={12} />
                        <span>12d</span>
                      </div>
                    </div>
                  </div>
                ))}
              
              <button 
                className={styles.innerAddBtn}
                onClick={() => {
                  setNewOpp({ ...newOpp, stage: col.id });
                  setIsModalOpen(true);
                }}
              >
                <Plus size={14} />
                <span>Adicionar</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* New Opportunity Modal */}
      {isModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <h2>Nova Oportunidade</h2>
              <button onClick={() => setIsModalOpen(false)} className={styles.closeBtn}><X size={20} /></button>
            </div>
            
            <form onSubmit={handleAddOpportunity} className={styles.form}>
              <div className={styles.inputGroup}>
                <label>Vincular Proposta Existente (Opcional)</label>
                <select 
                  value={newOpp.proposalId}
                  onChange={(e) => {
                    const id = e.target.value;
                    const p = mockProposals.find(prop => prop.id === Number(id));
                    if (p) {
                      setNewOpp({
                        ...newOpp,
                        proposalId: id,
                        title: p.project,
                        client: p.agency,
                        value: p.budget
                      });
                    } else {
                      setNewOpp({ ...newOpp, proposalId: '' });
                    }
                  }}
                >
                  <option value="">Nenhuma proposta vinculada</option>
                  {mockProposals.map(p => (
                    <option key={p.id} value={p.id}>{p.project} ({p.agency})</option>
                  ))}
                </select>
              </div>

              <div className={styles.inputGroup}>
                <label>Nome do Projeto / Oportunidade</label>
                <input 
                  required
                  type="text" 
                  value={newOpp.title}
                  onChange={(e) => setNewOpp({ ...newOpp, title: e.target.value })}
                  placeholder="Ex: Campanha Verão 2026"
                />
              </div>

              <div className={styles.row}>
                <div className={styles.inputGroup}>
                  <label>Cliente / Agência</label>
                  <input 
                    required
                    type="text" 
                    value={newOpp.client}
                    onChange={(e) => setNewOpp({ ...newOpp, client: e.target.value })}
                    placeholder="Nome da empresa"
                  />
                </div>
                <div className={styles.inputGroup}>
                  <label>Valor Estimado</label>
                  <input 
                    required
                    type="text" 
                    value={newOpp.value}
                    onChange={(e) => setNewOpp({ ...newOpp, value: e.target.value })}
                    placeholder="R$ 0,00"
                  />
                </div>
              </div>

              <div className={styles.row}>
                <div className={styles.inputGroup}>
                  <label>Etapa Inicial</label>
                  <select 
                    value={newOpp.stage}
                    onChange={(e) => setNewOpp({ ...newOpp, stage: e.target.value })}
                  >
                    {COLUMNS.map(col => (
                      <option key={col.id} value={col.id}>{col.title}</option>
                    ))}
                  </select>
                </div>
                <div className={styles.inputGroup}>
                  <label>Prioridade</label>
                  <select 
                    value={newOpp.urgency}
                    onChange={(e) => setNewOpp({ ...newOpp, urgency: e.target.value as any })}
                  >
                    <option value="low">Baixa</option>
                    <option value="normal">Normal</option>
                    <option value="high">Alta</option>
                  </select>
                </div>
              </div>

              <div className={styles.modalActions}>
                <button type="button" onClick={() => setIsModalOpen(false)} className={styles.cancelBtn}>Cancelar</button>
                <button type="submit" className={styles.submitBtn}>Criar Oportunidade</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
