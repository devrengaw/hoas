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
          <span>O Futuro da Conexão entre Veículos e Agências</span>
        </div>
        <h1 className={styles.title}>
          Sua mídia no centro <br /> 
          <span>das grandes decisões.</span>
        </h1>
        <p className={styles.subtitle}>
          O HOAS é o ecossistema inteligente onde veículos de alta performance 
          se conectam diretamente com agências e marcas. Chega de processos manuais. 
          É hora de escala, dados e conexões reais.
        </p>
        <div className={styles.ctaGroup}>
          <Link href="/register" className={styles.primaryCta}>
            Cadastrar meu Veículo <ArrowRight size={20} />
          </Link>
          <button className={styles.secondaryCta}>
            <Play size={18} fill="currentColor" /> Ver como funciona
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
          <img src="/dashboard-preview.png" alt="Dashboard Preview" className={styles.dashboardMock} />
        </div>
      </section>

      {/* Pain Points Section */}
      <section className={styles.painPoints}>
        <div className={styles.sectionHeader}>
          <h2>Entendemos seus desafios</h2>
          <p>O mercado mudou, e a forma de vender mídia também precisa mudar.</p>
        </div>
        
        <div className={styles.grid}>
          <div className={styles.painCard}>
            <div className={styles.painIcon}><Radio size={24} /></div>
            <h3>O Media Kit se perdeu?</h3>
            <p>Pare de enviar PDFs pesados que ninguém abre. Tenha um perfil interativo de alta fidelidade que impressiona no primeiro clique.</p>
          </div>
          <div className={styles.painCard}>
            <div className={styles.painIcon}><MessageSquare size={24} /></div>
            <h3>Muitos intermediários?</h3>
            <p>Conecte-se diretamente com quem decide. Nossa plataforma reduz o ruído e foca no que importa: o fechamento do negócio.</p>
          </div>
          <div className={styles.painCard}>
            <div className={styles.painIcon}><BarChart3 size={24} /></div>
            <h3>Falta de Feedback?</h3>
            <p>Saiba exatamente como sua mídia está performando no marketplace e receba insights reais sobre a aceitação das suas propostas.</p>
          </div>
        </div>
      </section>

      {/* Features / Solutions */}
      <section className={styles.solutions}>
        <div className={styles.solContent}>
          <div className={styles.solBadge}>Soluções sob medida</div>
          <h2>Tudo o que você precisa para <br /><span>vender mais e melhor.</span></h2>
          
          <ul className={styles.solList}>
            <li>
              <div className={styles.check}><CheckCircle2 size={20} /></div>
              <div>
                <strong>Showcase Digital Premium</strong>
                <p>Apresentação estilo PicPay Ads para seus ativos de mídia, com galeria e dados dinâmicos.</p>
              </div>
            </li>
            <li>
              <div className={styles.check}><CheckCircle2 size={20} /></div>
              <div>
                <strong>AI Matchmaking</strong>
                <p>Nosso algoritmo cruza os briefings das agências com o seu inventário, gerando leads qualificados.</p>
              </div>
            </li>
            <li>
              <div className={styles.check}><CheckCircle2 size={20} /></div>
              <div>
                <strong>Gestão de Pipeline</strong>
                <p>Controle total sobre propostas, reuniões e contratos em um único dashboard intuitivo.</p>
              </div>
            </li>
          </ul>

          <Link href="/register" className={styles.solCta}>
            Explorar todas as funcionalidades <ArrowRight size={18} />
          </Link>
        </div>
        
        <div className={styles.solVisual}>
          <div className={styles.solCircle}>
            <div className={styles.innerIcon}><Tv size={40} /></div>
            <div className={styles.orbitIcon + " " + styles.o1}><Zap size={24} /></div>
            <div className={styles.orbitIcon + " " + styles.o2}><Users size={24} /></div>
            <div className={styles.orbitIcon + " " + styles.o3}><Layout size={24} /></div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className={styles.finalCta}>
        <div className={styles.ctaCard}>
          <h2>Pronto para elevar o nível da sua mídia?</h2>
          <p>Junte-se a centenas de veículos que já estão transformando sua operação comercial com o HOAS.</p>
          <div className={styles.ctaButtons}>
            <Link href="/register" className={styles.primaryCta}>Criar conta grátis</Link>
            <Link href="/login" className={styles.secondaryCta}>Já sou membro</Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <img src="/identidade visual/hoas_png.png" alt="HOAS" />
          <p>© 2026 HOAS. Transformando o ecossistema de mídia.</p>
          <div className={styles.footerLinks}>
            <a href="#">Termos</a>
            <a href="#">Privacidade</a>
            <a href="#">Contato</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
