'use client';

import React from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { 
  ChevronLeft, MessageSquare, Target, Smartphone, Gift, 
  CreditCard, TrendingUp, Info, BarChart, ImageIcon, 
  MapPin, Globe, Award, Zap, Building2, Star, CheckCircle2
} from 'lucide-react';
import styles from '../picpay-ads/page.module.css'; // Reusing the same standard style
import { mockVehicles, mockOrganizations } from '@/lib/mockData';

export default function DynamicProfilePage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  // Try to find in vehicles or organizations
  const vehicle = mockVehicles.find(v => v.name.toLowerCase().replace(/ /g, '-') === slug);
  const agency = mockOrganizations.find(o => o.name.toLowerCase().replace(/ /g, '-') === slug);

  const data = vehicle || agency || {
    name: slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
    type: 'Parceiro HOAS',
    category: 'Marketplace',
    reach: 'Audiência Qualificada'
  };

  const isVehicle = !!vehicle;

  return (
    <div className={styles.container}>
      <div style={{ marginBottom: '1.5rem' }}>
        <button 
          onClick={() => router.back()} 
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.5rem', 
            color: 'var(--muted)', 
            background: 'none', 
            border: 'none', 
            cursor: 'pointer',
            fontSize: '0.9rem',
            fontWeight: 600
          }}
        >
          <ChevronLeft size={18} /> Voltar
        </button>
      </div>

      <div className={styles.cover} style={{ background: isVehicle ? 'linear-gradient(135deg, #6366f1, #a855f7)' : 'linear-gradient(135deg, #11C76F, #0fa35a)' }}>
        <h1 style={{ color: 'white', opacity: 0.1, fontSize: '5rem', fontWeight: 900, textTransform: 'uppercase' }}>{data.name}</h1>
      </div>

      <div className={styles.headerContent}>
        <div className={styles.logoWrapper}>
          <div style={{ background: isVehicle ? 'rgba(99, 102, 241, 0.1)' : 'rgba(17, 199, 111, 0.1)', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: isVehicle ? '#6366f1' : '#11C76F', fontWeight: '900', fontSize: '2.5rem', borderRadius: '22px' }}>
            {data.name[0]}
          </div>
        </div>

        <div className={styles.headerInfo}>
          <div className={styles.categoryBadge} style={{ background: isVehicle ? '#6366f1' : '#11C76F' }}>
            {isVehicle ? (data as any).type : 'Agency Partner'}
          </div>
          <h1>{data.name}</h1>
          <p style={{ color: 'var(--muted)', fontSize: '1.1rem' }}>{isVehicle ? (data as any).category : 'Especialista em Performance e Branding'}</p>
        </div>

        <div className={styles.headerActions}>
          <button className={styles.contactBtn} style={{ background: isVehicle ? '#6366f1' : '#11C76F' }}>
            <MessageSquare size={18} />
            {isVehicle ? 'Solicitar Cotação' : 'Entrar em Contato'}
          </button>
        </div>
      </div>

      <div className={styles.mainGrid}>
        <div className={styles.leftCol}>
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>
              <Info size={20} color={isVehicle ? '#6366f1' : '#11C76F'} /> Sobre a Operação
            </h2>
            <div className={styles.bio}>
              <p>{isVehicle ? 'Líder em audiência em sua categoria' : 'Agência com foco em resultados escaláveis'}, o parceiro {data.name} entrega soluções de alto impacto para o ecossistema HOAS.</p>
              <p>Com foco em inovação e dados, as ativações são planejadas para garantir o máximo retorno sobre o investimento, utilizando segmentações precisas e formatos proprietários de alta conversão.</p>
            </div>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>
              <Target size={20} color={isVehicle ? '#6366f1' : '#11C76F'} /> Diferenciais & Possibilidades
            </h2>
            <div className={styles.featuresList}>
              <div className={styles.featureItem}>
                <div className={styles.featureIcon} style={{ color: isVehicle ? '#6366f1' : '#11C76F', background: isVehicle ? 'rgba(99, 102, 241, 0.1)' : 'rgba(17, 199, 111, 0.1)' }}><BarChart size={20} /></div>
                <div className={styles.featureText}>Segmentação qualificada baseada em comportamento real de consumo.</div>
              </div>
              <div className={styles.featureItem}>
                <div className={styles.featureIcon} style={{ color: isVehicle ? '#6366f1' : '#11C76F', background: isVehicle ? 'rgba(99, 102, 241, 0.1)' : 'rgba(17, 199, 111, 0.1)' }}><Smartphone size={20} /></div>
                <div className={styles.featureText}>Alta taxa de atenção e engajamento em ambientes proprietários.</div>
              </div>
              <div className={styles.featureItem}>
                <div className={styles.featureIcon} style={{ color: isVehicle ? '#6366f1' : '#11C76F', background: isVehicle ? 'rgba(99, 102, 241, 0.1)' : 'rgba(17, 199, 111, 0.1)' }}><Zap size={20} /></div>
                <div className={styles.featureText}>Integração nativa com o ecossistema HOAS para acompanhamento em tempo real.</div>
              </div>
            </div>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>
              <ImageIcon size={20} color={isVehicle ? '#6366f1' : '#11C76F'} /> Galeria de Cases e Audiência
            </h2>
            <div className={styles.galleryGrid}>
              <div className={styles.galleryItem} style={{ background: 'rgba(255,255,255,0.02)', border: '1px dashed var(--glass-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', height: '200px', borderRadius: '16px' }}>
                <span style={{ color: 'var(--muted)', fontSize: '0.8rem' }}>Case de Sucesso Q1</span>
              </div>
              <div className={styles.galleryItem} style={{ background: 'rgba(255,255,255,0.02)', border: '1px dashed var(--glass-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', height: '200px', borderRadius: '16px' }}>
                <span style={{ color: 'var(--muted)', fontSize: '0.8rem' }}>Métricas de Alcance 2026</span>
              </div>
            </div>
          </section>
        </div>

        <div className={styles.rightCol}>
          <div className={styles.sideWidget}>
            <h3 className={styles.widgetTitle}>Alcance e Dados</h3>
            <div className={styles.statRow}>
              <span className={styles.statLabel}>{isVehicle ? 'Alcance Mensal' : 'Clientes Ativos'}</span>
              <span className={styles.statValue}>{isVehicle ? (data as any).reach : '12+'}</span>
            </div>
            <div className={styles.statRow}>
              <span className={styles.statLabel}>Match HOAS</span>
              <span className={styles.statValue}>94%</span>
            </div>
            <div className={styles.statRow}>
              <span className={styles.statLabel}>Abrangência</span>
              <span className={styles.statValue}>Nacional</span>
            </div>
            <div className={styles.statRow}>
              <span className={styles.statLabel}>Modelos</span>
              <span className={styles.statValue}>CPM, CPA, Custom</span>
            </div>
          </div>

          <div className={styles.sideWidget}>
            <h3 className={styles.widgetTitle}>Documentação Técnica</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1.5rem' }}>
              {['Media Kit', 'Tabela de Preços', 'Formatos', 'Cases'].map(f => (
                <span key={f} className={styles.categoryBadge} style={{ margin: 0, background: 'rgba(255,255,255,0.05)', color: 'var(--muted)' }}>{f}</span>
              ))}
            </div>
            <button style={{ width: '100%', background: 'white', color: 'black', border: 'none', padding: '0.8rem', borderRadius: '10px', fontWeight: '800', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', cursor: 'pointer' }}>
              <Award size={18} /> Baixar Apresentação (PDF)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
