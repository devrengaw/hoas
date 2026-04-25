import React from 'react';
import { BarChart, PieChart, TrendingUp, AlertCircle, Globe } from 'lucide-react';
import styles from './page.module.css';

export default function ClientDashboard() {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div>
          <h1>Dashboard do Cliente</h1>
          <p>Acompanhe o desempenho das suas campanhas em tempo real.</p>
        </div>
      </header>

      <div className={styles.statsRow}>
        <div className={styles.statCard}>
          <Globe className={styles.statIcon} />
          <div className={styles.statInfo}>
            <span className={styles.statLabel}>Alcance Total</span>
            <span className={styles.statValue}>4.2M</span>
          </div>
        </div>
        <div className={styles.statCard}>
          <TrendingUp className={styles.statIcon} />
          <div className={styles.statInfo}>
            <span className={styles.statLabel}>ROI Estimado</span>
            <span className={styles.statValue}>3.5x</span>
          </div>
        </div>
        <div className={styles.statCard}>
          <AlertCircle className={styles.statIcon} />
          <div className={styles.statInfo}>
            <span className={styles.statLabel}>Alertas IA</span>
            <span className={styles.statValue}>2</span>
          </div>
        </div>
      </div>

      <div className={styles.grid}>
        <section className={styles.mainSection}>
          <div className={styles.sectionHeader}>
            <h2>Visão Geral da Campanha: "Black Friday 2026"</h2>
          </div>
          <div className={styles.performanceBox}>
            <div className={styles.chartPlaceholder}>
              <BarChart size={48} className={styles.mutedIcon} />
              <p>Gráfico de Investimento vs Conversão</p>
            </div>
            <div className={styles.performanceMetrics}>
              <div className={styles.metric}>
                <span>Conversões</span>
                <strong>12.4k</strong>
              </div>
              <div className={styles.metric}>
                <span>CPA Médio</span>
                <strong>R$ 14,20</strong>
              </div>
            </div>
          </div>
        </section>

        <aside className={styles.sideSection}>
          <div className={styles.sectionHeader}>
            <h2>Market Intelligence</h2>
          </div>
          <div className={styles.newsCard}>
            <div className={styles.newsTag}>Trending</div>
            <h3>Varejo cresce 8% no digital</h3>
            <p>O setor automotivo deve aumentar investimento em 12% no próximo trimestre.</p>
          </div>
          <div className={styles.newsCard} style={{ marginTop: '1rem' }}>
            <div className={styles.newsTag}>News</div>
            <h3>Nova regra do CONAR</h3>
            <p>Entenda as mudanças para publicidade de influenciadores.</p>
          </div>
        </aside>
      </div>
    </div>
  );
}
