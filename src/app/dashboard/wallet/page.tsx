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
import { useMVPData } from '@/hooks/useMVPData';

export default function FinancialDashboard() {
  const { data: transactions, loading } = useMVPData('transactions');

  const totalIn = transactions?.filter((t: any) => t.type === 'in').reduce((acc: number, t: any) => acc + Number(t.amount), 0) || 0;
  const totalOut = transactions?.filter((t: any) => t.type === 'out').reduce((acc: number, t: any) => acc + Number(t.amount), 0) || 0;
  const balance = totalIn - totalOut;

  const formatBRL = (val: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
  };

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
          <div className={styles.statValue}>{formatBRL(balance)}</div>
          <label>Saldo Total em Carteira</label>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statHeader}>
            <div className={styles.statIcon}><ArrowUpRight size={20} /></div>
            <span className={styles.trend + " " + styles.up}><TrendingUp size={12} /> 12%</span>
          </div>
          <div className={styles.statValue}>{formatBRL(totalIn)}</div>
          <label>Receita Bruta (Mês)</label>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statHeader}>
            <div className={styles.statIcon}><ArrowDownRight size={20} /></div>
            <span className={styles.trend + " " + styles.down}><TrendingDown size={12} /> 3%</span>
          </div>
          <div className={styles.statValue}>{formatBRL(totalOut)}</div>
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
              {loading ? (
                <tr><td colSpan={6} style={{ textAlign: 'center', padding: '2rem' }}>Carregando transações...</td></tr>
              ) : !transactions || transactions.length === 0 ? (
                <tr><td colSpan={6} style={{ textAlign: 'center', padding: '2rem' }}>Nenhuma transação encontrada.</td></tr>
              ) : (
                transactions.map((t: any) => (
                  <tr key={t.id}>
                    <td>{new Date(t.transaction_date).toLocaleDateString('pt-BR')}</td>
                    <td>
                      <div className={styles.entityInfo}>
                        <div className={t.type === 'in' ? styles.inIcon : styles.outIcon}>
                          {t.type === 'in' ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                        </div>
                        <span>{t.entity_name}</span>
                      </div>
                    </td>
                    <td>{t.campaign_name || '-'}</td>
                    <td className={t.type === 'in' ? styles.inAmount : styles.outAmount}>{formatBRL(Number(t.amount))}</td>
                    <td>
                      <div className={`${styles.status} ${styles[(t.status || 'Pendente').toLowerCase()]}`}>
                        {t.status === 'Recebido' ? <CheckCircle2 size={12} /> : t.status === 'Processando' ? <Clock size={12} /> : <AlertCircle size={12} />}
                        {t.status || 'Pendente'}
                      </div>
                    </td>
                    <td><button className={styles.moreBtn}>Detalhes</button></td>
                  </tr>
                ))
              )}
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
