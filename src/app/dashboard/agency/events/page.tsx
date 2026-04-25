import React from 'react';
import { Calendar, MapPin, Ticket, Users, ExternalLink } from 'lucide-react';
import styles from './page.module.css';

const events = [
  {
    id: 1,
    title: 'HOAS Summit 2026',
    date: '15 de Maio, 2026',
    location: 'WTC Events Center, SP',
    attendees: '500+',
    type: 'Corporate',
    image: 'https://images.unsplash.com/photo-1540575861501-7ad05823c95b?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: 2,
    title: 'Festival de Criatividade',
    date: '20 de Junho, 2026',
    location: 'Cannes, França',
    attendees: '10k+',
    type: 'Market',
    image: 'https://images.unsplash.com/photo-1514525253361-bee8718a74a2?auto=format&fit=crop&q=80&w=600'
  }
];

export default function EventsPage() {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div>
          <h1>Eventos do Mercado</h1>
          <p>Fique por dentro dos principais eventos de publicidade e conexões HOAS.</p>
        </div>
      </header>

      <div className={styles.eventGrid}>
        {events.map((e) => (
          <div key={e.id} className={styles.eventCard}>
            <div className={styles.eventImage}>
              <img src={e.image} alt={e.title} />
              <div className={styles.typeBadge}>{e.type}</div>
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
                  <span>{e.attendees} participantes</span>
                </div>
              </div>
              <button className={styles.ticketBtn}>
                <Ticket size={18} />
                <span>Garantir Ingresso</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
