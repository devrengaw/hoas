'use client';

import React, { useState } from 'react';
import { Briefcase, Search, Filter, MessageSquare, CheckCircle, Clock, Building2, User, Target, DollarSign, ArrowRight, Zap, Star } from 'lucide-react';
import styles from './page.module.css';

export default function ClientProposalsPage() {
  const [selectedProposal, setSelectedProposal] = useState<any>(null);

  const proposals = [
    {
      id: 1,
      agency: "Agência Global",
      campaign: "Campanha Institucional 2026",
      date: "24/04/2026",
      status: "Pendente",
      match: 98,
      description: "Apresentamos uma estratégia de reposicionamento focada no novo consumidor consciente, utilizando nossa rede de parceiros OOH.",
      contact: "Mariana Silva",
      specialties: ["OOH", "Estratégia", "Nacional"],
    },
    {
      id: 2,
      agency: "XYZ Media",
      campaign: "Campanha Institucional 2026",
      date: "23/04/2026",
      status: "Em Análise",
      match: 85,
      description: "Foco total em canais digitais e influenciadores de nicho para maximizar o alcance entre a Geração Z.",
      contact: "Pedro Santos",
      specialties: ["Digital", "Influencers"],
    }
  ];

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div>
          <h1>Propostas Recebidas de Agências</h1>
          <p>Analise as estratégias e propostas enviadas pelas agências para suas necessidades publicadas.</p>
        </div>
      </header>

      <div className={styles.content}>
        <section className={styles.listSection}>
          <div className={styles.controls}>
            <div className={styles.searchBox}>
              <Search size={18} />
              <input type="text" placeholder="Buscar por agência ou campanha..." />
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
                  <div className={styles.agencyLine}>
                    <h3>{p.agency}</h3>
                    <div className={styles.matchBadge}><Zap size={10} fill="currentColor" /> {p.match}% Match IA</div>
                  </div>
                  <p>Necessidade: {p.campaign}</p>
                  <span>{p.date} • {p.contact}</span>
                </div>
                <div className={`${styles.statusBadge} ${p.status === 'Pendente' ? styles.pending : styles.analyzing}`}>
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
                <h2>Proposta Estratégica</h2>
                <div className={styles.matchScore}>
                  <Star size={16} fill="var(--secondary)" color="var(--secondary)" />
                  <span>Alta Afinidade</span>
                </div>
              </div>

              <div className={styles.infoBlock}>
                <label>Visão da Agência</label>
                <p className={styles.description}>{selectedProposal.description}</p>
              </div>

              <div className={styles.infoBlock}>
                <label>Especialidades Aplicadas</label>
                <div className={styles.tagCloud}>
                  {selectedProposal.specialties.map((s: string) => (
                    <span key={s} className={styles.tag}>{s}</span>
                  ))}
                </div>
              </div>

              <div className={styles.actions}>
                <button className={styles.primaryBtn}>
                  <CheckCircle size={18} />
                  Selecionar Agência
                </button>
                <button className={styles.chatBtn}>
                  <MessageSquare size={18} />
                  Abrir Chat de Negociação
                </button>
                <button className={styles.outlineBtn}>
                  Ver Portfólio da Agência
                </button>
              </div>
            </div>
          ) : (
            <div className={styles.emptyDetails}>
              <Briefcase size={48} />
              <p>Selecione uma proposta de agência para analisar a estratégia e iniciar o contato.</p>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
