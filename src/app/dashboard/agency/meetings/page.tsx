'use client';

import React, { useState, Suspense, useRef } from 'react';
import { Video, Calendar, Clock, ChevronRight, Zap, CheckCircle, FileText, X, XCircle, Search, Upload, Plus, Edit3, Save } from 'lucide-react';
import styles from './page.module.css';
import { useSearchParams } from 'next/navigation';
import { mockMeetings, Meeting } from '@/lib/mockData';
import { getMeetings, createMeeting as createMeetingDB } from '@/lib/database';

function MeetingsContent() {
  const searchParams = useSearchParams();
  const selectedId = searchParams.get('id');
  
  const [meetingsData, setMeetingsData] = useState<Meeting[]>([]);
  const [selectedMeeting, setSelectedMeeting] = useState<Meeting | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Mock Company ID for MVP
  const COMPANY_ID = '00000000-0000-0000-0000-000000000000';

  React.useEffect(() => {
    fetchMeetings();
  }, []);

  const fetchMeetings = async () => {
    try {
      setIsLoading(true);
      const data = await getMeetings(COMPANY_ID);
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
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [transcriptionText, setTranscriptionText] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentDate, setCurrentDate] = useState(new Date(2026, 4, 1)); // Maio 2026
  
  const [showNewMeetingModal, setShowNewMeetingModal] = useState(false);
  const [newMeeting, setNewMeeting] = useState({ title: '', with: '', date: '', time: '' });
  const [isEditingNotes, setIsEditingNotes] = useState(false);
  const [tempNotes, setTempNotes] = useState('');
  const [selectedCalendarDate, setSelectedCalendarDate] = useState<Date | null>(new Date(2026, 4, 4)); // Iniciando em 'Hoje' simulado
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const showSuccess = (msg: string) => {
    setSuccessMessage(msg);
    setIsSuccessModalOpen(true);
  };

  const fileInputRef = useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (selectedMeeting) {
      setTempNotes(selectedMeeting.notes || '');
    }
  }, [selectedMeeting]);

  const handleSaveNotes = () => {
    if (!selectedMeeting) return;
    const updatedMeeting = { ...selectedMeeting, notes: tempNotes };
    setMeetingsData(prev => prev.map(m => m.id === selectedMeeting.id ? updatedMeeting : m));
    setSelectedMeeting(updatedMeeting);
    setIsEditingNotes(false);
  };

  const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));

  const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

  const isSameDay = (mDate: string, day: number, month: number, year: number) => {
    // Para dados mockados
    if (mDate === 'Hoje') return day === 4 && month === 4 && year === 2026;
    if (mDate === 'Ontem') return day === 3 && month === 4 && year === 2026;
    
    // Para novas reuniões (formato YYYY-MM-DD)
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
        guest_email: '',
        guest_name: newMeeting.with,
      });

      await fetchMeetings();
      setShowNewMeetingModal(false);
      showSuccess(`Reunião com ${newMeeting.with} agendada com sucesso.`);
      setNewMeeting({ title: '', with: '', date: '', time: '' });
    } catch (error) {
      console.error('Error creating meeting:', error);
      alert('Erro ao criar reunião.');
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsTranscribing(true);
      setTimeout(() => {
        setTranscriptionText(`[Transcrição automática de ${file.name}]\n\nParticipantes: Equipe HOAS e Agência\n\nPonto 1: Discussão sobre o novo plano de mídia...\nPonto 2: Aprovação de orçamento...\n\nFinal da reunião com acordos firmados.`);
        setIsTranscribing(false);
      }, 1500);
    }
  };

  const filteredMeetings = meetingsData.filter(m => 
    m.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    m.with.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleGenerateFromText = () => {
    if (!transcriptionText.trim() || !selectedMeeting) return;
    setIsTranscribing(true);
    
    setTimeout(() => {
      const newSummary = {
        decisions: [
          "Definição de cronograma para o Q3", 
          "Aprovação de budget extra para mídia programática",
          "Ajuste na frequência de postagens sociais"
        ],
        nextSteps: [
          "Enviar contratos assinados", 
          "Configurar dashboards de acompanhamento",
          "Marcar reunião de alinhamento com o time técnico"
        ],
        risks: ["Dependência de aprovação de terceiros em feriados"],
        insights: "O foco principal da equipe deve ser a retenção de agências de grande porte no próximo mês, visando estabilidade no faturamento."
      };

      const updatedMeeting = {
        ...selectedMeeting,
        status: 'completed' as const,
        hasSummary: true,
        summary: newSummary
      };

      setMeetingsData(prev => prev.map(m => m.id === selectedMeeting.id ? updatedMeeting : m));
      setSelectedMeeting(updatedMeeting);
      setIsTranscribing(false);
      setTranscriptionText('');
    }, 2500);
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div>
          <h1>Reuniões & Inteligência</h1>
          <p>Gerencie suas chamadas e utilize a IA para gerar atas automáticas a partir de transcrições.</p>
        </div>
        <div className={styles.headerActions}>
          <button className={styles.secondaryBtn} onClick={() => {
            navigator.clipboard.writeText('https://hoas.com.br/book/lucas-wagner');
            showSuccess('Seu link de agendamento foi copiado!');
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

      {/* New Meeting Modal */}
      {showNewMeetingModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.formModal}>
            <div className={styles.modalHeader}>
              <h3>Agendar Nova Reunião</h3>
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
                  <label>Data</label>
                  <input required type="date" value={newMeeting.date} onChange={e => setNewMeeting({...newMeeting, date: e.target.value})} />
                </div>
                <div className={styles.inputGroup}>
                  <label>Horário</label>
                  <input required type="time" value={newMeeting.time} onChange={e => setNewMeeting({...newMeeting, time: e.target.value})} />
                </div>
              </div>
              <button type="submit" className={styles.submitBtn}>Criar Reunião</button>
            </form>
          </div>
        </div>
      )}

      {/* Meeting Details Modal */}
      {selectedMeeting && (
        <div className={styles.modalOverlay}>
          <div className={styles.aiModal}>
            <div className={styles.modalHeader}>
              <div className={styles.panelTitle}>
                <Zap size={20} color="#6366f1" />
                <h2>Detalhes da Reunião</h2>
              </div>
              <button onClick={() => setSelectedMeeting(null)}><X size={20} /></button>
            </div>

            <div className={styles.meetingDetailsHeader}>
              <div className={styles.mainInfo}>
                <h1>{selectedMeeting.title}</h1>
                <p>Com <strong>{selectedMeeting.with}</strong></p>
              </div>
              <div className={styles.metaInfo}>
                <div className={styles.metaItem}>
                  <Calendar size={16} />
                  <span>{selectedMeeting.date}</span>
                </div>
                <div className={styles.metaItem}>
                  <Clock size={16} />
                  <span>{selectedMeeting.time}</span>
                </div>
                <div className={styles.metaItem}>
                  <span className={`${styles.statusTag} ${
                    selectedMeeting.status === 'completed' ? styles.statusCompleted : 
                    selectedMeeting.status === 'ongoing' ? styles.statusOngoing : 
                    styles.statusUpcoming
                  }`}>
                    {selectedMeeting.status === 'completed' ? 'Concluída' : 
                     selectedMeeting.status === 'ongoing' ? 'Em Andamento' : 
                     'Agendada'}
                  </span>
                </div>
              </div>
            </div>

            <div className={styles.panelContent}>
              <div className={styles.notesSection}>
                <div className={styles.sectionHeader}>
                  <div className={styles.sectionTitle}>
                    <Edit3 size={16} />
                    <h4>Notas Manuais & Observações</h4>
                  </div>
                  {!isEditingNotes ? (
                    <button className={styles.editBtn} onClick={() => setIsEditingNotes(true)}>
                      <Edit3 size={14} />
                      <span>Editar Notas</span>
                    </button>
                  ) : (
                    <button className={styles.saveBtn} onClick={handleSaveNotes}>
                      <Save size={14} />
                      <span>Salvar Notas</span>
                    </button>
                  )}
                </div>
                {isEditingNotes ? (
                  <textarea 
                    className={styles.notesArea}
                    value={tempNotes}
                    onChange={(e) => setTempNotes(e.target.value)}
                    placeholder="Adicione observações manuais, pontos extras ou detalhes que a IA não capturou..."
                  />
                ) : (
                  <div className={styles.notesDisplay}>
                    {selectedMeeting.notes ? (
                      <p>{selectedMeeting.notes}</p>
                    ) : (
                      <p className={styles.emptyNotes}>Nenhuma nota manual adicionada ainda.</p>
                    )}
                  </div>
                )}
              </div>

              <div className={styles.dividerLarge} />

              {selectedMeeting.summary ? (
                <div className={styles.summaryCard}>
                  <div className={styles.summaryHeader}>
                    <div className={styles.summaryIcon}>
                      <FileText size={20} />
                    </div>
                    <div>
                      <h3>Ata Gerada por IA</h3>
                      <p>Processado em {new Date().toLocaleDateString('pt-BR')}</p>
                    </div>
                  </div>
                  
                  <div className={styles.summaryBody}>
                    <div className={styles.summarySection}>
                      <h4>Resumo Executivo</h4>
                      <p className={styles.insightsText}>{selectedMeeting.summary.insights}</p>
                    </div>

                    <div className={styles.summaryGrid}>
                      <div className={styles.summarySection}>
                        <h4>Decisões</h4>
                        <ul>
                          {selectedMeeting.summary.decisions.map((d: string, i: number) => (
                            <li key={i}>{d}</li>
                          ))}
                        </ul>
                      </div>
                      <div className={styles.summarySection}>
                        <h4>Próximos Passos</h4>
                        <ul>
                          {selectedMeeting.summary.nextSteps.map((s: string, i: number) => (
                            <li key={i}>{s}</li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {selectedMeeting.summary.risks?.[0] && (
                      <div className={styles.riskAlert}>
                        <Zap size={14} />
                        <span><strong>Risco Detectado:</strong> {selectedMeeting.summary.risks[0]}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className={styles.summaryFooter}>
                    <button className={styles.exportBtn}>Exportar para PDF</button>
                    <button className={styles.shareBtn}>Compartilhar Ata</button>
                  </div>
                </div>
              ) : (
                <div className={styles.transcriptionArea}>
                  <div className={styles.transcriptionHeader}>
                    <h3>Gerar Ata Inteligente</h3>
                    <p>Cole a transcrição da reunião ou suba o arquivo para <strong>{selectedMeeting.with}</strong>.</p>
                  </div>
                  
                  <div className={styles.inputWrapper}>
                    <textarea 
                      className={styles.transcriptionInput}
                      placeholder="Cole aqui o texto da transcrição da reunião..."
                      value={transcriptionText}
                      onChange={(e) => setTranscriptionText(e.target.value)}
                    />
                    <div className={styles.uploadOverlay}>
                      <input 
                        type="file" 
                        ref={fileInputRef} 
                        style={{ display: 'none' }} 
                        onChange={handleFileUpload}
                        accept=".txt,.doc,.docx,.pdf"
                      />
                      <button className={styles.uploadBtn} onClick={() => fileInputRef.current?.click()}>
                        <Upload size={16} />
                        <span>Subir arquivo de áudio ou texto</span>
                      </button>
                    </div>
                  </div>

                  <div className={styles.transcriptionActions}>
                    <button 
                      className={styles.generateBtn}
                      onClick={handleGenerateFromText}
                      disabled={isTranscribing || !transcriptionText.trim()}
                    >
                      {isTranscribing ? 'Processando...' : 'Gerar Ata com IA'}
                    </button>
                    <p className={styles.aiHint}>A IA analisará decisões e responsabilidades automaticamente.</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
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
                className={`${styles.meetingItem} ${selectedMeeting?.id === m.id ? styles.active : ''}`}
                onClick={() => {
                  setSelectedMeeting(m);
                  if (!m.hasSummary) setTranscriptionText('');
                }}
              >
                <div className={styles.meetingIcon}>
                  {m.hasSummary ? <Zap size={18} color="#6366f1" /> : (m.status === 'completed' ? <CheckCircle size={18} color="#10b981" /> : <Clock size={18} color="#f59e0b" />)}
                </div>
                <div className={styles.meetingInfo}>
                  <div className={styles.meetingTitleRow}>
                    <h3>{m.title}</h3>
                    <span className={`${styles.statusTag} ${
                      m.status === 'completed' ? styles.statusCompleted : 
                      m.status === 'ongoing' ? styles.statusOngoing : 
                      styles.statusUpcoming
                    }`}>
                      {m.status === 'completed' ? 'Concluída' : 
                       m.status === 'ongoing' ? 'Em Andamento' : 
                       'Agendada'}
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
                const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
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
                <span>Criar Reunião</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Success Modal */}
      {isSuccessModalOpen && (
        <div className={styles.modalOverlay} onClick={() => setIsSuccessModalOpen(false)}>
          <div className={styles.successModal} onClick={e => e.stopPropagation()}>
            <div className={styles.successIconWrapper}>
              <CheckCircle size={40} />
            </div>
            <h2>Sucesso!</h2>
            <p>{successMessage}</p>
            <button className={styles.primaryBtn} onClick={() => setIsSuccessModalOpen(false)}>
              Entendido
            </button>
          </div>
        </div>
      )}
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
