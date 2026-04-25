import React from 'react';
import { Heart, Globe, Users, HandHelping, Award } from 'lucide-react';
import styles from './page.module.css';

export default function CarePage() {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.heroContent}>
          <Heart size={48} color="var(--accent)" fill="var(--accent)" />
          <h1>HOAS Care</h1>
          <p>O braço social do Hub. Transformando o mercado publicitário em uma força para o bem.</p>
        </div>
      </header>

      <div className={styles.statsRow}>
        <div className={styles.statCard}>
          <Users className={styles.statIcon} />
          <div className={styles.statInfo}>
            <span className={styles.statLabel}>Vidas Impactadas</span>
            <span className={styles.statValue}>15.000+</span>
          </div>
        </div>
        <div className={styles.statCard}>
          <HandHelping className={styles.statIcon} />
          <div className={styles.statInfo}>
            <span className={styles.statLabel}>Voluntários</span>
            <span className={styles.statValue}>1.200</span>
          </div>
        </div>
        <div className={styles.statCard}>
          <Award className={styles.statIcon} />
          <div className={styles.statInfo}>
            <span className={styles.statLabel}>Projetos Sociais</span>
            <span className={styles.statValue}>42</span>
          </div>
        </div>
      </div>

      <div className={styles.grid}>
        <section className={styles.mainSection}>
          <div className={styles.sectionHeader}>
            <h2>Campanhas Ativas</h2>
          </div>
          <div className={styles.campaignCard}>
            <div className={styles.campaignProgress}>
              <div className={styles.progressBar} style={{ width: '75%' }} />
            </div>
            <div className={styles.campaignInfo}>
              <h3>Natal Solidário do Mercado</h3>
              <p>Meta: Arrecadar 5.000 kits de alimentação para comunidades carentes.</p>
              <div className={styles.campaignFooter}>
                <span><strong>75%</strong> Arrecadado</span>
                <button className={styles.donateBtn}>Doar Agora</button>
              </div>
            </div>
          </div>
        </section>

        <aside className={styles.sideSection}>
          <div className={styles.sectionHeader}>
            <h2>Selos de Impacto</h2>
          </div>
          <div className={styles.badgesGrid}>
            <div className={styles.badgeItem}>
              <Award size={32} color="var(--primary)" />
              <span>Selo Bronze</span>
            </div>
            <div className={styles.badgeItem}>
              <Award size={32} color="var(--muted)" />
              <span>Doador Ativo</span>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
