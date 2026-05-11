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
          <strong>R$ 0</strong>
          <small>Início do período</small>
        </div>
        <div className={styles.statCard}>
          <span>Negociações Ativas</span>
          <strong>0</strong>
          <small>Nenhuma agência ativa</small>
        </div>
        <div className={styles.statCard}>
          <span>Taxa de Conversão</span>
          <strong>0%</strong>
          <small>Sem dados históricos</small>
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
