'use client';

import React, { useState } from 'react';
import { FileText, Search, Filter, MessageSquare, CheckCircle, XCircle, Clock, Building2, ExternalLink, X, Target, Users, MapPin, DollarSign, Zap } from 'lucide-react';
import styles from './page.module.css';

export default function ProposalsPage() {
  const [selectedProposal, setSelectedProposal] = useState<any>(null);
  const [showBriefing, setShowBriefing] = useState(false);

  const proposals = [
    {
      id: 1,
      agency: "Agência Global",
      project: "Caminhos do Sol - Verão 2026",
      date: "24/04/2026",
      status: "Pendente",
      budget: "R$ 450.000,00",
      description: "Temos interesse em uma cota de patrocínio master para a marca Nike.",
      contact: "Mariana Silva",
      fullBriefing: {
        brand: "Nike Brasil",
        objective: "Lançamento da linha Summer Running 2026 com foco em sustentabilidade e performance litorânea.",
        target: "Jovens 18-35 anos, corredores urbanos e entusiastas de outdoor.",
        location: "Brasil (Nacional com foco em Capitais litorâneas)",
        channels: ["Digital", "OOH", "Podcast", "Social Media"],
        period: "Outubro a Dezembro 2026"
      }
    },
    {
      id: 2,
      agency: "XYZ Media",
      project: "Podcast Alpha Night",
      date: "23/04/2026",
      status: "Em Negociação",
      budget: "R$ 80.000,00",
      description: "Proposta para 12 inserções de 30s + Menção no início.",
      contact: "Pedro Santos",
      fullBriefing: {
        brand: "Tech House",
        objective: "Awareness para novo serviço de automação residencial via IA.",
        target: "Público Classe AB, 25-50 anos, Early Adopters.",
        location: "São Paulo e Curitiba",
        channels: ["Podcast", "Youtube", "Programática"],
        period: "Setembro 2026"
      }
    }
  ];

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div>
          <h1>Propostas Recebidas</h1>
          <p>Gerencie as solicitações de mídia e parcerias enviadas pelas agências.</p>
        </div>
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
            {proposals.map((p) => (
              <div 
                key={p.id} 
                className={`${styles.proposalItem} ${selectedProposal?.id === p.id ? styles.activeItem : ''}`}
                onClick={() => setSelectedProposal(p)}
              >
                <div className={styles.itemIcon}>
                  <Building2 size={24} />
                </div>
                <div className={styles.itemInfo}>
                  <h3>{p.agency}</h3>
                  <p>Projeto: {p.project}</p>
                  <span>{p.date} • {p.contact}</span>
                </div>
                <div className={`${styles.statusBadge} ${p.status === 'Pendente' ? styles.pending : styles.negotiating}`}>
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
                <h2>Detalhes da Proposta</h2>
                <span className={styles.budgetValue}>{selectedProposal.budget}</span>
              </div>

              <div className={styles.infoBlock}>
                <label>Mensagem da Agência</label>
                <p>{selectedProposal.description}</p>
              </div>

              <div className={styles.infoBlock}>
                <label>Documentação</label>
                <button onClick={() => setShowBriefing(true)} className={styles.docLinkBtn}>
                  <FileText size={16} />
                  <span>Ver Briefing Completo</span>
                  <ExternalLink size={14} />
                </button>
              </div>

              <div className={styles.actions}>
                <button className={styles.acceptBtn}>
                  <CheckCircle size={18} />
                  Aceitar Proposta
                </button>
                <button className={styles.chatBtn}>
                  <MessageSquare size={18} />
                  Abrir Chat
                </button>
                <button className={styles.rejectBtn}>
                  <XCircle size={18} />
                  Recusar
                </button>
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

      {/* Briefing Modal */}
      {showBriefing && selectedProposal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <button className={styles.closeBtn} onClick={() => setShowBriefing(false)}>
              <X size={24} />
            </button>
            
            <div className={styles.modalHeader}>
              <div className={styles.badge}>Briefing Estratégico</div>
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
    </div>
  );
}
