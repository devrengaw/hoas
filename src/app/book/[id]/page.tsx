'use client';

import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  Clock, 
  Calendar as CalendarIcon, 
  Globe, 
  ChevronLeft, 
  ChevronRight,
  CheckCircle,
  Video
} from 'lucide-react';
import styles from './page.module.css';
import { useParams, useRouter } from 'next/navigation';
import { createMeeting } from '@/lib/database';

type ViewState = 'SCHEDULING' | 'FORM' | 'SUCCESS';

export default function BookingPage() {
  const { id } = useParams();
  const [view, setView] = useState<ViewState>('SCHEDULING');
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [confirmingTime, setConfirmingTime] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form State
  const [guestData, setGuestData] = useState({
    name: '',
    email: '',
    notes: ''
  });
  
  // Host Info (Dynamic based on ID)
  const host = {
    name: id ? (id as string).split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ') : "Lucas Wagner",
    title: "Reunião Estratégica",
    duration: "30 min",
    timezone: "Horário de Brasília",
    avatar: "/identidade visual/hoas_png.png"
  };

  const timeSlots = ["09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "14:00", "14:30", "15:00"];

  const handleDateClick = (day: number) => {
    const date = new Date(2026, 4, day); // May 2026 as per screenshot
    setSelectedDate(date);
    setConfirmingTime(null);
  };

  const handleTimeClick = (time: string) => {
    if (confirmingTime === time) {
      setView('FORM');
      setSelectedTime(time);
    } else {
      setConfirmingTime(time);
    }
  };

  const handleBack = () => {
    if (view === 'FORM') setView('SCHEDULING');
  };

  const handleSchedule = async () => {
    if (!selectedDate || !selectedTime || !guestData.name || !guestData.email) return;
    
    setIsSubmitting(true);
    try {
      // Create scheduled datetime
      const [hours, minutes] = selectedTime.split(':');
      const scheduledAt = new Date(selectedDate);
      scheduledAt.setHours(parseInt(hours), parseInt(minutes), 0, 0);

      await createMeeting({
        company_id: '00000000-0000-0000-0000-000000000000', // Mock fallback
        creator_id: '00000000-0000-0000-0000-000000000000', // Mock fallback
        title: `Reunião: ${guestData.name} & ${host.name}`,
        scheduled_at: scheduledAt.toISOString(),
        duration_minutes: 30,
        guest_email: guestData.email,
        guest_name: guestData.name,
        notes: guestData.notes
      });
      
      setView('SUCCESS');
    } catch (error) {
      console.error('Error scheduling meeting:', error);
      alert('Erro ao agendar reunião. Por favor, tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderCalendar = () => {
    const daysInMonth = 31;
    const firstDay = 5; // Friday for May 2026
    const days = [];
    
    // Empty cells for alignment
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className={styles.dayCell + " " + styles.disabled}></div>);
    }
    
    for (let i = 1; i <= daysInMonth; i++) {
      const isActive = selectedDate?.getDate() === i;
      const isToday = i === 11; // 11 de maio as per screenshot
      days.push(
        <div 
          key={i} 
          className={`${styles.dayCell} ${isActive ? styles.active : ''} ${isToday ? styles.today : ''}`}
          onClick={() => handleDateClick(i)}
        >
          {i}
        </div>
      );
    }
    return days;
  };

  return (
    <main className={styles.container}>
      <div className={styles.bookingCard}>
        <div className={styles.calendlyBadge}>DESENVOLVIDO POR HOAS</div>
        
        {/* Left Info Sidebar */}
        <div className={styles.infoSidebar}>
          {view === 'FORM' && (
            <button className={styles.backBtn} onClick={handleBack}>
              <ArrowLeft size={18} />
            </button>
          )}
          
          <div className={styles.hostAvatar}>
            <img src={host.avatar} alt={host.name} />
          </div>
          <p className={styles.hostName}>{host.name}</p>
          <h1 className={styles.meetingTitle}>{host.title}</h1>
          
          <div className={styles.meetingDetails}>
            <div className={styles.detailItem}>
              <Clock size={18} />
              <span>{host.duration}</span>
            </div>
            {selectedDate && (
              <div className={styles.detailItem}>
                <CalendarIcon size={18} />
                <span>
                  {selectedTime || "11:00 - 11:30"}, 
                  {selectedDate.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                </span>
              </div>
            )}
            <div className={styles.detailItem}>
              <Globe size={18} />
              <span>{host.timezone}</span>
            </div>
            {view === 'SUCCESS' && (
              <div className={styles.detailItem}>
                <Video size={18} />
                <span>Vídeo Chamada (Link no convite)</span>
              </div>
            )}
          </div>

          <div className={styles.footerLinks}>
            <a href="#">Configurações de cookies</a>
            <a href="#">Política de privacidade</a>
          </div>
        </div>

        {/* Right Content Area */}
        <div className={styles.mainContent}>
          {view === 'SCHEDULING' && (
            <>
              <div className={styles.contentHeader}>
                <h2>Escolha uma data e horário</h2>
              </div>
              
              <div className={styles.schedulerView}>
                <div className={styles.calendarSection}>
                  <div className={styles.calendar}>
                    <div className={styles.calendarHeader}>
                      <strong>maio 2026</strong>
                      <div className={styles.monthNav}>
                        <button className={styles.navBtn}><ChevronLeft size={18} /></button>
                        <button className={styles.navBtn}><ChevronRight size={18} /></button>
                      </div>
                    </div>
                    
                    <div className={styles.calendarGrid}>
                      {['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sáb'].map(d => (
                        <div key={d} className={styles.dayLabel}>{d}</div>
                      ))}
                      {renderCalendar()}
                    </div>
                    
                    <div style={{ marginTop: '2rem' }}>
                      <p style={{ fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.5rem' }}>Fuso horário</p>
                      <div className={styles.detailItem} style={{ fontSize: '0.8rem', color: '#0f172a' }}>
                        <Globe size={14} /> Horário de Brasília (15:09) <ChevronRight size={12} />
                      </div>
                    </div>
                  </div>
                </div>

                <div className={styles.slotsSection}>
                  {selectedDate ? (
                    <>
                      <p className={styles.slotsHeader}>
                        {selectedDate.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}
                      </p>
                      <div className={styles.slotsList}>
                        {timeSlots.map(time => (
                          <div key={time}>
                            {confirmingTime === time ? (
                              <div className={styles.slotConfirm}>
                                <button className={styles.timeBtn} onClick={() => setConfirmingTime(null)}>{time}</button>
                                <button className={styles.confirmBtn} onClick={() => handleTimeClick(time)}>Confirmar</button>
                              </div>
                            ) : (
                              <button className={styles.slotItem} onClick={() => handleTimeClick(time)}>
                                {time}
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    </>
                  ) : (
                    <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '2rem' }}>
                      <p style={{ color: '#64748b' }}>Selecione um dia no calendário para ver os horários disponíveis.</p>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}

          {view === 'FORM' && (
            <div className={styles.formSection}>
              <div className={styles.contentHeader}>
                <h2>Preencha os Campos</h2>
              </div>
              
              <div className={styles.form}>
                <div className={styles.inputGroup}>
                  <label>Nome *</label>
                  <input 
                    type="text" 
                    className={styles.inputField} 
                    value={guestData.name}
                    onChange={(e) => setGuestData({...guestData, name: e.target.value})}
                    required
                  />
                </div>
                
                <div className={styles.inputGroup}>
                  <label>E-mail *</label>
                  <input 
                    type="email" 
                    className={styles.inputField} 
                    value={guestData.email}
                    onChange={(e) => setGuestData({...guestData, email: e.target.value})}
                    required
                  />
                </div>
                
                <button className={styles.addGuestsBtn}>Adicionar convidados</button>
                
                <div className={styles.inputGroup}>
                  <label>Por favor, compartilhe qualquer coisa que possa ser útil para a preparação da nossa reunião.</label>
                  <textarea 
                    className={`${styles.inputField} ${styles.textArea}`}
                    value={guestData.notes}
                    onChange={(e) => setGuestData({...guestData, notes: e.target.value})}
                  ></textarea>
                </div>
                
                <p className={styles.notice}>
                  Ao prosseguir, você confirma que leu e concorda com os <a href="#">Termos dos convidados do HOAS</a> e <a href="#">Aviso de Privacidade</a>.
                </p>
                
                <button 
                  className={styles.scheduleBtn} 
                  onClick={handleSchedule}
                  disabled={isSubmitting || !guestData.name || !guestData.email}
                >
                  {isSubmitting ? 'Agendando...' : 'Agendar Evento'}
                </button>
              </div>
            </div>
          )}

          {view === 'SUCCESS' && (
            <div className={styles.successView}>
              <div className={styles.successIcon}>
                <CheckCircle size={40} />
              </div>
              <h2>Agendado com Sucesso!</h2>
              <p>
                Um convite com os detalhes e o link da reunião foi enviado para o seu e-mail e adicionado ao seu calendário.
              </p>
              <button className={styles.scheduleBtn} onClick={() => window.location.reload()}>
                Novo Agendamento
              </button>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
