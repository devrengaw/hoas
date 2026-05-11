'use client';

import React from 'react';
import { BarChart2, TrendingUp, Users, Target, ShieldCheck } from 'lucide-react';
import styles from './page.module.css';

export default function PlatformPipeline() {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div>
          <div className={styles.adminBadge}>
            <ShieldCheck size={14} />
            <span>Admin Insights</span>
          </div>
          <h1>Pipeline Global</h1>
          <p>Visão consolidada de todas as negociações em andamento no ecossistema HOAS.</p>
        </div>
      </header>

      <div className={styles.statsRow}>
        <div className={styles.statCard}>
          <span>Volume Total</span>
          <strong>R$ 12.450.000</strong>
          <small className={styles.up}>+15% este mês</small>
        </div>
        <div className={styles.statCard}>
          <span>Negociações Ativas</span>
          <strong>142</strong>
          <small>Em 12 agências</small>
        </div>
        <div className={styles.statCard}>
          <span>Taxa de Conversão</span>
          <strong>68%</strong>
          <small className={styles.up}>+4% vs Jan</small>
        </div>
      </div>

      <div className={styles.placeholderBox}>
        <BarChart2 size={48} />
        <h2>Gráfico de Pipeline Global</h2>
        <p>Esta área exibirá a distribuição de propostas por estágio em todo o sistema.</p>
      </div>
    </div>
  );
}
