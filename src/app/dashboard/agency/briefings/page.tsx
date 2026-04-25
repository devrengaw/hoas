'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Upload, FileText, CheckCircle, AlertCircle, Search, Filter, Zap, Users, ChevronRight } from 'lucide-react';
import styles from './page.module.css';

export default function BriefingsPage() {
  const [selectedBriefing, setSelectedBriefing] = useState<any>(null);

  const briefings = [
    { 
      id: 1, 
      title: "Campanha Verão 2026", 
      agency: "Agência XYZ", 
      date: "24/04/2026", 
      status: "Analisado",
      objective: "Lançamento de novo produto - Linha Summer 2026",
      audience: "Jovens de 18-30 anos, interessados em moda sustentável",
      budget: "R$ 500.000,00",
      timing: "Outubro a Dezembro",
      matches: [
        { name: "David Chen", vehicle: "TV Alpha", score: 98, img: "https://i.pravatar.cc/100?u=David" },
        { name: "Ana Paula", vehicle: "Rede Globo", score: 92, img: "https://i.pravatar.cc/100?u=Ana" },
        { name: "Julia Ferraz", vehicle: "Spotlight", score: 85, img: "https://i.pravatar.cc/100?u=Julia" }
      ]
    },
    { id: 2, title: "Lançamento Tech X", agency: "Alpha Tech", date: "23/04/2026", status: "Em Análise" }
  ];

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div>
          <h1>Briefings</h1>
          <p>Gerencie e analise seus briefings com inteligência artificial.</p>
        </div>
        <Link href="/dashboard/agency/briefings/new" className={styles.uploadBtn}>
          <Upload size={18} />
          <span>Novo Briefing</span>
        </Link>
      </header>

      <div className={styles.content}>
        <section className={styles.listSection}>
          <div className={styles.controls}>
            <div className={styles.searchBox}>
              <Search size={18} />
              <input type="text" placeholder="Buscar briefings..." />
            </div>
            <button className={styles.filterBtn}>
              <Filter size={18} />
              <span>Filtros</span>
            </button>
          </div>

          <div className={styles.briefingList}>
            {briefings.map((b) => (
              <div 
                key={b.id} 
                className={`${styles.briefingItem} ${selectedBriefing?.id === b.id ? styles.activeItem : ''}`}
                onClick={() => setSelectedBriefing(b)}
              >
                <div className={styles.itemIcon}>
                  <FileText size={24} />
                </div>
                <div className={styles.itemInfo}>
                  <h3>{b.title}</h3>
                  <span>Enviado em {b.date} • {b.agency}</span>
                </div>
                <div className={styles.statusBadge}>{b.status}</div>
              </div>
            ))}
          </div>
        </section>

        <aside className={styles.analysisSection}>
          <div className={styles.analysisHeader}>
            <h2>Análise & Matches</h2>
          </div>

          {selectedBriefing?.matches ? (
            <div className={styles.analysisCard}>
              <div className={styles.insightItem}>
                <label>Objetivo</label>
                <p>{selectedBriefing.objective}</p>
              </div>

              <div className={styles.matchSection}>
                <label><Zap size={14} fill="currentColor" /> Veículos Sugeridos (Matches)</label>
                <div className={styles.matchList}>
                  {selectedBriefing.matches.map((m: any, i: number) => (
                    <div key={i} className={styles.matchItem}>
                      <img src={m.img} alt={m.name} />
                      <div className={styles.matchInfo}>
                        <h4>{m.name}</h4>
                        <p>{m.vehicle} • {m.score}% Match</p>
                      </div>
                      <button className={styles.connectBtn}>Chamar</button>
                    </div>
                  ))}
                </div>
              </div>

              <div className={styles.detailsBtn}>
                Ver Detalhes do Público & Canais <ChevronRight size={16} />
              </div>
            </div>
          ) : (
            <div className={styles.emptyAnalysis}>
              <AlertCircle size={48} />
              <p>Selecione um briefing analisado para ver os detalhes e veículos sugeridos.</p>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
