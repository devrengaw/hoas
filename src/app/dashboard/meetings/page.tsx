'use client';

import React, { useState, Suspense, useRef, useEffect } from 'react';
import { 
  Video, Calendar, Clock, ChevronRight, Zap, CheckCircle, FileText, 
  X, XCircle, Search, Upload, Plus, Edit3, Save, Mail, Phone, Users,
  Trash2, AlertCircle, Check
} from 'lucide-react';
import styles from './page.module.css';
import { useSearchParams } from 'next/navigation';
import { mockMeetings, Meeting } from '@/lib/mockData';
import MeetingModal from '@/components/MeetingModal';
import { getMeetings, createMeeting as createMeetingDB } from '@/lib/database';

function MeetingsContent() {
  const searchParams = useSearchParams();
  const selectedId = searchParams.get('id');
  
  const [meetingsData, setMeetingsData] = useState<Meeting[]>([]);
  const [selectedMeeting, setSelectedMeeting] = useState<Meeting | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentDate, setCurrentDate] = useState(new Date(2026, 4, 1)); // Maio 2026
  const [isAgendaPublic, setIsAgendaPublic] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Mock Company ID for MVP
  const COMPANY_ID = '00000000-0000-0000-0000-000000000000';

  useEffect(() => {
    fetchMeetings();
  }, []);

  const fetchMeetings = async () => {
    try {
      setIsLoading(true);
      const data = await getMeetings(COMPANY_ID);
      // Map Supabase format to UI Meeting format
      const mapped: Meeting[] = data.map((m: any) => {
        const d = new Date(m.scheduled_at);
        return {
          id: m.id,
          title: m.title,
          with: m.guest_name || 'Participante Externo',
          email: m.guest_email,
          time: d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
          date: d.toISOString().split('T')[0],
          status: m.status as any,
          hasSummary: !!m.ai_summary?.insights
        };
      });
      setMeetingsData(mapped);
    } catch (error) {
      console.error('Error fetching meetings:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const [showNewMeetingModal, setShowNewMeetingModal] = useState(false);
  const [newMeeting, setNewMeeting] = useState({ 
    title: '', 
    with: '', 
    date: '', 
    time: '',
    email: '',
    phone: ''
  });

  // Notification State
  const [notification, setNotification] = useState<{message: string, type: 'success' | 'info' | 'error'} | null>(null);
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  // Advanced Availability State
  const [showAvailabilityModal, setShowAvailabilityModal] = useState(false);
  const [availability, setAvailability] = useState<{
    days: string[],
    timeBlocks: {id: number, start: string, end: string}[],
    exceptions: {id: number, date: string, start: string, end: string, reason: string}[]
  }>({
    days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    timeBlocks: [
      { id: 1, start: '09:00', end: '12:00' },
      { id: 2, start: '14:00', end: '18:00' }
    ],
    exceptions: []
  });

  const [newException, setNewException] = useState({ date: '', start: '', end: '', reason: '' });

  const addTimeBlock = () => {
    setAvailability(prev => ({
      ...prev,
      timeBlocks: [...prev.timeBlocks, { id: Date.now(), start: '09:00', end: '10:00' }]
    }));
  };

  const removeTimeBlock = (id: number) => {
    setAvailability(prev => ({
      ...prev,
      timeBlocks: prev.timeBlocks.filter(b => b.id !== id)
    }));
  };

  const addException = () => {
    if (!newException.date || !newException.start || !newException.end) return;
    setAvailability(prev => ({
      ...prev,
      exceptions: [...prev.exceptions, { id: Date.now(), ...newException }]
    }));
    setNewException({ date: '', start: '', end: '', reason: '' });
  };

  const removeException = (id: number) => {
    setAvailability(prev => ({
      ...prev,
      exceptions: prev.exceptions.filter(e => e.id !== id)
    }));
  };

  const toggleDay = (day: string) => {
    setAvailability(prev => ({
      ...prev,
      days: prev.days.includes(day) ? prev.days.filter(d => d !== day) : [...prev.days, day]
    }));
  };

  const [selectedCalendarDate, setSelectedCalendarDate] = useState<Date | null>(new Date(2026, 4, 4)); // Iniciando em 'Hoje' simulado

  const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));

  const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

  const isSameDay = (mDate: string, day: number, month: number, year: number) => {
    if (mDate === 'Hoje') return day === 4 && month === 4 && year === 2026;
    if (mDate === 'Ontem') return day === 3 && month === 4 && year === 2026;
    
    try {
      const d = new Date(mDate + 'T00:00:00');
      return d.getDate() === day && d.getMonth() === month && d.getFullYear() === year;
    } catch (e) {
      return false;
    }
  };

  const getMeetingsForDate = (day: number, month: number, year: number) => {
    return meetingsData.filter(m => isSameDay(m.date, day, month, year));
  };

  const handleAddMeeting = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const scheduledAt = new Date(`${newMeeting.date}T${newMeeting.time}`);
      
      await createMeetingDB({
        company_id: COMPANY_ID,
        creator_id: '00000000-0000-0000-0000-000000000000',
        title: newMeeting.title,
        scheduled_at: scheduledAt.toISOString(),
        guest_email: newMeeting.email,
        guest_name: newMeeting.with,
      });

      await fetchMeetings();
      setShowNewMeetingModal(false);
      
      setNotification({
        type: 'success',
        message: `Solicitação de reunião enviada para ${newMeeting.with}.`
      });
      
      setNewMeeting({ title: '', with: '', date: '', time: '', email: '', phone: '' });
    } catch (error) {
      console.error('Error creating meeting:', error);
      setNotification({ type: 'error', message: 'Erro ao criar reunião.' });
    }
  };

  const handleUpdateMeeting = (updated: Meeting) => {
    setMeetingsData(prev => prev.map(m => m.id === updated.id ? updated : m));
    setSelectedMeeting(updated);
    
    const idx = mockMeetings.findIndex(m => m.id === updated.id);
    if (idx !== -1) mockMeetings[idx] = updated;
  };

  const filteredMeetings = meetingsData.filter(m => 
    m.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    m.with.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={styles.container}>
      {/* Custom Toast Notification */}
      {notification && (
        <div className={`${styles.toast} ${styles[notification.type]}`}>
          {notification.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
          <span>{notification.message}</span>
          <button onClick={() => setNotification(null)}><X size={16} /></button>
        </div>
      )}

      <header className={styles.header}>
        <div>
          <h1>Reuniões & Inteligência</h1>
          <p>Gerencie suas chamadas e utilize a IA para gerar atas automáticas a partir de transcrições.</p>
        </div>
        <div className={styles.headerActions}>
          <button className={styles.secondaryBtn} onClick={() => setShowAvailabilityModal(true)}>
            <Clock size={18} />
            <span>Minha Disponibilidade</span>
          </button>
          <button 
            className={`${styles.secondaryBtn} ${isAgendaPublic ? styles.activeAgenda : ''}`} 
            onClick={() => {
              const newState = !isAgendaPublic;
              setIsAgendaPublic(newState);
              setNotification({
                type: 'info',
                message: newState ? "Sua agenda agora está pública para parceiros." : "Sua agenda agora está privada."
              });
            }}
          >
            <Users size={18} />
            <span>{isAgendaPublic ? 'Agenda Pública: ON' : 'Liberar Agenda'}</span>
          </button>
          <button className={styles.secondaryBtn} onClick={() => {
            navigator.clipboard.writeText('https://hoas.com.br/book/lucas-wagner');
            setNotification({ type: 'success', message: 'Seu link de agendamento foi copiado!' });
          }}>
            <Calendar size={18} />
            <span>Link de Agendamento</span>
          </button>
          <button className={styles.primaryBtn} onClick={() => setShowNewMeetingModal(true)}>
            <Plus size={18} />
            <span>Nova Reunião</span>
          </button>
        </div>
      </header>

      {/* Advanced Availability Settings Modal */}
      {showAvailabilityModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.largeModal}>
            <div className={styles.modalHeader}>
              <div>
                <h3>Configurar Disponibilidade</h3>
                <p>Defina seus horários de trabalho e bloqueios específicos.</p>
              </div>
              <button onClick={() => setShowAvailabilityModal(false)} className={styles.closeBtn}><X size={24} /></button>
            </div>
            
            <div className={styles.availabilityGrid}>
              {/* Sidebar: Days & Time Blocks */}
              <div className={styles.availSection}>
                <div className={styles.subHeader}>
                  <Calendar size={18} />
                  <h4>Horário Semanal Padrão</h4>
                </div>
                <div className={styles.daysToggleGrid}>
                  {['S', 'T', 'Q', 'Q', 'S', 'S', 'D'].map((d, i) => {
                    const dayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
                    const isSelected = availability.days.includes(dayNames[i]);
                    return (
                      <button 
                        key={d+i} 
                        className={`${styles.dayCircle} ${isSelected ? styles.activeDay : ''}`}
                        onClick={() => toggleDay(dayNames[i])}
                      >
                        {d}
                      </button>
                    );
                  })}
                </div>

                <div className={styles.timeBlocksList}>
                  <label>Intervalos de Disponibilidade</label>
                  {availability.timeBlocks.map((block) => (
                    <div key={block.id} className={styles.timeBlockItem}>
                      <input type="time" value={block.start} onChange={e => {
                        setAvailability(prev => ({
                          ...prev,
                          timeBlocks: prev.timeBlocks.map(b => b.id === block.id ? {...b, start: e.target.value} : b)
                        }));
                      }} />
                      <span>até</span>
                      <input type="time" value={block.end} onChange={e => {
                        setAvailability(prev => ({
                          ...prev,
                          timeBlocks: prev.timeBlocks.map(b => b.id === block.id ? {...b, end: e.target.value} : b)
                        }));
                      }} />
                      <button className={styles.removeBlock} onClick={() => removeTimeBlock(block.id)}><Trash2 size={16} /></button>
                    </div>
                  ))}
                  <button className={styles.addBlockBtn} onClick={addTimeBlock}>
                    <Plus size={14} /> Adicionar Intervalo
                  </button>
                </div>
              </div>

              {/* Main: Exceptions & Blocks */}
              <div className={styles.availSection}>
                <div className={styles.subHeader}>
                  <XCircle size={18} />
                  <h4>Bloqueios e Exceções</h4>
                </div>
                
                <div className={styles.exceptionForm}>
                  <div className={styles.inputGroup}>
                    <label>Data do Bloqueio</label>
                    <input type="date" value={newException.date} onChange={e => setNewException({...newException, date: e.target.value})} />
                  </div>
                  <div className={styles.gridInputs}>
                    <div className={styles.inputGroup}>
                      <label>Início</label>
                      <input type="time" value={newException.start} onChange={e => setNewException({...newException, start: e.target.value})} />
                    </div>
                    <div className={styles.inputGroup}>
                      <label>Fim</label>
                      <input type="time" value={newException.end} onChange={e => setNewException({...newException, end: e.target.value})} />
                    </div>
                  </div>
                  <div className={styles.inputGroup}>
                    <label>Motivo (opcional)</label>
                    <input type="text" placeholder="Ex: Almoço com cliente, Médico..." value={newException.reason} onChange={e => setNewException({...newException, reason: e.target.value})} />
                  </div>
                  <button className={styles.secondaryBtn} onClick={addException}>Bloquear Horário</button>
                </div>

                <div className={styles.exceptionsList}>
                  {availability.exceptions.map((exc) => (
                    <div key={exc.id} className={styles.exceptionItem}>
                      <div className={styles.excInfo}>
                        <strong>{new Date(exc.date + 'T00:00:00').toLocaleDateString('pt-BR')}</strong>
                        <span>{exc.start} - {exc.end}</span>
                        {exc.reason && <small>{exc.reason}</small>}
                      </div>
                      <button onClick={() => removeException(exc.id)}><X size={16} /></button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className={styles.modalFooter}>
              <p>Essas configurações garantem que ninguém marque reuniões em horários que você estiver ocupado.</p>
              <button className={styles.primaryBtn} onClick={() => {
                setShowAvailabilityModal(false);
                setNotification({ type: 'success', message: "Disponibilidade atualizada com sucesso!" });
              }}>Salvar Tudo</button>
            </div>
          </div>
        </div>
      )}

      {/* New Meeting Modal */}
      {showNewMeetingModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.formModal}>
            <div className={styles.modalHeader}>
              <h3>Solicitar Nova Reunião</h3>
              <button onClick={() => setShowNewMeetingModal(false)}><X size={20} /></button>
            </div>
            <form onSubmit={handleAddMeeting} className={styles.modalForm}>
              <div className={styles.inputGroup}>
                <label>Título da Reunião</label>
                <input required value={newMeeting.title} onChange={e => setNewMeeting({...newMeeting, title: e.target.value})} placeholder="Ex: Planejamento Q4" />
              </div>
              <div className={styles.inputGroup}>
                <label>Participantes / Agência</label>
                <input required value={newMeeting.with} onChange={e => setNewMeeting({...newMeeting, with: e.target.value})} placeholder="Ex: Agência Global" />
              </div>
              <div className={styles.gridInputs}>
                <div className={styles.inputGroup}>
                  <label>E-mail</label>
                  <input type="email" value={newMeeting.email} onChange={e => setNewMeeting({...newMeeting, email: e.target.value})} placeholder="email@empresa.com" />
                </div>
                <div className={styles.inputGroup}>
                  <label>Telefone</label>
                  <input type="tel" value={newMeeting.phone} onChange={e => setNewMeeting({...newMeeting, phone: e.target.value})} placeholder="(00) 00000-0000" />
                </div>
              </div>
              <div className={styles.gridInputs}>
                <div className={styles.inputGroup}>
                  <label>Data</label>
                  <input required type="date" value={newMeeting.date} onChange={e => setNewMeeting({...newMeeting, date: e.target.value})} />
                </div>
                <div className={styles.inputGroup}>
                  <label>Horário</label>
                  <input required type="time" value={newMeeting.time} onChange={e => setNewMeeting({...newMeeting, time: e.target.value})} />
                </div>
              </div>
              <p className={styles.formHint}>Uma solicitação será enviada para o participante aprovar.</p>
              <button type="submit" className={styles.submitBtn}>Enviar Solicitação</button>
            </form>
          </div>
        </div>
      )}

      {selectedMeeting && (
        <MeetingModal 
          meeting={selectedMeeting} 
          onClose={() => setSelectedMeeting(null)} 
          onUpdate={handleUpdateMeeting} 
        />
      )}

      <div className={styles.content}>
        <div className={styles.meetingList}>
          <div className={styles.listHeader}>
            <div className={styles.listTitleRow}>
              <h2>Histórico de Reuniões</h2>
              <span className={styles.countBadge}>{filteredMeetings.length}</span>
            </div>
            <div className={styles.searchBox}>
              <Search size={18} />
              <input 
                type="text" 
                placeholder="Buscar por título ou agência..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className={styles.scrollArea}>
            {filteredMeetings.map((m) => (
              <div 
                key={m.id} 
                className={`${styles.meetingItem} ${selectedMeeting?.id === m.id ? styles.active : ''} ${m.status === 'cancelled' ? styles.cancelled : ''}`}
                onClick={() => setSelectedMeeting(m)}
              >
                <div className={styles.meetingIcon}>
                  {m.hasSummary ? <Zap size={18} color="#6366f1" /> : (m.status === 'completed' ? <CheckCircle size={18} color="#10b981" /> : <Clock size={18} color="#f59e0b" />)}
                </div>
                <div className={styles.meetingInfo}>
                  <div className={styles.meetingTitleRow}>
                    <h3>{m.title}</h3>
                    <span className={`${styles.statusTag} ${styles[m.status]}`}>
                      {m.status === 'completed' ? 'Concluída' : 
                       m.status === 'ongoing' ? 'Em Andamento' : 
                       m.status === 'cancelled' ? 'Cancelada' :
                       m.status === 'requested' ? 'Solicitada' : 'Agendada'}
                    </span>
                  </div>
                  <p>{m.with}</p>
                  <div className={styles.meetingMeta}>
                    <span><Clock size={12} /> {m.time}</span>
                    <span className={styles.divider}>•</span>
                    <span><Calendar size={12} /> {m.date}</span>
                  </div>
                </div>
                <ChevronRight size={18} className={styles.arrowIcon} />
              </div>
            ))}
          </div>
        </div>

        <div className={styles.calendarSection}>
          <div className={styles.monthSelector}>
            <ChevronRight size={14} style={{ transform: 'rotate(180deg)' }} onClick={prevMonth} />
            <h3>{currentDate.toLocaleString('pt-BR', { month: 'long', year: 'numeric' })}</h3>
            <ChevronRight size={14} onClick={nextMonth} />
          </div>
          
          <div className={styles.calendarBody}>
            <div className={styles.weekdays}>
              {['D', 'S', 'T', 'Q', 'Q', 'S', 'S'].map(day => (
                <span key={day} className={styles.weekday}>{day}</span>
              ))}
            </div>
            <div className={styles.calendarGrid}>
              {Array.from({length: getFirstDayOfMonth(currentDate.getFullYear(), currentDate.getMonth())}).map((_, i) => (
                <div key={`empty-${i}`} className={styles.calendarDayEmpty} />
              ))}
              
              {Array.from({length: getDaysInMonth(currentDate.getFullYear(), currentDate.getMonth())}).map((_, i) => {
                const day = i + 1;
                const hasMeetings = meetingsData.some(m => isSameDay(m.date, day, currentDate.getMonth(), currentDate.getFullYear()));

                return (
                  <div 
                    key={day} 
                    className={`${styles.calendarDay} ${day === selectedCalendarDate?.getDate() && currentDate.getMonth() === selectedCalendarDate?.getMonth() ? styles.selectedDay : ''} ${day === 4 && currentDate.getMonth() === 4 ? styles.today : ''}`}
                    onClick={() => {
                      setSelectedCalendarDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), day));
                    }}
                  >
                    <span>{day}</span>
                    {hasMeetings && <div className={styles.eventDot} />}
                  </div>
                );
              })}
            </div>
          </div>

          {selectedCalendarDate && (
            <div className={styles.dayAgenda}>
              <div className={styles.agendaHeader}>
                <h4>Agenda • {selectedCalendarDate.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long' })}</h4>
              </div>
              <div className={styles.agendaContent}>
                {getMeetingsForDate(selectedCalendarDate.getDate(), selectedCalendarDate.getMonth(), selectedCalendarDate.getFullYear()).length > 0 ? (
                  getMeetingsForDate(selectedCalendarDate.getDate(), selectedCalendarDate.getMonth(), selectedCalendarDate.getFullYear()).map(m => (
                    <div key={m.id} className={styles.agendaItem} onClick={() => setSelectedMeeting(m)}>
                      <div className={styles.agendaTime}>{m.time.split(' - ')[0]}</div>
                      <div className={styles.agendaDetails}>
                        <h5>{m.title}</h5>
                        <span>{m.with}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className={styles.emptyAgenda}>Nenhuma reunião para este dia.</p>
                )}
              </div>
              <button 
                className={styles.addDayBtn}
                onClick={() => {
                  setNewMeeting({ ...newMeeting, date: selectedCalendarDate.toISOString().split('T')[0] });
                  setShowNewMeetingModal(true);
                }}
              >
                <Plus size={14} />
                <span>Solicitar Reunião</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function MeetingsPage() {
  return (
    <Suspense fallback={<div>Carregando reuniões...</div>}>
      <MeetingsContent />
    </Suspense>
  );
}
