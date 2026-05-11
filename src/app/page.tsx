'use client';

import React from 'react';
import Link from 'next/link';
import { 
  ArrowRight, Sparkles, Zap, Users, ShieldCheck, 
  Target, BarChart3, Globe, MessageSquare, Play,
  CheckCircle2, TrendingUp, Radio, Tv, Layout
} from 'lucide-react';
import PlexusBackground from '@/components/PlexusBackground';
import styles from './page.module.css';

export default function VehicleLandingPage() {
  return (
    <div className={styles.container}>
      <PlexusBackground />
      
      {/* Navigation */}
      <nav className={styles.navbar}>
        <div className={styles.navLogo}>
          <img src="/identidade visual/hoas_png.png" alt="HOAS Logo" />
        </div>
        <div className={styles.navLinks}>
          <Link href="/login">Entrar</Link>
          <Link href="/register" className={styles.navCta}>Começar agora</Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.badge}>
          <Sparkles size={14} />
          <span>O HUB definitivo entre quem Planeja e quem Entrega</span>
        </div>
        <h1 className={styles.title}>
          Conectando o talento dos <span>Mídias</span> <br /> 
          à potência dos <span>Veículos.</span>
        </h1>
        <p className={styles.subtitle}>
          O HOAS é o ecossistema de gestão que organiza a jornada completa entre 
          Agências e Veículos. Uma plataforma centralizada para mídias que buscam 
          precisão e veículos que buscam escala e organização.
        </p>
        <div className={styles.ctaGroup}>
          <Link href="/register" className={styles.primaryCta}>
            Começar minha Gestão <ArrowRight size={20} />
          </Link>
          <button className={styles.secondaryCta}>
            Conhecer o HUB
          </button>
        </div>
        
        <div className={styles.heroVisual}>
          <div className={styles.floatingCard + " " + styles.c1}>
            <TrendingUp size={20} color="#10b981" />
            <div>
              <span>Alcance Médio</span>
              <strong>+45% YoY</strong>
            </div>
          </div>
          <div className={styles.floatingCard + " " + styles.c2}>
            <Target size={20} color="#6366f1" />
            <div>
              <span>Match de IA</span>
              <strong>98% Precisão</strong>
            </div>
          </div>
        </div>
      </section>

      {/* Pain Points Section */}
      <section className={styles.painPoints}>
        <div className={styles.sectionHeader}>
          <h2>Gestão inteligente para quem decide</h2>
          <p>Eliminamos o caos operacional para que você foque na estratégia.</p>
        </div>
        
        <div className={styles.grid}>
          <div className={styles.painCard}>
            <div className={styles.painIcon}><Layout size={24} /></div>
            <h3>Organização é Poder</h3>
            <p>Centralize todos os seus contatos, briefings e propostas em um só lugar. Chega de buscar informações em e-mails e planilhas espalhadas.</p>
          </div>
          <div className={styles.painCard}>
            <div className={styles.painIcon}><Users size={24} /></div>
            <h3>O HUB do Ecossistema</h3>
            <p>O ponto de encontro direto entre o Mídia de agência que busca a melhor entrega e o Veículo que tem a solução ideal.</p>
          </div>
          <div className={styles.painCard}>
            <div className={styles.painIcon}><BarChart3 size={24} /></div>
            <h3>Dados que Geram Negócio</h3>
            <p>Acompanhe em tempo real a aceitação das propostas e o desempenho de cada negociação com métricas precisas e centralizadas.</p>
          </div>
        </div>
      </section>

      {/* Features / Solutions */}
      <section className={styles.solutions}>
        <div className={styles.solContent}>
          <div className={styles.solBadge}>Controle e Performance</div>
          <h2>O suporte que seu <span>planejamento</span> merece.</h2>
          
          <ul className={styles.solList}>
            <li>
              <div className={styles.check}><CheckCircle2 size={20} /></div>
              <div>
                <strong>Dashboard Unificado de Negociação</strong>
                <p>Mídias e Veículos visualizam a mesma jornada, garantindo transparência e agilidade no fechamento.</p>
              </div>
            </li>
            <li>
              <div className={styles.check}><CheckCircle2 size={20} /></div>
              <div>
                <strong>HUB de Briefings e Oportunidades</strong>
                <p>O Mídia publica a necessidade e os veículos qualificados respondem em tempo recorde.</p>
              </div>
            </li>
            <li>
              <div className={styles.check}><CheckCircle2 size={20} /></div>
              <div>
                <strong>Gestão de Ativos Digitais</strong>
                <p>Toda a documentação, mídia kits e peças técnicas organizadas e acessíveis em um clique.</p>
              </div>
            </li>
          </ul>

          <Link href="/register" className={styles.solCta}>
            Transformar minha Gestão <ArrowRight size={18} />
          </Link>
        </div>
        
        <div className={styles.solVisual}>
          <div className={styles.solCircle}>
            <div className={styles.innerIcon}><Users size={40} /></div>
            <div className={styles.orbitIcon + " " + styles.o1}><Zap size={24} /></div>
            <div className={styles.orbitIcon + " " + styles.o2}><Radio size={24} /></div>
            <div className={styles.orbitIcon + " " + styles.o3}><Layout size={24} /></div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className={styles.finalCta}>
        <div className={styles.ctaCard}>
          <div className={styles.glowEffect}></div>
          <h2>Eleve sua mídia ao próximo nível.</h2>
          <p>Seja parte do ecossistema que está redefinindo as conexões entre veículos, agências e marcas.</p>
          <div className={styles.ctaButtons}>
            <Link href="/register" className={styles.primaryCta}>Começar agora</Link>
            <Link href="/login" className={styles.secondaryCta}>Portal do Membro</Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <img src="/identidade visual/hoas_png.png" alt="HOAS" />
          <p>© 2026 HOAS. Transformando o ecossistema de mídia.</p>
          <div className={styles.footerLinks}>
            <Link href="/login">Área Administrativa</Link>
            <a href="#">Termos</a>
            <a href="#">Privacidade</a>
            <a href="#">Contato</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
