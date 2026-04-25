import React from 'react';
import ProfileCard from '@/components/ProfileCard';
import { Calendar, MessageSquare, TrendingUp, Users } from 'lucide-react';
import styles from './page.module.css';

export default function DashboardHome() {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div>
          <h1>Olá, Lucas</h1>
          <p>Aqui está o que está acontecendo no HOAS hoje.</p>
        </div>
        <div className={styles.dateDisplay}>
          {new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}
        </div>
      </header>

      <div className={styles.statsRow}>
        <div className={styles.statCard}>
          <TrendingUp className={styles.statIcon} />
          <div className={styles.statInfo}>
            <span className={styles.statLabel}>Pipeline</span>
            <span className={styles.statValue}>R$ 2.4M</span>
          </div>
        </div>
        <div className={styles.statCard}>
          <Calendar className={styles.statIcon} />
          <div className={styles.statInfo}>
            <span className={styles.statLabel}>Reuniões Hoje</span>
            <span className={styles.statValue}>4</span>
          </div>
        </div>
        <div className={styles.statCard}>
          <MessageSquare className={styles.statIcon} />
          <div className={styles.statInfo}>
            <span className={styles.statLabel}>Briefings Ativos</span>
            <span className={styles.statValue}>12</span>
          </div>
        </div>
        <div className={styles.statCard}>
          <Users className={styles.statIcon} />
          <div className={styles.statInfo}>
            <span className={styles.statLabel}>Novas Conexões</span>
            <span className={styles.statValue}>+8</span>
          </div>
        </div>
      </div>

      <div className={styles.grid}>
        <section className={styles.mainSection}>
          <div className={styles.sectionHeader}>
            <h2>Insights da IA</h2>
          </div>
          <div className={styles.aiInsightBox}>
            <div className={styles.aiBadge}>Recomendação</div>
            <h3>Oportunidade na Vertical de Varejo</h3>
            <p>Identificamos um aumento de 15% nas buscas por campanhas de Black Friday antecipada. Sugerimos abordar a agência **XYZ** para o projeto **Premium Display**.</p>
            <button className={styles.aiAction}>Ver Detalhes</button>
          </div>
        </section>

        <aside className={styles.sideSection}>
          <div className={styles.sectionHeader}>
            <h2>Destaque da Semana</h2>
          </div>
          <ProfileCard 
            name="Mariana Silva"
            role="Diretora de Mídia"
            company="Agência Global"
            rating={92}
            imageUrl="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=300&h=400"
          />
        </aside>
      </div>
    </div>
  );
}
