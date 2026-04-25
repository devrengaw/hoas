'use client';

import React, { useState } from 'react';
import { Upload, FileText, CheckCircle, AlertCircle, Search, Filter } from 'lucide-react';
import styles from './page.module.css';

export default function BriefingsPage() {
  const [isUploading, setIsUploading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);

  const simulateAIAnalysis = () => {
    setIsUploading(true);
    // Simulate AI delay
    setTimeout(() => {
      setAnalysisResult({
        objective: "Lançamento de novo produto - Linha Summer 2026",
        audience: "Jovens de 18-30 anos, interessados em moda sustentável",
        budget: "R$ 500.000,00",
        timing: "Outubro a Dezembro",
        recommendations: [
          "Veículos de Estilo de Vida",
          "Influenciadores de Sustentabilidade",
          "OOH em regiões litorâneas"
        ]
      });
      setIsUploading(false);
    }, 2000);
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div>
          <h1>Briefings</h1>
          <p>Gerencie e analise seus briefings com inteligência artificial.</p>
        </div>
        <button className={styles.uploadBtn} onClick={simulateAIAnalysis}>
          <Upload size={18} />
          <span>Subir Novo Briefing</span>
        </button>
      </header>

      <div className={styles.content}>
        <section className={styles.listSection}>
          <div className={styles.controls}>
            <div className={styles.searchBox}>
              <Search size={18} />
              <input type="text" placeholder="Buscar briefings..." />
            </div>
            <button className={styles.filterBtn}>
              <Filter size={18} />
              <span>Filtros</span>
            </button>
          </div>

          <div className={styles.briefingList}>
            <div className={styles.briefingItem}>
              <div className={styles.itemIcon}>
                <FileText size={24} />
              </div>
              <div className={styles.itemInfo}>
                <h3>Campanha Verão 2026</h3>
                <span>Enviado em 24/04/2026 • Agência XYZ</span>
              </div>
              <div className={styles.statusBadge}>Analisado</div>
            </div>
          </div>
        </section>

        <aside className={styles.analysisSection}>
          <div className={styles.analysisHeader}>
            <h2>Análise da IA</h2>
            {isUploading && <div className={styles.loadingSpinner} />}
          </div>

          {analysisResult ? (
            <div className={styles.analysisCard}>
              <div className={styles.insightItem}>
                <label>Objetivo</label>
                <p>{analysisResult.objective}</p>
              </div>
              <div className={styles.insightItem}>
                <label>Público-Alvo</label>
                <p>{analysisResult.audience}</p>
              </div>
              <div className={styles.insightItem}>
                <label>Budget Estimado</label>
                <p>{analysisResult.budget}</p>
              </div>
              <div className={styles.insightItem}>
                <label>Timing</label>
                <p>{analysisResult.timing}</p>
              </div>
              <div className={styles.recommendations}>
                <label>Recomendações HOAS</label>
                <ul>
                  {analysisResult.recommendations.map((rec: string, i: number) => (
                    <li key={i}>{rec}</li>
                  ))}
                </ul>
              </div>
            </div>
          ) : (
            <div className={styles.emptyAnalysis}>
              <AlertCircle size={48} />
              <p>Selecione um briefing ou suba um novo para ver a análise da IA.</p>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
