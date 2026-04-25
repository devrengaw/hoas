'use client';

import React, { useState } from 'react';
import { Search, Filter, Building2, Target, DollarSign, Calendar, Zap, ArrowRight, Sparkles, Star } from 'lucide-react';
import styles from './page.module.css';

export default function AgencyMarketplaceNecessities() {
  const necessities = [
    {
      id: 1,
      client: "Coca-Cola Brasil",
      title: "Campanha Natal Mágico 2026",
      budget: "R$ 1M - 2M",
      objective: "Branding / Awareness",
      tags: ["Digital", "OOH", "Nacional"],
      description: "Buscamos agência parceira para criar uma experiência imersiva de Natal em 15 capitais brasileiras.",
      match: 98
    },
    {
      id: 2,
      client: "Samsung",
      title: "Launch Event Galaxy S27",
      budget: "R$ 500k - 1M",
      objective: "Lançamento de Produto",
      tags: ["Eventos", "Social Media", "PR"],
      description: "Necessidade de agência com foco em tecnologia e grandes eventos de lançamento simultâneos.",
      match: 85
    }
  ];

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div>
          <h1>Marketplace de Necessidades</h1>
          <p>Encontre oportunidades de novos negócios publicadas diretamente por anunciantes.</p>
        </div>
      </header>

      <div className={styles.controls}>
        <div className={styles.searchBox}>
          <Search size={18} />
          <input type="text" placeholder="Filtrar por marca, objetivo ou tag..." />
        </div>
        <div className={styles.filters}>
          <button className={styles.filterBtn}><Filter size={16} /> Filtros Avançados</button>
          <div className={styles.sort}>
            <span>Ordenar por:</span>
            <select>
              <option>Maior Match IA</option>
              <option>Mais Recentes</option>
              <option>Maior Investimento</option>
            </select>
          </div>
        </div>
      </div>

      <div className={styles.grid}>
        {necessities.map((n) => (
          <div key={n.id} className={styles.card}>
            <div className={styles.cardHeader}>
              <div className={styles.clientInfo}>
                <div className={styles.avatar}>{n.client[0]}</div>
                <div>
                  <h4>{n.client}</h4>
                  <div className={styles.matchTag}>
                    <Sparkles size={12} fill="currentColor" />
                    {n.match}% Match IA
                  </div>
                </div>
              </div>
              <Star size={20} className={styles.favoriteIcon} />
            </div>

            <div className={styles.cardBody}>
              <h3>{n.title}</h3>
              <p>{n.description}</p>
              
              <div className={styles.infoRow}>
                <div className={styles.infoItem}>
                  <Target size={14} />
                  <span>{n.objective}</span>
                </div>
                <div className={styles.infoItem}>
                  <DollarSign size={14} />
                  <span>{n.budget}</span>
                </div>
              </div>

              <div className={styles.tagCloud}>
                {n.tags.map(t => <span key={t} className={styles.tag}>{t}</span>)}
              </div>
            </div>

            <div className={styles.cardFooter}>
              <button className={styles.proposalBtn}>
                Enviar Proposta Estratégica
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
