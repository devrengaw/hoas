'use client';

import React, { useState } from 'react';
import { Video, Calendar, Clock, ChevronRight, Zap, CheckCircle, FileText } from 'lucide-react';
import styles from './page.module.css';

export default function MeetingsPage() {
  const [selectedMeeting, setSelectedMeeting] = useState<any>(null);
  const [isTranscribing, setIsTranscribing] = useState(false);

  const meetings = [
    { 
      id: 1, 
      title: 'Apresentação Projeto Verão', 
      with: 'Mariana Silva (Agência Global)', 
      time: '14:00 - 15:00', 
      status: 'upcoming',
      date: 'Hoje'
    },
    { 
      id: 2, 
      title: 'Discussão de Budget Q3', 
      with: 'Roberto Costa (Cliente Varejo)', 
      time: '16:30 - 17:30', 
      status: 'upcoming',
      date: 'Hoje'
    },
    { 
      id: 3, 
      title: 'Follow-up Campanha Natal', 
      with: 'Equipe Mídia SQUAD A', 
      time: '10:00 - 11:00', 
      status: 'completed',
      date: 'Ontem',
      hasSummary: true
    },
  ];

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
        <button className={styles.primaryBtn}>
          <Video size={18} />
          <span>Agendar Nova Reunião</span>
        </button>
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
    </div>
  );
}
