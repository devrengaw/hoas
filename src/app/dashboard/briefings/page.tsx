'use client';

import React, { useState, useEffect } from 'react';
import { 
  FileText, Search, Filter, MessageSquare, CheckCircle, XCircle, 
  Clock, Building2, ExternalLink, X, Target, Users, MapPin, 
  DollarSign, Zap, Edit3, Send, UserPlus, ShieldAlert
} from 'lucide-react';
import styles from './page.module.css';
import { mockProposals, Proposal, currentUser } from '../../../lib/mockData';

export default function ProposalsPage() {
  // Access Control Logic
  const isMaster = currentUser.role === 'MASTER';
  
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [selectedProposal, setSelectedProposal] = useState<Proposal | null>(null);
  const [showBriefing, setShowBriefing] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isEditingCost, setIsEditingCost] = useState(false);
  const [counterPrice, setCounterPrice] = useState('');
  const [chatMessages, setChatMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [showAssignModal, setShowAssignModal] = useState(false);

  useEffect(() => {
    // Logic: 
    // 1. Only show connected opportunities (Matchmaking rule)
    // 2. But if Master, show ALL briefings/proposals
    // 3. If Team Member, show only assigned to them
    
    let filtered = mockProposals;

    if (!isMaster) {
      if (currentUser.role === 'TEAM_MEMBER') {
        filtered = mockProposals.filter(p => p.assignedTo === currentUser.name);
      } else if (currentUser.role === 'MEDIA_AGENCY') {
        // Media users see only opportunities from connected vehicles
        filtered = mockProposals.filter(p => p.hasConnection);
      }
    }
    
    setProposals(filtered);
  }, [isMaster]);

  const handleSendCounter = () => {
    if (selectedProposal) {
      const updated = proposals.map(p => 
        p.id === selectedProposal.id ? { ...p, budget: counterPrice, status: "Em Negociação" } : p
      );
      setProposals(updated);
      setSelectedProposal({ ...selectedProposal, budget: counterPrice, status: "Em Negociação" });
      setIsEditingCost(false);
    }
  };

  const handleAcceptProposal = () => {
    if (selectedProposal) {
      setProposals(proposals.filter(p => p.id !== selectedProposal.id));
      setSelectedProposal(null);
      alert(`Proposta de ${selectedProposal.agency} aceita!`);
    }
  };

  const handleAssign = (memberName: string) => {
    if (selectedProposal) {
      const updated = proposals.map(p => 
        p.id === selectedProposal.id ? { ...p, assignedTo: memberName } : p
      );
      setProposals(updated);
      setSelectedProposal({ ...selectedProposal, assignedTo: memberName });
      setShowAssignModal(false);
      alert(`Proposta direcionada para ${memberName}`);
    }
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    setChatMessages([...chatMessages, { id: Date.now(), sender: "Você", text: newMessage, time: "10:30" }]);
    setNewMessage('');
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div>
          <h1>{isMaster ? 'Briefings & Propostas (Master)' : 'Minhas Propostas'}</h1>
          <p>{isMaster ? 'Visão global de todas as oportunidades da plataforma.' : 'Gerencie as solicitações direcionadas a você.'}</p>
        </div>
        {isMaster && (
          <div className={styles.masterBadge}>
            <ShieldAlert size={16} />
            <span>Acesso Master Ativo</span>
          </div>
        )}
      </header>

      <div className={styles.content}>
        <section className={styles.listSection}>
          <div className={styles.controls}>
            <div className={styles.searchBox}>
              <Search size={18} />
              <input type="text" placeholder="Buscar por agência ou projeto..." />
            </div>
            <button className={styles.filterBtn}>
              <Filter size={18} />
              <span>Filtros</span>
            </button>
          </div>

          <div className={styles.proposalList}>
            {proposals.length > 0 ? (
              proposals.map((p) => (
                <div 
                  key={p.id} 
                  className={`${styles.proposalItem} ${selectedProposal?.id === p.id ? styles.activeItem : ''} ${!p.hasConnection && isMaster ? styles.noConnection : ''}`}
                  onClick={() => {
                    setSelectedProposal(p);
                    setCounterPrice(p.budget);
                    setIsEditingCost(false);
                  }}
                >
                  <div className={styles.itemIcon}>
                    <Building2 size={24} />
                  </div>
                  <div className={styles.itemInfo}>
                    <div className={styles.titleRow}>
                      <h3>{p.agency}</h3>
                      {!p.hasConnection && <span className={styles.matchBadge}><Zap size={10} /> IA: Novo Match</span>}
                    </div>
                    <p>Projeto: {p.project}</p>
                    <div className={styles.assignmentInfo}>
                      <span>{p.date} • {p.contact}</span>
                      {p.assignedTo && <span className={styles.assignedBadge}><Users size={10} /> {p.assignedTo}</span>}
                    </div>
                  </div>
                  <div className={`${styles.statusBadge} ${styles[p.status.toLowerCase().replace(/\s/g, '_')]}`}>
                    {p.status}
                  </div>
                </div>
              ))
            ) : (
              <div className={styles.emptyList}>
                <CheckCircle size={40} color="#10b981" />
                <p>Nenhuma proposta para exibir.</p>
              </div>
            )}
          </div>
        </section>

        <aside className={styles.detailSection}>
          {selectedProposal ? (
            <div className={styles.detailCard}>
              <div className={styles.detailHeader}>
                <h2>Detalhes da Proposta</h2>
                <span className={styles.budgetValue}>{selectedProposal.budget}</span>
              </div>

              {isMaster && (
                <div className={styles.masterActions}>
                  <button className={styles.assignBtn} onClick={() => setShowAssignModal(true)}>
                    <UserPlus size={16} />
                    <span>{selectedProposal.assignedTo ? 'Redirecionar' : 'Direcionar para Equipe'}</span>
                  </button>
                </div>
              )}

              <div className={styles.infoBlock}>
                <label>Status de Conexão</label>
                <div className={`${styles.connStatus} ${selectedProposal.hasConnection ? styles.connected : styles.disconnected}`}>
                  {selectedProposal.hasConnection ? '✓ Conexão Ativa' : '⚠ Sem Conexão Prévia (IA Match)'}
                </div>
              </div>

              <div className={styles.infoBlock}>
                <label>Mensagem da Agência</label>
                <p>{selectedProposal.description}</p>
              </div>

              <div className={styles.infoBlock}>
                <label>Documentação</label>
                <button onClick={() => setShowBriefing(true)} className={styles.docLinkBtn}>
                  <FileText size={16} />
                  <span>Ver Proposta Completa</span>
                  <ExternalLink size={14} />
                </button>
              </div>

              <div className={styles.actions}>
                <button className={styles.acceptBtn} onClick={handleAcceptProposal}>Aceitar</button>
                <button className={styles.chatBtn} onClick={() => setIsChatOpen(true)}>Abrir Chat</button>
                <button className={styles.rejectBtn}>Recusar</button>
              </div>
            </div>
          ) : (
            <div className={styles.emptyDetails}>
              <Clock size={48} />
              <p>Selecione uma proposta para visualizar os detalhes.</p>
            </div>
          )}
        </aside>
      </div>

      {/* Assignment Modal */}
      {showAssignModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.smallModal}>
            <h3>Direcionar Proposta</h3>
            <p>Selecione um membro da equipe para gerenciar esta negociação.</p>
            <div className={styles.teamList}>
              {['Ana Oliveira', 'Pedro Santos', 'Juliana Lima'].map(name => (
                <button key={name} className={styles.teamMemberBtn} onClick={() => handleAssign(name)}>
                  <div className={styles.memberAvatar}>{name[0]}</div>
                  <span>{name}</span>
                </button>
              ))}
            </div>
            <button className={styles.closeBtn} onClick={() => setShowAssignModal(false)}>Cancelar</button>
          </div>
        </div>
      )}

      {/* Briefing Modal (simplified) */}
      {showBriefing && selectedProposal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <button className={styles.closeBtn} onClick={() => setShowBriefing(false)}><X size={24} /></button>
            <h1>{selectedProposal.project}</h1>
            <div className={styles.modalContent}>
              <h3>Objetivo</h3>
              <p>{selectedProposal.fullBriefing.objective}</p>
              <h3>Público</h3>
              <p>{selectedProposal.fullBriefing.target}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
