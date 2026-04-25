'use client';

import React, { useState } from 'react';
import { 
  Wallet, 
  TrendingUp, 
  TrendingDown, 
  ArrowUpRight, 
  ArrowDownRight, 
  Download, 
  Filter, 
  Calendar,
  CreditCard,
  DollarSign,
  Building,
  Clock,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import styles from './page.module.css';

export default function FinancialDashboard() {
  const transactions = [
    { id: 1, type: 'in', amount: 'R$ 45.000,00', client: 'Coca-Cola', campaign: 'Natal 2026', status: 'Recebido', date: '24/04/2026' },
    { id: 2, type: 'out', amount: 'R$ 12.400,00', client: 'Google Ads', campaign: 'Performance Q2', status: 'Processando', date: '23/04/2026' },
    { id: 3, type: 'in', amount: 'R$ 18.000,00', client: 'Samsung', campaign: 'Galaxy S27', status: 'Pendente', date: '20/04/2026' },
    { id: 4, type: 'out', amount: 'R$ 5.000,00', client: 'Meta Ads', campaign: 'Social Media', status: 'Recebido', date: '18/04/2026' },
  ];

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div>
          <h1>Financeiro & Carteira</h1>
          <p>Acompanhe seu fluxo de caixa, pagamentos de mídia e recebimentos de clientes.</p>
        </div>
        <div className={styles.actions}>
          <button className={styles.exportBtn}><Download size={18} /> Exportar Relatório</button>
          <button className={styles.primaryBtn}><CreditCard size={18} /> Adicionar Fundo</button>
        </div>
      </header>

      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statHeader}>
            <div className={styles.statIcon}><Wallet size={20} /></div>
            <span className={styles.trend + " " + styles.up}><TrendingUp size={12} /> 12%</span>
          </div>
          <div className={styles.statValue}>R$ 284.500,00</div>
          <label>Saldo Total em Carteira</label>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statHeader}>
            <div className={styles.statIcon}><ArrowUpRight size={20} /></div>
            <span className={styles.trend + " " + styles.up}><TrendingUp size={12} /> 8%</span>
          </div>
          <div className={styles.statValue}>R$ 1.420.000,00</div>
          <label>Receita Bruta (Mês)</label>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statHeader}>
            <div className={styles.statIcon}><ArrowDownRight size={20} /></div>
            <span className={styles.trend + " " + styles.down}><TrendingDown size={12} /> 3%</span>
          </div>
          <div className={styles.statValue}>R$ 940.000,00</div>
          <label>Investimento em Mídia</label>
        </div>
      </div>

      <div className={styles.mainContent}>
        <section className={styles.tableSection}>
          <div className={styles.sectionHeader}>
            <h3>Transações Recentes</h3>
            <div className={styles.tableFilters}>
              <div className={styles.searchBox}>
                <Calendar size={16} />
                <span>Abril, 2026</span>
              </div>
              <button className={styles.filterIconBtn}><Filter size={18} /></button>
            </div>
          </div>

          <table className={styles.table}>
            <thead>
              <tr>
                <th>Data</th>
                <th>Cliente / Fornecedor</th>
                <th>Campanha</th>
                <th>Valor</th>
                <th>Status</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((t) => (
                <tr key={t.id}>
                  <td>{t.date}</td>
                  <td>
                    <div className={styles.entityInfo}>
                      <div className={t.type === 'in' ? styles.inIcon : styles.outIcon}>
                        {t.type === 'in' ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                      </div>
                      <span>{t.client}</span>
                    </div>
                  </td>
                  <td>{t.campaign}</td>
                  <td className={t.type === 'in' ? styles.inAmount : styles.outAmount}>{t.amount}</td>
                  <td>
                    <div className={`${styles.status} ${styles[t.status.toLowerCase()]}`}>
                      {t.status === 'Recebido' ? <CheckCircle2 size={12} /> : t.status === 'Processando' ? <Clock size={12} /> : <AlertCircle size={12} />}
                      {t.status}
                    </div>
                  </td>
                  <td><button className={styles.moreBtn}>Detalhes</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <aside className={styles.insights}>
          <h3>Insights Financeiros IA</h3>
          <div className={styles.insightCard}>
            <div className={styles.insightHeader}>
              <TrendingUp size={16} color="var(--secondary)" />
              <span>Otimização de Fluxo</span>
            </div>
            <p>Seu volume de recebimentos está 15% acima da média. Recomendamos antecipar o pagamento da fatura Google Ads para garantir 2% de desconto B2B.</p>
          </div>
          <div className={styles.insightCard}>
            <div className={styles.insightHeader}>
              <AlertCircle size={16} color="#fbbf24" />
              <span>Aviso de Saldo</span>
            </div>
            <p>O budget para a campanha 'Natal 2026' atingirá 80% do limite em 3 dias com base no ritmo atual de gastos.</p>
          </div>
        </aside>
      </div>
    </div>
  );
}
