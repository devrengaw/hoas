'use client';

import React, { useState } from 'react';
import { 
  Calendar, MapPin, Users, Plus, Edit3, Trash2, 
  ChevronRight, Search, ShieldCheck, Ticket, Star,
  TrendingUp, Globe, X, Save, Clock, AlertCircle,
  Mail, Building2, Download
} from 'lucide-react';
import styles from './page.module.css';

export default function PlatformEvents() {
  const [events, setEvents] = useState<any[]>([]);

  const [mockRegistrations] = useState<any[]>([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isRegModalOpen, setIsRegModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [eventToDelete, setEventToDelete] = useState<number | null>(null);
  const [formTitle, setFormTitle] = useState('');

  const handleOpenModal = (event: any = null) => {
    if (event) {
      setSelectedEvent(event);
      setFormTitle(event.title);
    } else {
      setSelectedEvent(null);
      setFormTitle('');
    }
    setIsModalOpen(true);
  };

  const handleOpenRegistrations = (event: any) => {
    setSelectedEvent(event);
    setIsRegModalOpen(true);
  };

  const saveEvent = () => {
    if (!formTitle) return;
    if (selectedEvent && isModalOpen) {
      setEvents(prev => prev.map(e => e.id === selectedEvent.id ? { ...e, title: formTitle } : e));
    } else {
      setEvents([...events, { id: Date.now(), title: formTitle, date: 'A definir', location: 'A definir', attendees: 0, status: 'Novo', category: 'Geral' }]);
    }
    setIsModalOpen(false);
  };

  const confirmDelete = (id: number) => {
    setEventToDelete(id);
    setIsConfirmModalOpen(true);
  };

  const executeDelete = () => {
    if (eventToDelete) {
      setEvents(prev => prev.filter(e => e.id !== eventToDelete));
      setEventToDelete(null);
      setIsConfirmModalOpen(false);
    }
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div><div className={styles.adminBadge}><Star size={14} /><span>Gestão de Eventos Globais</span></div><h1>Eventos do Ecossistema</h1><p>Crie e gerencie os grandes marcos e encontros da plataforma HOAS.</p></div>
        <button className={styles.addBtn} onClick={() => handleOpenModal()}><Plus size={18} /> Novo Evento</button>
      </header>

      <div className={styles.statsBar}>
        <div className={styles.miniStat}><Calendar size={18} /><span>Eventos este ano: <strong>0</strong></span></div>
        <div className={styles.miniStat}><Users size={18} /><span>Total de Inscritos: <strong>0</strong></span></div>
        <div className={styles.miniStat}><TrendingUp size={18} /><span>Crescimento: <strong>0%</strong></span></div>
      </div>

      <div className={styles.eventGrid}>
        {events.map(event => (
          <div key={event.id} className={styles.eventCard}>
            <div className={styles.eventStatus}><span className={styles.categoryTag}>{event.category}</span><span className={styles.statusLabel}>{event.status}</span></div>
            <h3>{event.title}</h3>
            <div className={styles.eventMeta}>
              <div className={styles.metaItem}><Calendar size={14} /> {event.date}</div>
              <div className={styles.metaItem}><MapPin size={14} /> {event.location}</div>
              <div className={styles.metaItem}><Users size={14} /> {event.attendees} participantes</div>
            </div>
            <div className={styles.eventActions}>
              <button className={styles.editBtn} onClick={() => handleOpenModal(event)}><Edit3 size={16} /> Editar</button>
              <button className={styles.manageBtn} onClick={() => handleOpenRegistrations(event)}><Ticket size={16} /> Inscrições</button>
              <button className={styles.deleteBtn} onClick={() => confirmDelete(event.id)}><Trash2 size={16} /></button>
            </div>
          </div>
        ))}
        <div className={styles.createCard} onClick={() => handleOpenModal()}><Plus size={40} /><span>Criar Novo Evento</span></div>
      </div>

      {/* Event Modal */}
      {isModalOpen && (
        <div className={styles.modalOverlay} onClick={() => setIsModalOpen(false)}>
          <div className={styles.modal} onClick={e => e.stopPropagation()}>
            <button className={styles.closeBtn} onClick={() => setIsModalOpen(false)}><X size={20} /></button>
            <div className={styles.modalHeader}><h2>{selectedEvent ? 'Editar Evento' : 'Novo Evento Global'}</h2><p>Configure os detalhes do evento que será visível no marketplace.</p></div>
            <div className={styles.form}>
              <div className={styles.inputGroup}><label>Nome do Evento</label><input type="text" value={formTitle} onChange={e => setFormTitle(e.target.value)} placeholder="Ex: HOAS Summit 2026" style={{fontFamily: 'inherit'}} /></div>
              <div className={styles.formRow}>
                <div className={styles.inputGroup}><label>Data</label><input type="date" style={{fontFamily: 'inherit'}} /></div>
                <div className={styles.inputGroup}><label>Categoria</label><select style={{fontFamily: 'inherit'}}><option>Conferência</option><option>Workshop</option><option>Webinar</option><option>Networking</option></select></div>
              </div>
              <div className={styles.inputGroup}><label>Localização / Plataforma</label><input type="text" placeholder="Ex: WTC São Paulo ou Zoom" style={{fontFamily: 'inherit'}} /></div>
              <div className={styles.inputGroup}><label>Descrição Curta</label><textarea rows={3} placeholder="Breve resumo do evento..." style={{fontFamily: 'inherit'}} /></div>
              <button className={styles.primaryBtn} onClick={saveEvent}><Save size={18} /> {selectedEvent ? 'Salvar Alterações' : 'Criar Evento'}</button>
            </div>
          </div>
        </div>
      )}

      {/* Registrations Modal */}
      {isRegModalOpen && selectedEvent && (
        <div className={styles.modalOverlay} onClick={() => setIsRegModalOpen(false)}>
          <div className={`${styles.modal} ${styles.largeModal}`} onClick={e => e.stopPropagation()}>
            <button className={styles.closeBtn} onClick={() => setIsRegModalOpen(false)}><X size={20} /></button>
            <div className={styles.modalHeader}>
              <div className={styles.modalIconWrapper}><Ticket size={24} /></div>
              <h2>Inscrições: {selectedEvent.title}</h2>
              <p>Lista de participantes confirmados para este evento.</p>
            </div>

            <div className={styles.regStats}>
              <div className={styles.regStatItem}><strong>{selectedEvent.attendees}</strong><span>Inscritos</span></div>
              <button className={styles.exportBtn}><Download size={16} /> Exportar CSV</button>
            </div>

            <div className={styles.regTable}>
              <div className={styles.tableHeader}>
                <span>Participante</span>
                <span>Organização</span>
                <span>Data</span>
              </div>
              <div className={styles.tableBody}>
                {mockRegistrations.map(reg => (
                  <div key={reg.id} className={styles.tableRow}>
                    <div className={styles.regUser}>
                      <strong>{reg.name}</strong>
                      <span>{reg.email}</span>
                    </div>
                    <div className={styles.regOrg}><Building2 size={14} /> {reg.org}</div>
                    <div className={styles.regDate}>{reg.date}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {isConfirmModalOpen && (
        <div className={styles.modalOverlay} onClick={() => setIsConfirmModalOpen(false)}>
          <div className={styles.modal} onClick={e => e.stopPropagation()}>
            <div className={styles.warningIconWrapper}><AlertCircle size={40} /></div>
            <h2>Confirmar Exclusão</h2>
            <p className={styles.confirmText}>Tem certeza que deseja remover este evento? Esta ação não poderá ser desfeita e afetará as inscrições existentes.</p>
            <div className={styles.modalActions}>
              <button className={styles.secondaryBtn} onClick={() => setIsConfirmModalOpen(false)}>Manter Evento</button>
              <button className={styles.dangerBtn} onClick={executeDelete}>Confirmar e Excluir</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
