'use client';

import React from 'react';
import Link from 'next/link';
import { ChevronLeft, MessageSquare, Target, Smartphone, Gift, CreditCard, TrendingUp, Info, BarChart, ImageIcon } from 'lucide-react';
import styles from './page.module.css';

export default function PicPayAdsProfile() {
  return (
    <div className={styles.container}>
      <div style={{ marginBottom: '1rem' }}>
        <Link href="/dashboard/directory" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)' }}>
          <ChevronLeft size={18} /> Voltar para o Diretório
        </Link>
      </div>

      <div className={styles.cover}>
        {/* Placeholder for Cover Logo */}
        {/* Recomendado adicionar a imagem oficial depois em public/picpay/picpay-ads-logo-white.png */}
        <h1 style={{ color: 'white', fontSize: '3rem', fontWeight: 800 }}>PicPay | ads</h1>
      </div>

      <div className={styles.headerContent}>
        <div className={styles.logoWrapper}>
          {/* Logo do PicPay. Recomendado: public/picpay/picpay-icon.png */}
          <div style={{ background: '#11C76F', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold', fontSize: '1.5rem' }}>
            PicPay
          </div>
        </div>

        <div className={styles.headerInfo}>
          <div className={styles.categoryBadge}>Financial Media</div>
          <h1>PicPay Ads</h1>
          <p style={{ color: 'var(--text-secondary)' }}>A plataforma de mídia e dados do PicPay.</p>
        </div>

        <div className={styles.headerActions}>
          <button className={styles.contactBtn}>
            <MessageSquare size={18} />
            Entrar em Contato
          </button>
        </div>
      </div>

      <div className={styles.mainGrid}>
        <div className={styles.leftCol}>
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>
              <Info size={20} color="#11C76F" /> Sobre o PicPay Ads
            </h2>
            <div className={styles.bio}>
              <p>A plataforma de mídia e dados do PicPay, conecta marcas a milhões de usuários ativos em um dos maiores ecossistemas financeiros digitais do Brasil.</p>
              <p>Com base em dados transacionais reais e comportamento de consumo, o PicPay Ads oferece segmentações altamente qualificadas, permitindo campanhas mais eficientes, personalizadas e com impacto direto em performance.</p>
              <p>A plataforma possibilita ativações ao longo de toda a jornada do usuário, desde awareness até conversão, dentro de um ambiente proprietário, seguro e com alta recorrência de uso.</p>
              <p>Além disso, o PicPay Ads se diferencia por unir mídia, dados e transação no mesmo ambiente, permitindo não apenas impactar o usuário, mas acompanhar e influenciar diretamente o resultado final.</p>
            </div>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>
              <Target size={20} color="#11C76F" /> Principais Possibilidades
            </h2>
            <div className={styles.featuresList}>
              <div className={styles.featureItem}>
                <div className={styles.featureIcon}><BarChart size={20} /></div>
                <div className={styles.featureText}>Segmentação baseada em comportamento financeiro e hábitos de consumo</div>
              </div>
              <div className={styles.featureItem}>
                <div className={styles.featureIcon}><Smartphone size={20} /></div>
                <div className={styles.featureText}>Mídia dentro do app com alto nível de atenção e engajamento</div>
              </div>
              <div className={styles.featureItem}>
                <div className={styles.featureIcon}><Gift size={20} /></div>
                <div className={styles.featureText}>Incentivos, cashback e gamificação para acelerar conversão</div>
              </div>
              <div className={styles.featureItem}>
                <div className={styles.featureIcon}><CreditCard size={20} /></div>
                <div className={styles.featureText}>Integração com pagamentos, facilitando jornadas de compra completas</div>
              </div>
              <div className={styles.featureItem}>
                <div className={styles.featureIcon}><TrendingUp size={20} /></div>
                <div className={styles.featureText}>Soluções para aquisição, retenção e aumento de frequência de clientes</div>
              </div>
            </div>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>
              <ImageIcon size={20} color="#11C76F" /> Cases e Audiência (Galeria)
            </h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
              Confira os destaques da nossa plataforma.
            </p>
            <div className={styles.galleryGrid}>
              <div className={styles.galleryItem}>
                <img src="/picpay/Audiência.JPG" alt="Audiência com 100% de atenção" />
              </div>
              <div className={styles.galleryItem}>
                <img src="/picpay/Crescimento Pix.JPG" alt="Semana do Consumidor - Crescimento de pagamentos" />
              </div>
              <div className={styles.galleryItem}>
                <img src="/picpay/Crescimento Transações.JPG" alt="Semana do Consumidor - Transações" />
              </div>
            </div>
          </section>
        </div>

        <div className={styles.rightCol}>
          <div className={styles.sideWidget}>
            <h3 className={styles.widgetTitle}>Alcance e Segmentação</h3>
            <div className={styles.statRow}>
              <span className={styles.statLabel}>Ecossistema</span>
              <span className={styles.statValue}>Financeiro e Retail</span>
            </div>
            <div className={styles.statRow}>
              <span className={styles.statLabel}>Atenção do Usuário</span>
              <span className={styles.statValue}>100% Retida</span>
            </div>
            <div className={styles.statRow}>
              <span className={styles.statLabel}>Formatos</span>
              <span className={styles.statValue}>In-app, Push, Cashback</span>
            </div>
            <div className={styles.statRow}>
              <span className={styles.statLabel}>Modelos</span>
              <span className={styles.statValue}>CPM, CPA, Custom</span>
            </div>
          </div>

          <div className={styles.sideWidget}>
            <h3 className={styles.widgetTitle}>Formatos Disponíveis</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              <span className={styles.categoryBadge} style={{ margin: 0, background: '#f1f5f9', color: '#334155' }}>Display Ads</span>
              <span className={styles.categoryBadge} style={{ margin: 0, background: '#f1f5f9', color: '#334155' }}>Push Notifications</span>
              <span className={styles.categoryBadge} style={{ margin: 0, background: '#f1f5f9', color: '#334155' }}>Cashback Offers</span>
              <span className={styles.categoryBadge} style={{ margin: 0, background: '#f1f5f9', color: '#334155' }}>Gamification</span>
              <span className={styles.categoryBadge} style={{ margin: 0, background: '#f1f5f9', color: '#334155' }}>CRM Actions</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
