import React from 'react';
import ProfileCard from '@/components/ProfileCard';
import { Search, ShoppingBag, TrendingUp, Zap, Radio, Tv, Newspaper } from 'lucide-react';
import styles from './page.module.css';

export default function AgencyDashboard() {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div>
          <h1>Dashboard de Mídia</h1>
          <p>Explore oportunidades e novos veículos para suas campanhas.</p>
        </div>
      </header>

      <div className={styles.statsRow}>
        <div className={styles.statCard}>
          <ShoppingBag className={styles.statIcon} />
          <div className={styles.statInfo}>
            <span className={styles.statLabel}>Projetos Ativos</span>
            <span className={styles.statValue}>24</span>
          </div>
        </div>
        <div className={styles.statCard}>
          <Zap className={styles.statIcon} />
          <div className={styles.statInfo}>
            <span className={styles.statLabel}>Sugestões IA</span>
            <span className={styles.statValue}>+5</span>
          </div>
        </div>
        <div className={styles.statCard}>
          <TrendingUp className={styles.statIcon} />
          <div className={styles.statInfo}>
            <span className={styles.statLabel}>Market Share</span>
            <span className={styles.statValue}>12%</span>
          </div>
        </div>
      </div>

      <div className={styles.grid}>
        <section className={styles.mainSection}>
          <div className={styles.sectionHeader}>
            <h2>Veículos por Categoria</h2>
          </div>
          <div className={styles.categories}>
            <div className={styles.categoryCard}>
              <Tv size={24} />
              <span>TV & Vídeo</span>
              <p>42 Veículos</p>
            </div>
            <div className={styles.categoryCard}>
              <Radio size={24} />
              <span>Áudio & Podcast</span>
              <p>18 Veículos</p>
            </div>
            <div className={styles.categoryCard}>
              <Newspaper size={24} />
              <span>Digital & OOH</span>
              <p>35 Veículos</p>
            </div>
          </div>

          <div className={styles.sectionHeader} style={{ marginTop: '3rem' }}>
            <h2>Recomendação para seu Briefing: "Verão 2026"</h2>
          </div>
          <div className={styles.aiRecommendation}>
            <div className={styles.aiTag}>Match de 95%</div>
            <h3>Projeto: "Caminhos do Sol" - Veículo Alpha</h3>
            <p>Este projeto tem alta aderência com seu público-alvo de 18-30 anos interessados em sustentabilidade.</p>
            <button className={styles.secondaryBtn}>Solicitar Proposta</button>
          </div>
        </section>

        <aside className={styles.sideSection}>
          <div className={styles.sectionHeader}>
            <h2>Executivo em Destaque</h2>
          </div>
          <ProfileCard 
            name="David Chen"
            role="VP, Advertising Sales"
            company="HOAS Media"
            rating={94}
            imageUrl="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300&h=400"
          />
        </aside>
      </div>
    </div>
  );
}
