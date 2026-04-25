'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Plus, Search, Filter, Megaphone, Clock, CheckCircle, MoreVertical, Sparkles } from 'lucide-react';
import styles from './page.module.css';

export default function ClientNecessitiesPage() {
  const [necessities, setNecessities] = useState([
    { 
      id: 1, 
      title: "Campanha Institucional 2026", 
      status: "Publicado", 
      date: "24/04/2026", 
      proposals: 3,
      budget: "R$ 500k - 1M",
      description: "Buscamos agência para reposicionamento de marca no mercado nacional."
    }
  ]);

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div>
          <h1>Minhas Necessidades</h1>
          <p>Publique o que sua marca precisa e receba propostas de agências qualificadas.</p>
        </div>
        <button className={styles.primaryBtn}>
          <Plus size={18} />
          <span>Publicar Nova Necessidade</span>
        </button>
      </header>

      <section className={styles.listSection}>
        <div className={styles.controls}>
          <div className={styles.searchBox}>
            <Search size={18} />
            <input type="text" placeholder="Buscar necessidades..." />
          </div>
          <button className={styles.filterBtn}>
            <Filter size={18} />
            <span>Filtros</span>
          </button>
        </div>

        <div className={styles.grid}>
          {necessities.map((n) => (
            <div key={n.id} className={styles.card}>
              <div className={styles.cardHeader}>
                <div className={styles.statusBadge}>{n.status}</div>
                <button className={styles.iconBtn}><MoreVertical size={18} /></button>
              </div>
              
              <div className={styles.cardContent}>
                <h3>{n.title}</h3>
                <p>{n.description}</p>
                <div className={styles.meta}>
                  <span><strong>Investimento:</strong> {n.budget}</span>
                </div>
              </div>

              <div className={styles.cardFooter}>
                <div className={styles.proposalsCount}>
                  <Sparkles size={14} color="var(--primary)" />
                  <span>{n.proposals} Propostas Recebidas</span>
                </div>
                <button className={styles.viewBtn}>Ver Propostas</button>
              </div>
            </div>
          ))}

          <Link href="/dashboard/client/briefings/new" className={styles.emptyCard}>
            <div className={styles.plusIcon}><Plus size={32} /></div>
            <span>Postar Necessidade</span>
          </Link>
        </div>
      </section>
    </div>
  );
}
