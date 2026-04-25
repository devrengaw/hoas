'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ChevronRight, 
  ChevronLeft, 
  Check, 
  Target, 
  Users, 
  DollarSign, 
  Calendar,
  Sparkles,
  Shield,
  Zap,
  Building2
} from 'lucide-react';
import styles from './page.module.css';

export default function NewNecessityPage() {
  const [step, setStep] = useState(1);
  const router = useRouter();

  const steps = [
    { id: 1, name: 'Campanha', icon: Target },
    { id: 2, name: 'Público', icon: Users },
    { id: 3, name: 'Investimento', icon: DollarSign },
    { id: 4, name: 'Preferências', icon: Zap },
  ];

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <button className={styles.backBtn} onClick={() => router.back()}>
            <ChevronLeft size={20} />
          </button>
          <div>
            <h1>Postar Nova Necessidade</h1>
            <p>Conte o que sua marca precisa para atrairmos as melhores agências.</p>
          </div>
        </div>
        <div className={styles.steps}>
          {steps.map((s) => (
            <div key={s.id} className={`${styles.stepItem} ${step >= s.id ? styles.activeStep : ''}`}>
              <div className={styles.stepIcon}>
                {step > s.id ? <Check size={16} /> : <s.icon size={16} />}
              </div>
              <span>{s.name}</span>
            </div>
          ))}
        </div>
      </header>

      <div className={styles.mainContent}>
        <div className={styles.formCard}>
          {step === 1 && (
            <div className={styles.stepContent}>
              <h2>Informações da Campanha</h2>
              <div className={styles.fieldGrid}>
                <div className={styles.field}>
                  <label>Título da Necessidade</label>
                  <input type="text" placeholder="Ex: Lançamento Coleção Inverno 2026" />
                </div>
                <div className={styles.field}>
                  <label>Objetivo Principal</label>
                  <select>
                    <option>Branding / Awareness</option>
                    <option>Performance / Vendas</option>
                    <option>Lançamento de Produto</option>
                    <option>Reposicionamento</option>
                  </select>
                </div>
                <div className={styles.fieldFull}>
                  <label>Descrição do que sua marca busca</label>
                  <textarea placeholder="Descreva brevemente o desafio que sua agência parceira precisará resolver..." />
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className={styles.stepContent}>
              <h2>Público & Alcance</h2>
              <div className={styles.fieldGrid}>
                <div className={styles.field}>
                  <label>Perfil do Público-Alvo</label>
                  <input type="text" placeholder="Ex: Jovens 18-24, Classe AB" />
                </div>
                <div className={styles.field}>
                  <label>Abrangência</label>
                  <select>
                    <option>Nacional (Brasil)</option>
                    <option>Regional / Local</option>
                    <option>Internacional</option>
                  </select>
                </div>
                <div className={styles.fieldFull}>
                  <label>Praças de Interesse</label>
                  <input type="text" placeholder="Ex: São Paulo, Rio de Janeiro, Belo Horizonte" />
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className={styles.stepContent}>
              <h2>Investimento & Cronograma</h2>
              <div className={styles.fieldGrid}>
                <div className={styles.field}>
                  <label>Budget Estimado (Range)</label>
                  <select>
                    <option>R$ 50k - R$ 100k</option>
                    <option>R$ 100k - R$ 500k</option>
                    <option>R$ 500k - R$ 1M</option>
                    <option>Acima de R$ 1M</option>
                    <option>A definir / Sob consulta</option>
                  </select>
                </div>
                <div className={styles.field}>
                  <label>Período da Campanha</label>
                  <input type="text" placeholder="Ex: Outubro a Dezembro 2026" />
                </div>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className={styles.stepContent}>
              <h2>Preferências de Agência</h2>
              <div className={styles.fieldGrid}>
                <div className={styles.fieldFull}>
                  <label>Especialidades Requeridas</label>
                  <div className={styles.tagSelector}>
                    <button className={styles.tagBtn}>Digital</button>
                    <button className={styles.tagBtn}>OOH</button>
                    <button className={styles.tagBtn}>Estratégia</button>
                    <button className={styles.tagBtn}>Criação</button>
                    <button className={styles.tagBtn}>Social Media</button>
                  </div>
                </div>
                <div className={styles.fieldFull}>
                  <label>Informações Adicionais</label>
                  <textarea placeholder="Algum requisito específico ou agência que gostaria de evitar?" />
                </div>
              </div>
            </div>
          )}

          <div className={styles.formActions}>
            <button 
              className={styles.secondaryBtn} 
              onClick={() => step > 1 ? setStep(step - 1) : router.back()}
            >
              {step === 1 ? 'Cancelar' : 'Voltar'}
            </button>
            <button 
              className={styles.primaryBtn} 
              onClick={() => step < 4 ? setStep(step + 1) : router.push('/dashboard/client/briefings')}
            >
              {step === 4 ? 'Publicar Necessidade' : 'Próximo Passo'}
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        <aside className={styles.assistant}>
          <div className={styles.assistantHeader}>
            <Sparkles size={20} color="var(--primary)" />
            <span>Assistente HOAS</span>
          </div>
          <div className={styles.assistantBody}>
            <p><strong>Dica de Especialista:</strong></p>
            <p>Ao definir um range de budget, você atrai agências com a estrutura correta para o seu investimento, economizando tempo de triagem.</p>
            <div className={styles.securityBadge}>
              <Shield size={14} />
              <span>Dados protegidos por NDA</span>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
