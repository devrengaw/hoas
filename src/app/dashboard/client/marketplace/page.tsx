'use client';

import React, { useState } from 'react';
import { Search, Filter, Bookmark, Send, Info, Zap, Star } from 'lucide-react';
import styles from './page.module.css';

const projects = [
  {
    id: 1,
    title: "Caminhos do Sol - Verão 2026",
    vehicle: "TV Alpha",
    category: "TV / Digital",
    reach: "2.5M+",
    budget: "R$ 300k - 500k",
    match: 98,
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=400"
  },
  {
    id: 2,
    title: "Podcast: Futuro Sustentável",
    vehicle: "Rede Audio",
    category: "Podcast / Audio",
    reach: "500k+",
    budget: "R$ 50k - 100k",
    match: 85,
    image: "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&q=80&w=400"
  },
  {
    id: 3,
    title: "Circuito Premium OOH SP",
    vehicle: "Alpha Outdoor",
    category: "OOH",
    reach: "10M+",
    budget: "R$ 800k+",
    match: 92,
    image: "https://images.unsplash.com/photo-1542744094-24638eff58bb?auto=format&fit=crop&q=80&w=400"
  }
];

export default function AgencyMarketplace() {
  const [activeFilter, setActiveFilter] = useState('All');

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div>
          <h1>Marketplace de Projetos</h1>
          <p>Encontre os melhores projetos comerciais e oportunidades para seus clientes.</p>
        </div>
      </header>

      <div className={styles.controls}>
        <div className={styles.searchBar}>
          <Search size={20} />
          <input type="text" placeholder="Buscar por palavra-chave, veículo ou vertical..." />
        </div>
        <div className={styles.filters}>
          {['All', 'Digital', 'TV', 'OOH', 'Audio'].map(f => (
            <button 
              key={f} 
              className={`${styles.filterBtn} ${activeFilter === f ? styles.activeFilter : ''}`}
              onClick={() => setActiveFilter(f)}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.aiBanner}>
        <Zap size={24} fill="currentColor" />
        <div className={styles.aiText}>
          <strong>IA de Recomendação Ativa:</strong> Baseado no seu briefing "Verão 2026", o projeto <strong>"Caminhos do Sol"</strong> é a melhor escolha.
        </div>
        <button className={styles.aiAction}>Ver Match</button>
      </div>

      <div className={styles.projectGrid}>
        {projects.map((p) => (
          <div key={p.id} className={styles.projectCard}>
            <div className={styles.imageContainer}>
              <img src={p.image} alt={p.title} />
              <div className={styles.matchBadge}>{p.match}% Match</div>
              <button className={styles.saveBtn}><Bookmark size={18} /></button>
            </div>
            <div className={styles.projectContent}>
              <div className={styles.category}>{p.category}</div>
              <h3>{p.title}</h3>
              <p className={styles.vehicleName}>{p.vehicle}</p>
              
              <div className={styles.meta}>
                <div className={styles.metaItem}>
                  <span>Alcance</span>
                  <strong>{p.reach}</strong>
                </div>
                <div className={styles.metaItem}>
                  <span>Budget</span>
                  <strong>{p.budget}</strong>
                </div>
              </div>

              <div className={styles.actions}>
                <button className={styles.detailsBtn}><Info size={16} /> Detalhes</button>
                <button className={styles.proposalBtn}><Send size={16} /> Solicitar Proposta</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
