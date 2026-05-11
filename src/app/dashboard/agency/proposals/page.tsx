'use client';

import React, { useState } from 'react';
import { 
  FileText, 
  Search, 
  Filter, 
  MessageSquare, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Building2, 
  ExternalLink, 
  X, 
  Target, 
  Users, 
  MapPin, 
  DollarSign, 
  Zap,
  Edit3,
  Send
} from 'lucide-react';
import styles from './page.module.css';

const initialProposals = [
  {
    id: 1,
    client: "Coca-Cola Brasil",
    project: "Caminhos do Sol - Verão 2026",
    date: "24/04/2026",
    status: "Pendente",
    budget: "R$ 450.000,00",
    description: "Temos interesse em uma cota de patrocínio master para a marca Nike.",
    contact: "Mariana Silva",
    fullBriefing: {
      brand: "Coca-Cola Brasil",
      objective: "Lançamento da linha Summer Running 2026 com foco em sustentabilidade e performance litorânea.",
      target: "Jovens 18-35 anos, corredores urbanos e entusiastas de outdoor.",
      location: "Brasil (Nacional com foco em Capitais litorâneas)",
      channels: ["Digital", "OOH", "Podcast", "Social Media"],
      period: "Outubro a Dezembro 2026"
    }
  },
  {
    id: 2,
    client: "Samsung",
    project: "Podcast Alpha Night",
    date: "23/04/2026",
    status: "Em Negociação",
    budget: "R$ 80.000,00",
    description: "Proposta para 12 inserções de 30s + Menção no início.",
    contact: "Pedro Santos",
    fullBriefing: {
      brand: "Samsung Galaxy",
      objective: "Awareness para novo serviço de automação residencial via IA.",
      target: "Público Classe AB, 25-50 anos, Early Adopters.",
      location: "São Paulo e Curitiba",
      channels: ["Podcast", "Youtube", "Programática"],
      period: "Setembro 2026"
    }
  }
];

export default function ProposalsPage() {
  const [activeProposals, setActiveProposals] = useState(initialProposals);
  const [selectedProposal, setSelectedProposal] = useState<any>(null);
  const [showBriefing, setShowBriefing] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isEditingCost, setIsEditingCost] = useState(false);
  const [counterPrice, setCounterPrice] = useState('');
  const [chatMessages, setChatMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');

  const handleSendCounter = () => {
    if (selectedProposal) {
      const updatedProposals = activeProposals.map(p => 
        p.id === selectedProposal.id ? { ...p, budget: counterPrice, status: "Em Negociação" } : p
      );
      setActiveProposals(updatedProposals);
      setSelectedProposal({ ...selectedProposal, budget: counterPrice, status: "Em Negociação" });
      setIsEditingCost(false);
    }
  };

  const handleAcceptProposal = () => {
    if (selectedProposal) {
      const updatedProposals = activeProposals.filter(p => p.id !== selectedProposal.id);
      setActiveProposals(updatedProposals);
      setSelectedProposal(null);
      alert(`Proposta de ${selectedProposal.client} aceita! O projeto foi fechado e não está mais disponível no marketplace.`);
    }
  };

  const handleOpenChat = () => {
    if (selectedProposal) {
      if (selectedProposal.status === 'Pendente') {
        const updatedProposals = activeProposals.map(p => 
          p.id === selectedProposal.id ? { ...p, status: "Em Negociação" } : p
        );
        setActiveProposals(updatedProposals);
        setSelectedProposal({ ...selectedProposal, status: "Em Negociação" });
      }
      setChatMessages([
        { id: 1, sender: selectedProposal.contact, text: "Olá! Alguma dúvida sobre nossa proposta estratégica?", time: "10:30" },
      ]);
      setIsChatOpen(true);
    }
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    
    setChatMessages([...chatMessages, {
      id: Date.now(),
      sender: "Você",
      text: newMessage,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }]);
    setNewMessage('');
  };

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmConfig, setConfirmConfig] = useState({ title: '', message: '', onConfirm: () => {} });

  const handleRejectProposal = () => {
    if (selectedProposal) {
      setConfirmConfig({
        title: 'Recusar Proposta',
        message: `Tem certeza que deseja recusar a proposta de ${selectedProposal.client}? Esta ação não pode ser desfeita.`,
        onConfirm: () => {
          const updatedProposals = activeProposals.map(p => 
            p.id === selectedProposal.id ? { ...p, status: "Recusada" } : p
          );
          setActiveProposals(updatedProposals);
          setSelectedProposal({ ...selectedProposal, status: "Recusada" });
          setShowConfirmModal(false);
        }
      });
      setShowConfirmModal(true);
    }
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div>
          <h1>Propostas de Clientes</h1>
          <p>Gerencie as solicitações de mídia e parcerias enviadas pelos clientes.</p>
        </div>
      </header>

      <div className={styles.content}>
        <section className={styles.listSection}>
          <div className={styles.controls}>
            <div className={styles.searchBox}>
              <Search size={18} />
              <input type="text" placeholder="Buscar por cliente ou projeto..." />
            </div>
            <button className={styles.filterBtn}>
              <Filter size={18} />
              <span>Filtros</span>
            </button>
          </div>

          <div className={styles.proposalList}>
            {activeProposals.length > 0 ? (
              activeProposals.map((p) => (
                <div 
                  key={p.id} 
                  className={`${styles.proposalItem} ${selectedProposal?.id === p.id ? styles.activeItem : ''}`}
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
                    <h3>{p.client}</h3>
                    <p>Projeto: {p.project}</p>
                    <span>{p.date} • {p.contact}</span>
                  </div>
                  <div className={`
                    ${styles.statusBadge} 
                    ${p.status === 'Pendente' ? styles.pending : ''} 
                    ${p.status === 'Em Negociação' ? styles.negotiating : ''}
                    ${p.status === 'Recusada' ? styles.rejected : ''}
                  `}>
                    {p.status}
                  </div>
                </div>
              ))
            ) : (
              <div className={styles.emptyList}>
                <CheckCircle size={40} color="#10b981" />
                <p>Nenhuma proposta pendente no momento.</p>
              </div>
            )}
          </div>
        </section>

        <aside className={styles.detailSection}>
          {selectedProposal ? (
            <div className={styles.detailCard}>
              <div className={styles.detailHeader}>
                <h2>Detalhes da Proposta</h2>
                {isEditingCost ? (
                  <div className={styles.editCostWrapper}>
                    <input 
                      type="text" 
                      className={styles.costInput}
                      value={counterPrice}
                      onChange={(e) => setCounterPrice(e.target.value)}
                      autoFocus
                    />
                  </div>
                ) : (
                  <span className={styles.budgetValue}>{selectedProposal.budget}</span>
                )}
              </div>

              <div className={styles.infoBlock}>
                <label>Mensagem do Cliente</label>
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
                {isEditingCost ? (
                  <>
                    <button className={styles.primaryAction} onClick={handleSendCounter}>
                      <Send size={18} />
                      Enviar Contra-Proposta
                    </button>
                    <button className={styles.cancelBtn} onClick={() => setIsEditingCost(false)}>
                      Cancelar
                    </button>
                  </>
                ) : (
                  <>
                    {selectedProposal.status !== 'Recusada' && (
                      <>
                        <button className={styles.acceptBtn} onClick={handleAcceptProposal}>
                          <CheckCircle size={18} />
                          Aceitar Proposta
                        </button>
                        <button className={styles.counterBtn} onClick={() => setIsEditingCost(true)}>
                          <Edit3 size={18} />
                          Alterar Custo
                        </button>
                      </>
                    )}
                    <button className={styles.chatBtn} onClick={handleOpenChat}>
                      <MessageSquare size={18} />
                      Abrir Chat
                    </button>
                    {selectedProposal.status !== 'Recusada' && (
                      <button className={styles.rejectBtn} onClick={handleRejectProposal}>
                        <XCircle size={18} />
                        Recusar
                      </button>
                    )}
                    {selectedProposal.status === 'Recusada' && (
                      <div className={styles.rejectedMessage}>
                        <XCircle size={16} />
                        <span>Esta proposta foi recusada e finalizada.</span>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          ) : (
            <div className={styles.emptyDetails}>
              <Clock size={48} />
              <p>Selecione uma proposta para visualizar os detalhes e iniciar a negociação.</p>
            </div>
          )}
        </aside>
      </div>

      {/* Briefing/Proposal Modal */}
      {showBriefing && selectedProposal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <button className={styles.closeBtn} onClick={() => setShowBriefing(false)}>
              <X size={24} />
            </button>
            
            <div className={styles.modalHeader}>
              <div className={styles.badge}>Proposta Estratégica</div>
              <h1>{selectedProposal.project}</h1>
              <p className={styles.brandName}>Marca: <strong>{selectedProposal.fullBriefing.brand}</strong></p>
            </div>

            <div className={styles.modalGrid}>
              <div className={styles.modalMain}>
                <div className={styles.modalSection}>
                  <h3><Target size={18} /> Objetivo da Campanha</h3>
                  <p>{selectedProposal.fullBriefing.objective}</p>
                </div>

                <div className={styles.modalSection}>
                  <h3><Users size={18} /> Público-Alvo</h3>
                  <p>{selectedProposal.fullBriefing.target}</p>
                </div>

                <div className={styles.modalSection}>
                  <h3><MapPin size={18} /> Praças de Veiculação</h3>
                  <p>{selectedProposal.fullBriefing.location}</p>
                </div>
              </div>

              <aside className={styles.modalAside}>
                <div className={styles.asideCard}>
                  <label><DollarSign size={14} /> Budget Previsto</label>
                  <span>{selectedProposal.budget}</span>
                </div>
                <div className={styles.asideCard}>
                  <label><Clock size={14} /> Período</label>
                  <span>{selectedProposal.fullBriefing.period}</span>
                </div>
                <div className={styles.asideCard}>
                  <label><Zap size={14} /> Canais</label>
                  <div className={styles.tagCloud}>
                    {selectedProposal.fullBriefing.channels.map((c: string) => (
                      <span key={c} className={styles.tag}>{c}</span>
                    ))}
                  </div>
                </div>
              </aside>
            </div>

            <div className={styles.modalFooter}>
              <button className={styles.primaryAction} onClick={() => setShowBriefing(false)}>
                Fechar Visualização
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Chat Modal */}
      {isChatOpen && selectedProposal && (
        <div className={styles.modalOverlay}>
          <div className={styles.chatModal}>
            <div className={styles.chatHeader}>
              <div className={styles.chatInfo}>
                <div className={styles.avatar}>{selectedProposal.client[0]}</div>
                <div>
                  <h3>{selectedProposal.contact}</h3>
                  <p>{selectedProposal.client}</p>
                </div>
              </div>
              <button className={styles.closeBtn} onClick={() => setIsChatOpen(false)}>
                <X size={20} />
              </button>
            </div>
            
            <div className={styles.chatBody}>
              {chatMessages.map((msg) => (
                <div key={msg.id} className={`${styles.message} ${msg.sender === 'Você' ? styles.mine : styles.theirs}`}>
                  <div className={styles.messageContent}>
                    <p>{msg.text}</p>
                    <span>{msg.time}</span>
                  </div>
                </div>
              ))}
            </div>

            <form className={styles.chatFooter} onSubmit={handleSendMessage}>
              <input 
                type="text" 
                placeholder="Digite sua mensagem..." 
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
              />
              <button type="submit" className={styles.sendBtn}>
                <Send size={18} />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Custom Confirm Modal */}
      {showConfirmModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.confirmBox}>
            <div className={styles.confirmHeader}>
              <XCircle size={40} color="#ef4444" />
              <h2>{confirmConfig.title}</h2>
            </div>
            <p>{confirmConfig.message}</p>
            <div className={styles.confirmActions}>
              <button className={styles.cancelBtn} onClick={() => setShowConfirmModal(false)}>Cancelar</button>
              <button className={styles.confirmBtn} onClick={confirmConfig.onConfirm}>Confirmar Ação</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
