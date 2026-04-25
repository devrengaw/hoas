'use client';

import React, { useState } from 'react';
import { 
  Briefcase, 
  Search, 
  Filter, 
  MessageSquare, 
  CheckCircle, 
  Clock, 
  Building2, 
  User, 
  Target, 
  DollarSign, 
  ArrowRight,
  Edit3,
  Send,
  XCircle
} from 'lucide-react';
import styles from './page.module.css';

export default function AgencyProposalsPage() {
  const [selectedProposal, setSelectedProposal] = useState<any>(null);
  const [isEditingCost, setIsEditingCost] = useState(false);
  const [counterPrice, setCounterPrice] = useState('');

  const proposals = [
    {
      id: 1,
      client: "Coca-Cola Brasil",
      campaign: "Natal Mágico 2026",
      date: "24/04/2026",
      status: "Novo",
      budget: "R$ 1.200.000,00",
      description: "Precisamos de um planejamento integrado para o Natal, com foco em OOH e Digital em 15 capitais.",
      contact: "Ricardo Almeida",
      objective: "Branding & Awareness",
    },
    {
      id: 2,
      client: "Samsung",
      campaign: "Lançamento Galaxy S27",
      date: "23/04/2026",
      status: "Em Análise",
      budget: "R$ 800.000,00",
      description: "Foco em conversão e pré-venda do novo flagship.",
      contact: "Helena Souza",
      objective: "Performance / Vendas",
    }
  ];

  const handleSendCounter = () => {
    if (selectedProposal) {
      selectedProposal.budget = counterPrice;
      selectedProposal.status = "Proposta Enviada";
      setIsEditingCost(false);
    }
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div>
          <h1>Propostas Recebidas (Clientes)</h1>
          <p>Solicitações de planejamento e propostas comerciais enviadas diretamente por anunciantes.</p>
        </div>
      </header>

      <div className={styles.content}>
        <section className={styles.listSection}>
          <div className={styles.controls}>
            <div className={styles.searchBox}>
              <Search size={18} />
              <input type="text" placeholder="Buscar por cliente ou campanha..." />
            </div>
            <button className={styles.filterBtn}>
              <Filter size={18} />
              <span>Filtros</span>
            </button>
          </div>

          <div className={styles.proposalList}>
            {proposals.map((p) => (
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
                  <p>{p.campaign}</p>
                  <span>{p.date} • {p.contact}</span>
                </div>
                <div className={`${styles.statusBadge} ${p.status === 'Novo' ? styles.new : styles.analyzing}`}>
                  {p.status}
                </div>
              </div>
            ))}
          </div>
        </section>

        <aside className={styles.detailSection}>
          {selectedProposal ? (
            <div className={styles.detailCard}>
              <div className={styles.detailHeader}>
                <h2>Detalhes da Solicitação</h2>
                {isEditingCost ? (
                  <div className={styles.editCostWrapper}>
                    <input 
                      type="text" 
                      className={styles.costInput}
                      value={counterPrice}
                      onChange={(e) => setCounterPrice(e.target.value)}
                    />
                  </div>
                ) : (
                  <span className={styles.budgetValue}>{selectedProposal.budget}</span>
                )}
              </div>

              <div className={styles.infoGrid}>
                <div className={styles.infoBlock}>
                  <label><Target size={14} /> Objetivo</label>
                  <p>{selectedProposal.objective}</p>
                </div>
                <div className={styles.infoBlock}>
                  <label><User size={14} /> Contato</label>
                  <p>{selectedProposal.contact}</p>
                </div>
              </div>

              <div className={styles.infoBlock}>
                <label>Descrição do Briefing do Cliente</label>
                <p className={styles.description}>{selectedProposal.description}</p>
              </div>

              <div className={styles.actions}>
                {isEditingCost ? (
                  <>
                    <button className={styles.primaryAction} onClick={handleSendCounter}>
                      <Send size={18} />
                      Enviar Contra-Proposta ao Cliente
                    </button>
                    <button className={styles.cancelBtn} onClick={() => setIsEditingCost(false)}>
                      Cancelar
                    </button>
                  </>
                ) : (
                  <>
                    <button className={styles.primaryBtn}>
                      <CheckCircle size={18} />
                      Aceitar e Criar Briefing
                    </button>
                    <button className={styles.counterBtn} onClick={() => setIsEditingCost(true)}>
                      <Edit3 size={18} />
                      Ajustar Valor / Proposta
                    </button>
                    <button className={styles.chatBtn}>
                      <MessageSquare size={18} />
                      Falar com Cliente
                    </button>
                  </>
                )}
              </div>
            </div>
          ) : (
            <div className={styles.emptyDetails}>
              <Briefcase size={48} />
              <p>Selecione uma solicitação de cliente para ver os detalhes e iniciar o planejamento.</p>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
