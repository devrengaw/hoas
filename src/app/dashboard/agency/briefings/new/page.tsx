'use client';

import React, { useState } from 'react';
import { Send, Zap, Target, DollarSign, Calendar, Sparkles, MapPin, Users, Hash, ChevronRight, ChevronLeft, Check } from 'lucide-react';
import styles from './page.module.css';

export default function CreateBriefingPage() {
  const [step, setStep] = useState(1);
  const [isAiSuggesting, setIsAiSuggesting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    brand: '',
    objective: '',
    targetAge: '',
    targetLocation: '',
    targetInterests: '',
    budget: '',
    duration: '',
    channels: [] as string[]
  });

  const handleNext = () => {
    setIsAiSuggesting(true);
    setTimeout(() => {
      setStep(step + 1);
      setIsAiSuggesting(false);
    }, 1200);
  };

  const handlePrev = () => setStep(step - 1);

  const toggleChannel = (channel: string) => {
    setFormData(prev => ({
      ...prev,
      channels: prev.channels.includes(channel) 
        ? prev.channels.filter(c => c !== channel)
        : [...prev.channels, channel]
    }));
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>Criar Novo Briefing</h1>
        <p>Preencha os dados da campanha para que a IA encontre as melhores oportunidades.</p>
      </header>

      <div className={styles.content}>
        <div className={styles.formSection}>
          <div className={styles.steps}>
            {[1, 2, 3, 4].map(s => (
              <React.Fragment key={s}>
                <div className={`${styles.step} ${step >= s ? styles.activeStep : ''}`}>
                  {step > s ? <Check size={16} /> : s}
                </div>
                {s < 4 && <div className={`${styles.stepLine} ${step > s ? styles.activeLine : ''}`} />}
              </React.Fragment>
            ))}
          </div>

          <div className={styles.stepContent}>
            {step === 1 && (
              <div className={styles.formGroup}>
                <h2>Informações Básicas</h2>
                <div className={styles.field}>
                  <label>Título da Campanha</label>
                  <input type="text" placeholder="Ex: Black Friday 2026" className={styles.input} />
                </div>
                <div className={styles.field}>
                  <label>Marca / Anunciante</label>
                  <input type="text" placeholder="Ex: Nike, Coca-Cola..." className={styles.input} />
                </div>
                <div className={styles.field}>
                  <label>Objetivo Principal</label>
                  <textarea placeholder="Descreva o que você espera alcançar com esta campanha..." className={styles.textarea} />
                </div>
                <div className={styles.checkboxField}>
                  <input type="checkbox" id="confidential" />
                  <label htmlFor="confidential" className={styles.checkboxLabel}>
                    <strong>Briefing Confidencial</strong>
                    <span>Apenas veículos selecionados poderão visualizar e enviar propostas.</span>
                  </label>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className={styles.formGroup}>
                <h2>Público-Alvo</h2>
                <div className={styles.gridFields}>
                  <div className={styles.field}>
                    <label><Users size={14} /> Faixa Etária</label>
                    <input type="text" placeholder="Ex: 18-35 anos" className={styles.input} />
                  </div>
                  <div className={styles.field}>
                    <label><MapPin size={14} /> Localização</label>
                    <input type="text" placeholder="Ex: Brasil / Sudeste" className={styles.input} />
                  </div>
                </div>
                <div className={styles.field}>
                  <label><Hash size={14} /> Interesses & Comportamento</label>
                  <input type="text" placeholder="Ex: Tecnologia, Esportes, Sustentabilidade..." className={styles.input} />
                </div>
              </div>
            )}

            {step === 3 && (
              <div className={styles.formGroup}>
                <h2>Budget & Canais</h2>
                <div className={styles.gridFields}>
                  <div className={styles.field}>
                    <label><DollarSign size={14} /> Verba Total Estimada</label>
                    <input type="text" placeholder="R$ 0,00" className={styles.input} />
                  </div>
                  <div className={styles.field}>
                    <label><Calendar size={14} /> Período de Veiculação</label>
                    <input type="text" placeholder="Ex: 30 dias" className={styles.input} />
                  </div>
                </div>
                <div className={styles.field}>
                  <label>Canais de Preferência</label>
                  <div className={styles.channelGrid}>
                    {['TV', 'OOH', 'Social', 'Podcast', 'Mídia Programática', 'Influenciadores'].map(c => (
                      <button 
                        key={c}
                        className={`${styles.channelBtn} ${formData.channels.includes(c) ? styles.activeChannel : ''}`}
                        onClick={() => toggleChannel(c)}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {step === 4 && (
              <div className={styles.reviewSection}>
                <div className={styles.successIcon}><Sparkles size={48} /></div>
                <h2>Tudo Pronto para o Envio!</h2>
                <p>Nossa IA refinou o seu briefing e já identificou 12 veículos com alto potencial de match.</p>
                <div className={styles.summaryCard}>
                  <p><strong>Campanha:</strong> Black Friday 2026</p>
                  <p><strong>Público:</strong> 18-35 anos, Tecnologia</p>
                  <p><strong>Match IA:</strong> Alta aderência para canais Digital e OOH.</p>
                </div>
              </div>
            )}
          </div>

          <div className={styles.formActions}>
            {step > 1 && <button className={styles.backBtn} onClick={handlePrev}><ChevronLeft size={18} /> Voltar</button>}
            {step < 4 ? (
              <button className={styles.nextBtn} onClick={handleNext}>Continuar <ChevronRight size={18} /></button>
            ) : (
              <button className={styles.submitBtn}><Send size={18} /> Publicar Briefing e Notificar Veículos</button>
            )}
          </div>
        </div>

        <aside className={styles.aiAssistant}>
          <div className={styles.aiHeader}>
            <Zap size={20} fill="currentColor" />
            <span>Assistente de Estratégia</span>
          </div>
          
          <div className={styles.aiChat}>
            <div className={styles.aiMsg}>
              {step === 1 && "Estou analisando seu objetivo. Recomendo citar o KPis principais (ex: CPC, Conversão) para atrair propostas mais técnicas."}
              {step === 2 && "Para este público jovem, veículos de streaming e games estão com alta performance este mês. Deseja incluir estes canais?"}
              {step === 3 && "Com este budget, você pode considerar uma cota de patrocínio em eventos premium. Vi 3 oportunidades no marketplace HOAS."}
              {step === 4 && "Briefing de alta qualidade! As chances de receber propostas em menos de 24h são de 92%."}
            </div>
            
            {isAiSuggesting && <div className={styles.aiMsgLoading}>Ajustando inteligência de mercado...</div>}
          </div>

          <div className={styles.aiActions}>
            <button className={styles.aiActionBtn}>Aplicar Otimização IA</button>
          </div>
        </aside>
      </div>
    </div>
  );
}
