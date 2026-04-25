'use client';

import React, { useState } from 'react';
import { Plus, Image as ImageIcon, Layout, Users, TrendingUp, DollarSign, Zap, Check, ChevronRight } from 'lucide-react';
import styles from './page.module.css';

export default function NewProjectPage() {
  const [step, setStep] = useState(1);
  const [isAiAnalyzing, setIsAiAnalyzing] = useState(false);

  const handleNext = () => {
    setIsAiAnalyzing(true);
    setTimeout(() => {
      setStep(step + 1);
      setIsAiAnalyzing(false);
    }, 1500);
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>Publicar Novo Projeto</h1>
        <p>Crie um projeto comercial atraente e receba sugestões da IA para aumentar suas vendas.</p>
      </header>

      <div className={styles.content}>
        <div className={styles.formSection}>
          <div className={styles.steps}>
            {[1, 2, 3].map(s => (
              <React.Fragment key={s}>
                <div className={`${styles.step} ${step >= s ? styles.activeStep : ''}`}>
                  {step > s ? <Check size={16} /> : s}
                </div>
                {s < 3 && <div className={`${styles.stepLine} ${step > s ? styles.activeLine : ''}`} />}
              </React.Fragment>
            ))}
          </div>

          {step === 1 && (
            <div className={styles.formGroup}>
              <h2>Conceito do Projeto</h2>
              <div className={styles.field}>
                <label>Título do Projeto</label>
                <input type="text" placeholder="Ex: Patrocínio Festival de Verão" className={styles.input} />
              </div>
              <div className={styles.field}>
                <label>Categoria</label>
                <select className={styles.select}>
                  <option>Digital</option>
                  <option>TV / Vídeo</option>
                  <option>OOH</option>
                  <option>Audio / Podcast</option>
                  <option>Branded Content</option>
                </select>
              </div>
              <div className={styles.field}>
                <label>Descrição Comercial</label>
                <textarea placeholder="Venda seu peixe! O que torna este projeto único?" className={styles.textarea} />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className={styles.formGroup}>
              <h2>Métricas & Público</h2>
              <div className={styles.gridFields}>
                <div className={styles.field}>
                  <label><TrendingUp size={14} /> Alcance Estimado</label>
                  <input type="text" placeholder="Ex: 500k impactos" className={styles.input} />
                </div>
                <div className={styles.field}>
                  <label><Users size={14} /> Perfil do Público</label>
                  <input type="text" placeholder="Ex: Classe AB, 25-45 anos" className={styles.input} />
                </div>
              </div>
              <div className={styles.field}>
                <label><DollarSign size={14} /> Valor da Cota / Investimento</label>
                <input type="text" placeholder="R$ 0,00" className={styles.input} />
              </div>
              <div className={styles.field}>
                <label>Upload de Media Kit (Opcional)</label>
                <div className={styles.uploadArea}>
                  <Plus size={24} />
                  <span>Arraste o PDF ou clique para subir</span>
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className={styles.previewSection}>
              <div className={styles.previewCard}>
                <div className={styles.previewImage}><ImageIcon size={48} /></div>
                <div className={styles.previewContent}>
                  <h3>Patrocínio Festival de Verão</h3>
                  <span className={styles.badge}>Aguardando Publicação</span>
                  <p>Este projeto será listado para 450+ agências na plataforma.</p>
                </div>
              </div>
              <button className={styles.publishBtn}>Confirmar e Publicar no Marketplace</button>
            </div>
          )}

          {step < 3 && (
            <div className={styles.formActions}>
              <button className={styles.nextBtn} onClick={handleNext}>
                {isAiAnalyzing ? 'IA Analisando...' : 'Próximo Passo'} <ChevronRight size={18} />
              </button>
            </div>
          )}
        </div>

        <aside className={styles.aiPanel}>
          <div className={styles.aiHeader}>
            <Zap size={20} fill="currentColor" />
            <span>AI Quality Check</span>
          </div>
          <div className={styles.aiContent}>
            <div className={styles.aiScore}>
              <div className={styles.scoreCircle}>85</div>
              <span>Score de Atratividade</span>
            </div>
            <div className={styles.aiSuggestions}>
              <h4>Sugestões de Melhoria:</h4>
              <ul>
                <li>Adicione métricas de <strong>engajamento real</strong> para atrair agências de performance.</li>
                <li>O título está muito genérico. Tente algo como <strong>"Conexão Verão: Impacto e Awareness"</strong>.</li>
                <li>Seu valor está 15% abaixo da média do mercado, o que é um ótimo <strong>diferencial competitivo</strong>.</li>
              </ul>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
