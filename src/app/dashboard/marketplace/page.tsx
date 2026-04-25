'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Plus, LayoutGrid, List, Trash2, Eye, ExternalLink, Image as ImageIcon, Zap, Building2, MapPin } from 'lucide-react';
import styles from './page.module.css';

export default function MarketplacePage() {
  const [view, setView] = useState<'grid' | 'list'>('grid');

  const myProjects = [
    {
      id: 1,
      title: "Caminhos do Sol - Verão 2026",
      category: "Digital / OOH",
      status: "published",
      views: 1240,
      proposals: 12,
      image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=300"
    }
  ];

  const matchedBriefings = [
    {
      id: 1,
      title: "Campanha Black Friday Varejo",
      agency: "Agência Global",
      budget: "R$ 800k",
      match: 95,
      description: "Buscamos veículos com alta penetração no público jovem (18-35) no Sudeste."
    },
    {
      id: 2,
      title: "Lançamento Nova Coleção",
      agency: "XYZ Media",
      budget: "R$ 150k",
      match: 88,
      description: "Foco em Branding e Awareness para público classe AB."
    }
  ];

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div>
          <h1>Marketplace de Oportunidades</h1>
          <p>Gerencie seus projetos e descubra briefings que dão match com seu perfil.</p>
        </div>
        <Link href="/dashboard/marketplace/new" className={styles.primaryBtn}>
          <Plus size={18} />
          <span>Publicar Novo Projeto</span>
        </Link>
      </header>

      <section className={styles.matchSection}>
        <div className={styles.sectionHeader}>
          <h2><Zap size={20} fill="var(--secondary)" color="var(--secondary)" /> Oportunidades Recomendadas para Você</h2>
          <p>Briefings ativos que possuem alta aderência com seus projetos publicados.</p>
        </div>
        <div className={styles.matchGrid}>
          {matchedBriefings.map((b) => (
            <div key={b.id} className={styles.matchCard}>
              <div className={styles.matchBadge}>{b.match}% Match</div>
              <div className={styles.matchContent}>
                <div className={styles.agencyHeader}>
                  <Building2 size={16} />
                  <span>{b.agency}</span>
                </div>
                <h3>{b.title}</h3>
                <p>{b.description}</p>
                <div className={styles.matchFooter}>
                  <span className={styles.budgetValue}>{b.budget}</span>
                  <button className={styles.proposalBtn}>Enviar Proposta</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className={styles.divider} />

      <div className={styles.controls}>
        <div className={styles.tabs}>
          <button className={styles.tab + ' ' + styles.activeTab}>Meus Projetos Publicados</button>
          <button className={styles.tab}>Rascunhos</button>
        </div>
        <div className={styles.viewSwitch}>
          <button className={`${styles.switchBtn} ${view === 'grid' ? styles.activeSwitch : ''}`} onClick={() => setView('grid')}><LayoutGrid size={18} /></button>
          <button className={`${styles.switchBtn} ${view === 'list' ? styles.activeSwitch : ''}`} onClick={() => setView('list')}><List size={18} /></button>
        </div>
      </div>

      <div className={view === 'grid' ? styles.projectGrid : styles.projectList}>
        {myProjects.map((p) => (
          <div key={p.id} className={view === 'grid' ? styles.projectCard : styles.projectListItem}>
            <div className={styles.projectImage}>
              <img src={p.image} alt={p.title} />
            </div>
            <div className={styles.projectInfo}>
              <h3>{p.title}</h3>
              <span className={styles.categoryBadge}>{p.category}</span>
              <div className={styles.projectMetrics}>
                <div className={styles.metric}><Eye size={14} /><span>{p.views} views</span></div>
                <div className={styles.metric}><ExternalLink size={14} /><span>{p.proposals} propostas</span></div>
              </div>
            </div>
            <div className={styles.projectActions}>
              <button className={styles.actionBtn}>Editar</button>
              <button className={styles.deleteBtn}><Trash2 size={18} /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
