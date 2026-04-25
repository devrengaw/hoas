'use client';

import React from 'react';
import { Kanban, TrendingUp, Search, Filter, MoreHorizontal, Clock, DollarSign } from 'lucide-react';
import styles from './page.module.css';

const columns = [
  { id: 'lead', title: 'Leads / Prospecção', count: 5 },
  { id: 'briefing', title: 'Em Análise (Briefing)', count: 3 },
  { id: 'negotiation', title: 'Negociação', count: 4 },
  { id: 'closed', title: 'Fechado / Ganho', count: 8 },
];

const opportunities = [
  { id: 1, title: 'Campanha Verão 2026', client: 'Agência Global', value: 'R$ 450.000', stage: 'negotiation', urgency: 'high' },
  { id: 2, title: 'Lançamento Tech X', client: 'Alpha Tech', value: 'R$ 120.000', stage: 'lead', urgency: 'normal' },
  { id: 3, title: 'Black Friday Varejo', client: 'Big Retail', value: 'R$ 800.000', stage: 'briefing', urgency: 'high' },
  { id: 4, title: 'Brand Awareness Q3', client: 'Eco Style', value: 'R$ 60.000', stage: 'closed', urgency: 'normal' },
];

export default function PipelinePage() {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div>
          <h1>Pipeline de Vendas</h1>
          <p>Acompanhe o status de cada oportunidade e as sugestões da IA para fechamento.</p>
        </div>
        <div className={styles.summaryStats}>
          <div className={styles.statBox}>
            <span className={styles.statLabel}>Valor Total</span>
            <span className={styles.statValue}>R$ 2.430.000</span>
          </div>
          <div className={styles.statBox}>
            <span className={styles.statLabel}>Taxa de Ganho</span>
            <span className={styles.statValue}>74%</span>
          </div>
        </div>
      </header>

      <div className={styles.controls}>
        <div className={styles.searchBox}>
          <Search size={18} />
          <input type="text" placeholder="Filtrar por cliente ou projeto..." />
        </div>
        <button className={styles.filterBtn}><Filter size={18} /><span>Filtros</span></button>
      </div>

      <div className={styles.board}>
        {columns.map((col) => (
          <div key={col.id} className={styles.column}>
            <div className={styles.columnHeader}>
              <h3>{col.title}</h3>
              <span className={styles.countBadge}>{col.count}</span>
            </div>
            
            <div className={styles.columnContent}>
              {opportunities.filter(opp => opp.stage === col.id).map(opp => (
                <div key={opp.id} className={styles.oppCard}>
                  <div className={styles.oppHeader}>
                    <span className={opp.urgency === 'high' ? styles.urgentTag : styles.normalTag}>
                      {opp.urgency === 'high' ? 'Urgente' : 'Normal'}
                    </span>
                    <button className={styles.moreBtn}><MoreHorizontal size={14} /></button>
                  </div>
                  <h3>{opp.title}</h3>
                  <p>{opp.client}</p>
                  <div className={styles.oppFooter}>
                    <span className={styles.oppValue}>{opp.value}</span>
                    <div className={styles.aiPrediction}>
                      <Clock size={12} />
                      <span>FECHAMENTO EM 12 DIAS</span>
                    </div>
                  </div>
                </div>
              ))}
              <button className={styles.addOppBtn}>+ Adicionar Oportunidade</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
