'use client';

import React from 'react';
import { Heart, Globe, Users, HandHelping, Award } from 'lucide-react';
import styles from './page.module.css';
import { useMVPData } from '@/hooks/useMVPData';

export default function CarePage() {
  const { data: campaigns, loading: campaignsLoading } = useMVPData('global_care_campaigns');
  const { data: statsData } = useMVPData('global_stats', { id: 'hoas_care' });
  const stats: any = statsData?.[0] || { lives_impacted: '0', volunteers: '0' };

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
            <span className={styles.statValue}>{stats.lives_impacted}</span>
          </div>
        </div>
        <div className={styles.statCard}>
          <HandHelping className={styles.statIcon} />
          <div className={styles.statInfo}>
            <span className={styles.statLabel}>Voluntários</span>
            <span className={styles.statValue}>{stats.volunteers}</span>
          </div>
        </div>
        <div className={styles.statCard}>
          <Award className={styles.statIcon} />
          <div className={styles.statInfo}>
            <span className={styles.statLabel}>Projetos Sociais</span>
            <span className={styles.statValue}>{campaigns?.length || 0}</span>
          </div>
        </div>
      </div>

      <div className={styles.grid}>
        <section className={styles.mainSection}>
          <div className={styles.sectionHeader}>
            <h2>Campanhas Ativas</h2>
          </div>
          
          <div className={styles.campaignList}>
            {campaignsLoading ? (
              <div className={styles.loading}>Carregando campanhas...</div>
            ) : !campaigns || campaigns.length === 0 ? (
              <div className={styles.empty}>Nenhuma campanha ativa no momento.</div>
            ) : (
              campaigns.map((camp: any) => {
                const progress = camp.goal_value ? Math.round((camp.current_value / camp.goal_value) * 100) : 0;
                return (
                  <div key={camp.id} className={styles.campaignCard}>
                    <div className={styles.campaignProgress}>
                      <div className={styles.progressBar} style={{ width: `${progress}%` }} />
                    </div>
                    <div className={styles.campaignInfo}>
                      <h3>{camp.title}</h3>
                      <p>{camp.description}</p>
                      <div className={styles.campaignFooter}>
                        <span><strong>{progress}%</strong> Arrecadado</span>
                        <button className={styles.donateBtn}>Doar Agora</button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
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
