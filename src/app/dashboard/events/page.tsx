'use client';

import React from 'react';
import { Calendar, MapPin, Ticket, Users, ExternalLink } from 'lucide-react';
import styles from './page.module.css';
import { useMVPData } from '@/hooks/useMVPData';

export default function EventsPage() {
  const { data: events, loading } = useMVPData('global_events');

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div>
          <h1>Eventos do Mercado</h1>
          <p>Fique por dentro dos principais eventos de publicidade e conexões HOAS.</p>
        </div>
      </header>

      <div className={styles.eventGrid}>
        {loading ? (
          <div className={styles.loading}>Carregando eventos...</div>
        ) : !events || events.length === 0 ? (
          <div className={styles.empty}>Nenhum evento agendado no momento.</div>
        ) : (
          events.map((e: any) => (
            <div key={e.id} className={styles.eventCard}>
              <div className={styles.eventImage}>
                <img src={e.image_url || 'https://images.unsplash.com/photo-1540575861501-7ad05823c95b?auto=format&fit=crop&q=80&w=600'} alt={e.title} />
                <div className={styles.typeBadge}>{e.type || 'Evento'}</div>
              </div>
              <div className={styles.eventInfo}>
                <div className={styles.dateBadge}>{e.date}</div>
                <h3>{e.title}</h3>
                <div className={styles.meta}>
                  <div className={styles.metaItem}>
                    <MapPin size={16} />
                    <span>{e.location}</span>
                  </div>
                  <div className={styles.metaItem}>
                    <Users size={16} />
                    <span>{e.attendees || 'A confirmar'} participantes</span>
                  </div>
                </div>
                <button className={styles.ticketBtn}>
                  <Ticket size={18} />
                  <span>{e.link_url ? 'Ver Detalhes' : 'Garantir Ingresso'}</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
