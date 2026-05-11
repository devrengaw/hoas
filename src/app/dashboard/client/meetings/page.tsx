'use client';

import React, { useState, useEffect } from 'react';
import { Video, Calendar, Clock, ChevronRight, Zap, CheckCircle, FileText, X } from 'lucide-react';
import styles from './page.module.css';
import { getMeetings } from '@/lib/database';

export default function MeetingsPage() {
  const [selectedMeeting, setSelectedMeeting] = useState<any>(null);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [meetings, setMeetings] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Mock Company ID for MVP
  const COMPANY_ID = '00000000-0000-0000-0000-000000000000';

  React.useEffect(() => {
    fetchMeetings();
  }, []);

  const showSuccess = (msg: string) => {
    setSuccessMessage(msg);
    setIsSuccessModalOpen(true);
  };

  const fetchMeetings = async () => {
    try {
      setIsLoading(true);
      const data = await getMeetings(COMPANY_ID);
      const mapped = data.map((m: any) => {
        const d = new Date(m.scheduled_at);
        return {
          id: m.id,
          title: m.title,
          with: m.guest_name || 'Participante Externo',
          time: d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
          date: d.toISOString().split('T')[0],
          status: m.status,
          hasSummary: !!m.ai_summary?.insights,
          summary: m.ai_summary
        };
      });
      setMeetings.apply(null, [mapped]); // Using setMeetings(mapped)
      setMeetings(mapped);
    } catch (error) {
      console.error('Error fetching meetings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTranscribe = () => {
    setIsTranscribing(true);
    setTimeout(() => {
      setSelectedMeeting({
        ...meetings[2],
        summary: {
          decisions: ["Aumento de 20% no investimento OOH", "Aprovação do novo KV"],
          nextSteps: ["Enviar proposta atualizada até sexta", "Agendar call com Diretor"],
          risks: ["Prazo de entrega dos assets apertado"],
          insights: "O cliente demonstrou alto interesse em formatos de vídeo curto."
        }
      });
      setIsTranscribing(false);
    }, 2500);
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div>
          <h1>Reuniões</h1>
          <p>Gerencie suas chamadas e utilize a IA para gerar atas automáticas.</p>
        </div>
        <div className={styles.headerActions}>
          <button className={styles.secondaryBtn} onClick={() => {
            navigator.clipboard.writeText('https://hoas.com.br/book/lucas-wagner');
            showSuccess('Seu link de agendamento foi copiado!');
          }}>
            <Calendar size={18} />
            <span>Link de Agendamento</span>
          </button>
          <button className={styles.primaryBtn}>
            <Video size={18} />
            <span>Agendar Nova Reunião</span>
          </button>
        </div>
      </header>

      <div className={styles.content}>
        <div className={styles.meetingList}>
          <h2>Próximas Reuniões</h2>
          {meetings.map((m) => (
            <div 
              key={m.id} 
              className={`${styles.meetingItem} ${m.status === 'completed' ? styles.completed : ''}`}
              onClick={() => m.status === 'completed' && handleTranscribe()}
            >
              <div className={styles.meetingIcon}>
                <Video size={20} />
              </div>
              <div className={styles.meetingInfo}>
                <h3>{m.title}</h3>
                <p>{m.with}</p>
                <div className={styles.meetingMeta}>
                  <span><Clock size={14} /> {m.time}</span>
                  <span><Calendar size={14} /> {m.date}</span>
                </div>
              </div>
              <div className={styles.meetingAction}>
                {m.status === 'completed' ? (
                  <button className={styles.summaryBtn}>
                    <Zap size={14} />
                    Ver IA Summary
                  </button>
                ) : (
                  <ChevronRight size={20} />
                )}
              </div>
            </div>
          ))}
        </div>

        <div className={styles.aiPanel}>
          <div className={styles.panelHeader}>
            <h2>Inteligência de Reunião</h2>
            {isTranscribing && <div className={styles.spinner} />}
          </div>

          {selectedMeeting ? (
            <div className={styles.summaryCard}>
              <div className={styles.summaryHeader}>
                <CheckCircle size={20} className={styles.successIcon} />
                <h3>Ata Gerada por IA</h3>
              </div>
              
              <div className={styles.summarySection}>
                <h4><Zap size={14} /> Insights & Riscos</h4>
                <p>{selectedMeeting.summary.insights}</p>
                <div className={styles.riskBadge}>Risco: {selectedMeeting.summary.risks[0]}</div>
              </div>

              <div className={styles.summarySection}>
                <h4><FileText size={14} /> Decisões Tomadas</h4>
                <ul>
                  {selectedMeeting.summary.decisions.map((d: string, i: number) => (
                    <li key={i}>{d}</li>
                  ))}
                </ul>
              </div>

              <div className={styles.summarySection}>
                <h4><Calendar size={14} /> Próximos Passos</h4>
                <ul>
                  {selectedMeeting.summary.nextSteps.map((s: string, i: number) => (
                    <li key={i}>{s}</li>
                  ))}
                </ul>
              </div>
            </div>
          ) : (
            <div className={styles.emptyPanel}>
              <Video size={48} />
              <p>Selecione uma reunião concluída para processar a transcrição e gerar o resumo inteligente.</p>
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
