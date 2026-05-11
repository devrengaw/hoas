'use client';

import React, { useState, useRef } from 'react';
import { 
  X, Zap, Calendar, Clock, Edit3, Save, FileText, 
  Trash2, RotateCcw, Mail, Phone, Bell, Check, AlertTriangle, Upload 
} from 'lucide-react';
import styles from './MeetingModal.module.css';
import { Meeting } from '@/lib/mockData';

interface MeetingModalProps {
  meeting: Meeting;
  onClose: () => void;
  onUpdate: (updatedMeeting: Meeting) => void;
}

export default function MeetingModal({ meeting, onClose, onUpdate }: MeetingModalProps) {
  const [isEditingNotes, setIsEditingNotes] = useState(false);
  const [tempNotes, setTempNotes] = useState(meeting.notes || '');
  const [isRescheduling, setIsRescheduling] = useState(false);
  const [rescheduleData, setRescheduleData] = useState({ date: meeting.date, time: meeting.time });
  
  // Transcription states
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [transcriptionText, setTranscriptionText] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSaveNotes = () => {
    onUpdate({ ...meeting, notes: tempNotes });
    setIsEditingNotes(false);
  };

  const handleCancel = () => {
    if (confirm('Tem certeza que deseja cancelar esta reunião? Os participantes serão notificados.')) {
      onUpdate({ ...meeting, status: 'cancelled' });
      alert(`Notificação enviada para ${meeting.email || meeting.with}: Reunião cancelada.`);
      onClose();
    }
  };

  const handleReschedule = () => {
    onUpdate({ 
      ...meeting, 
      date: rescheduleData.date, 
      time: rescheduleData.time,
      status: 'upcoming'
    });
    alert(`Notificação de reagendamento enviada para ${meeting.email || meeting.with}.`);
    setIsRescheduling(false);
  };

  const handleApprove = () => {
    onUpdate({ ...meeting, status: 'upcoming' });
    alert(`Reunião aprovada! Notificação enviada para ${meeting.with}.`);
  };

  const handleReject = () => {
    onUpdate({ ...meeting, status: 'cancelled' });
    alert(`Reunião rejeitada. Notificação enviada para ${meeting.with}.`);
    onClose();
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

  const handleGenerateAI = () => {
    if (!transcriptionText.trim()) return;
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

      onUpdate({
        ...meeting,
        status: 'completed',
        hasSummary: true,
        summary: newSummary
      });
      setIsTranscribing(false);
      setTranscriptionText('');
    }, 2500);
  };

  // Helper to format WhatsApp link
  const getWhatsAppLink = (phone: string) => {
    const cleanNumber = phone.replace(/\D/g, '');
    return `https://wa.me/55${cleanNumber}`;
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <div className={styles.headerTitle}>
            <Zap size={20} color="#6366f1" />
            <h2>Detalhes da Reunião</h2>
          </div>
          <button className={styles.closeBtn} onClick={onClose}><X size={20} /></button>
        </div>

        <div className={styles.meetingMainInfo}>
          <div className={styles.infoRow}>
            <div className={styles.titleArea}>
              <h1>{meeting.title}</h1>
              <p>Com <strong>{meeting.with}</strong></p>
            </div>
            <div className={styles.statusArea}>
              <span className={`${styles.statusTag} ${styles[meeting.status]}`}>
                {meeting.status === 'completed' ? 'Concluída' : 
                 meeting.status === 'ongoing' ? 'Em Andamento' : 
                 meeting.status === 'cancelled' ? 'Cancelada' :
                 meeting.status === 'requested' ? 'Solicitada' : 'Agendada'}
              </span>
            </div>
          </div>

          <div className={styles.contactInfo}>
            {meeting.email && (
              <a href={`mailto:${meeting.email}`} className={styles.contactItem}>
                <Mail size={14} />
                <span>{meeting.email}</span>
                <div className={styles.verifiedBadge} title="Usuário Cadastrado"><Check size={10} /></div>
              </a>
            )}
            {meeting.phone && (
              <a href={getWhatsAppLink(meeting.phone)} target="_blank" rel="noopener noreferrer" className={styles.contactItem}>
                <Phone size={14} />
                <span>{meeting.phone}</span>
              </a>
            )}
          </div>

          <div className={styles.timeInfo}>
            <div className={styles.timeItem}>
              <Calendar size={16} />
              <span>{meeting.date}</span>
            </div>
            <div className={styles.timeItem}>
              <Clock size={16} />
              <span>{meeting.time}</span>
            </div>
          </div>
        </div>

        {meeting.status === 'requested' && (
          <div className={styles.requestAlert}>
            <div className={styles.alertContent}>
              <AlertTriangle size={20} />
              <div>
                <strong>Solicitação de Reunião</strong>
                <p>Esta reunião foi solicitada por {meeting.with} e aguarda sua aprovação.</p>
              </div>
            </div>
            <div className={styles.alertActions}>
              <button className={styles.approveBtn} onClick={handleApprove}>Aprovar</button>
              <button className={styles.rejectBtn} onClick={handleReject}>Recusar</button>
            </div>
          </div>
        )}

        <div className={styles.scrollContent}>
          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <div className={styles.sectionTitle}>
                <Edit3 size={16} />
                <h3>Notas e Observações</h3>
              </div>
              {!isEditingNotes ? (
                <button className={styles.editBtn} onClick={() => setIsEditingNotes(true)}>Editar</button>
              ) : (
                <button className={styles.saveBtn} onClick={handleSaveNotes}>Salvar</button>
              )}
            </div>
            {isEditingNotes ? (
              <textarea 
                className={styles.notesArea}
                value={tempNotes}
                onChange={e => setTempNotes(e.target.value)}
                placeholder="Adicione notas sobre a reunião..."
              />
            ) : (
              <div className={styles.notesDisplay}>
                {meeting.notes ? <p>{meeting.notes}</p> : <p className={styles.emptyText}>Nenhuma nota adicionada.</p>}
              </div>
            )}
          </div>

          {meeting.hasSummary && meeting.summary ? (
            <div className={styles.summarySection}>
              <div className={styles.sectionTitle}>
                <FileText size={16} />
                <h3>Ata Gerada por IA</h3>
              </div>
              <div className={styles.summaryContent}>
                <p className={styles.insights}>{meeting.summary.insights}</p>
                <div className={styles.summaryGrid}>
                  <div>
                    <h4>Decisões</h4>
                    <ul>
                      {meeting.summary.decisions.map((d: string, i: number) => <li key={i}>{d}</li>)}
                    </ul>
                  </div>
                  <div>
                    <h4>Próximos Passos</h4>
                    <ul>
                      {meeting.summary.nextSteps.map((s: string, i: number) => <li key={i}>{s}</li>)}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          ) : meeting.status !== 'requested' && meeting.status !== 'cancelled' && (
            <div className={styles.transcriptionSection}>
              <div className={styles.sectionTitle}>
                <Zap size={16} />
                <h3>Gerar Ata Inteligente</h3>
              </div>
              <div className={styles.transcriptionContainer}>
                <div className={styles.inputWrapper}>
                  <textarea 
                    className={styles.transcriptionInput}
                    placeholder="Cole aqui a transcrição da reunião ou suba um arquivo..."
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
                      <Upload size={14} />
                      <span>Subir arquivo</span>
                    </button>
                  </div>
                </div>
                <button 
                  className={styles.generateBtn} 
                  onClick={handleGenerateAI}
                  disabled={isTranscribing || !transcriptionText.trim()}
                >
                  {isTranscribing ? 'Analisando com IA...' : 'Gerar Ata com IA'}
                </button>
              </div>
            </div>
          )}
        </div>

        <div className={styles.modalFooter}>
          {isRescheduling ? (
            <div className={styles.rescheduleForm}>
              <input type="date" value={rescheduleData.date} onChange={e => setRescheduleData({...rescheduleData, date: e.target.value})} />
              <input type="time" value={rescheduleData.time} onChange={e => setRescheduleData({...rescheduleData, time: e.target.value})} />
              <button className={styles.confirmReschedule} onClick={handleReschedule}>Confirmar</button>
              <button className={styles.cancelAction} onClick={() => setIsRescheduling(false)}>Voltar</button>
            </div>
          ) : (
            <div className={styles.mainActions}>
              {meeting.status !== 'completed' && meeting.status !== 'cancelled' && (
                <>
                  <button className={styles.rescheduleBtn} onClick={() => setIsRescheduling(true)}>
                    <RotateCcw size={16} /> Reagendar
                  </button>
                  <button className={styles.cancelBtn} onClick={handleCancel}>
                    <Trash2 size={16} /> Cancelar Reunião
                  </button>
                </>
              )}
              {meeting.status === 'completed' && (
                <button className={styles.exportBtn}>Exportar Ata PDF</button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
