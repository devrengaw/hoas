'use client';

import React, { useState, useEffect } from 'react';
import { 
  Mic, MicOff, Video as VideoIcon, VideoOff, 
  Monitor, MessageSquare, Users, Settings, 
  PhoneOff, Sparkles, Brain, LayoutGrid 
} from 'lucide-react';
import styles from './MeetingRoom.module.css';

export default function MeetingRoom({ partnerName = "Mariana Silva", company = "Agência Global", onEndCall }: { partnerName?: string, company?: string, onEndCall?: () => void }) {
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [aiInsights, setAiInsights] = useState<string[]>([]);

  // Simulate AI hearing the conversation
  useEffect(() => {
    const insights = [
      "Parceiro mencionou interesse em ROI de 15%",
      "Discussão sobre verba de Digital vs OOH",
      "Sugerido aumento de frequência para Black Friday"
    ];
    
    const interval = setInterval(() => {
      setAiInsights(prev => {
        if (prev.length >= insights.length) return prev;
        return [...prev, insights[prev.length]];
      });
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.mainGrid}>
        {/* Remote Video */}
        <div className={styles.videoStage}>
          <div className={styles.remoteVideo}>
            <img 
              src={`https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=1200&h=800`} 
              alt={partnerName} 
            />
            <div className={styles.partnerNameLabel}>
              <Users size={14} />
              <span>{partnerName} ({company})</span>
            </div>
          </div>

          {/* Local Video (Self) */}
          <div className={styles.selfVideo}>
            {isVideoOff ? (
              <div className={styles.videoOffPlaceholder}>Você</div>
            ) : (
              <img 
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300&h=200" 
                alt="Self" 
              />
            )}
          </div>
        </div>

        {/* AI Insights Sidebar */}
        <aside className={styles.aiSidebar}>
          <div className={styles.aiHeader}>
            <Sparkles size={18} color="var(--primary)" />
            <span>HOAS AI Insights</span>
          </div>
          
          <div className={styles.insightList}>
            <div className={styles.aiTopic}>
              <Brain size={16} />
              <span>Ata em Tempo Real</span>
            </div>
            {aiInsights.map((insight, i) => (
              <div key={i} className={styles.insightItem}>
                {insight}
              </div>
            ))}
            {aiInsights.length === 0 && <p className={styles.loadingAi}>Ouvindo conversa...</p>}
          </div>

          <div className={styles.sentimentCard}>
            <label>Sentimento da Reunião</label>
            <div className={styles.sentimentMeter}>
              <div className={styles.meterFill} style={{ width: '85%' }} />
            </div>
            <span>85% Positivo / Alta Intenção</span>
          </div>
        </aside>
      </div>

      {/* Control Bar */}
      <footer className={styles.controls}>
        <div className={styles.leftTools}>
          <button className={styles.toolBtn}><LayoutGrid size={20} /></button>
          <button className={styles.toolBtn}><Settings size={20} /></button>
        </div>

        <div className={styles.mainTools}>
          <button 
            className={`${styles.actionBtn} ${isMuted ? styles.danger : ''}`} 
            onClick={() => setIsMuted(!isMuted)}
          >
            {isMuted ? <MicOff size={24} /> : <Mic size={24} />}
          </button>
          
          <button 
            className={`${styles.actionBtn} ${isVideoOff ? styles.danger : ''}`} 
            onClick={() => setIsVideoOff(!isVideoOff)}
          >
            {isVideoOff ? <VideoOff size={24} /> : <VideoIcon size={24} />}
          </button>

          <button className={styles.actionBtn}><Monitor size={24} /></button>
          
          <button className={styles.endCallBtn} onClick={onEndCall}>
            <PhoneOff size={24} />
          </button>
        </div>

        <div className={styles.rightTools}>
          <button className={styles.toolBtn}><MessageSquare size={20} /></button>
          <button className={styles.toolBtn}><Users size={20} /></button>
        </div>
      </footer>
    </div>
  );
}
