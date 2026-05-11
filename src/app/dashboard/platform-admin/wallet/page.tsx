'use client';

import React from 'react';
import { Wallet, CreditCard, ArrowUpRight, ArrowDownRight, ShieldCheck } from 'lucide-react';
import styles from './page.module.css';

export default function PlatformWallet() {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div>
          <div className={styles.adminBadge}>
            <ShieldCheck size={14} />
            <span>Faturamento Global</span>
          </div>
          <h1>Carteira Platform</h1>
          <p>Acompanhe o fluxo financeiro de assinaturas e transações da plataforma.</p>
        </div>
      </header>

      <div className={styles.mainBox}>
        <div className={styles.balanceCard}>
          <div className={styles.balanceInfo}>
            <span>Saldo Total em Transações</span>
            <h2>R$ 842.150,00</h2>
          </div>
          <div className={styles.balanceActions}>
            <button className={styles.withdrawBtn}>Gerar Relatório</button>
          </div>
        </div>

        <div className={styles.transactions}>
          <h3>Transações Recentes</h3>
          <div className={styles.transactionList}>
            {[1, 2, 3].map(i => (
              <div key={i} className={styles.txItem}>
                <div className={styles.txIcon}><ArrowUpRight size={18} /></div>
                <div className={styles.txDetails}>
                  <strong>Assinatura Enterprise - Agência Global</strong>
                  <span>05 de Maio, 2026</span>
                </div>
                <div className={styles.txValue}>+ R$ 5.000,00</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
