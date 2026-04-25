'use client';

import React from 'react';
import { Star, Building2, History, MapPin, MoreVertical } from 'lucide-react';
import styles from './page.module.css';

const favorites = [
  { id: 1, name: 'Agência Global', type: 'Agência', vertical: 'Varejo', location: 'São Paulo, SP', deals: 12 },
  { id: 2, name: 'Alpha Tech', type: 'Cliente', vertical: 'Tecnologia', location: 'Florianópolis, SC', deals: 5 },
  { id: 3, name: 'Eco Style', type: 'Cliente', vertical: 'Moda', location: 'Rio de Janeiro, RJ', deals: 8 },
];

export default function WalletPage() {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div>
          <h1>Minha Carteira</h1>
          <p>Seus contatos estratégicos e histórico de parcerias.</p>
        </div>
      </header>

      <div className={styles.grid}>
        <section className={styles.favoritesSection}>
          <div className={styles.sectionHeader}>
            <h2>Favoritos & Estratégicos</h2>
          </div>
          <div className={styles.cardGrid}>
            {favorites.map((f) => (
              <div key={f.id} className={styles.entityCard}>
                <div className={styles.cardHeader}>
                  <div className={styles.entityIcon}>
                    <Building2 size={20} />
                  </div>
                  <Star size={18} fill="var(--primary)" color="var(--primary)" />
                </div>
                <div className={styles.entityInfo}>
                  <h3>{f.name}</h3>
                  <span className={styles.typeBadge}>{f.type}</span>
                  <div className={styles.meta}>
                    <div className={styles.metaItem}>
                      <MapPin size={14} />
                      <span>{f.location}</span>
                    </div>
                    <div className={styles.metaItem}>
                      <History size={14} />
                      <span>{f.deals} Projetos Fechados</span>
                    </div>
                  </div>
                </div>
                <button className={styles.viewBtn}>Ver Perfil Completo</button>
              </div>
            ))}
          </div>
        </section>

        <aside className={styles.historySection}>
          <div className={styles.sectionHeader}>
            <h2>Últimas Atividades</h2>
          </div>
          <div className={styles.historyList}>
            <div className={styles.historyItem}>
              <div className={styles.historyDot} />
              <div className={styles.historyInfo}>
                <p><strong>Briefing Recebido</strong> da Agência Global</p>
                <span>Há 2 horas</span>
              </div>
            </div>
            <div className={styles.historyItem}>
              <div className={styles.historyDot} />
              <div className={styles.historyInfo}>
                <p><strong>Proposta Aceita</strong> por Alpha Tech</p>
                <span>Ontem às 15:30</span>
              </div>
            </div>
            <div className={styles.historyItem}>
              <div className={styles.historyDot} />
              <div className={styles.historyInfo}>
                <p><strong>Reunião Finalizada</strong> com Eco Style</p>
                <span>23/04/2026</span>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
