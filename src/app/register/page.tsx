'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Building2, Users, Briefcase, ChevronRight, ChevronLeft, 
  Check, Sparkles, ShieldCheck, Image as ImageIcon 
} from 'lucide-react';
import styles from './page.module.css';

import PlexusBackground from '@/components/PlexusBackground';

type Role = 'vehicle' | 'agency' | 'client' | null;

export default function RegisterPage() {
  const [role, setRole] = useState<Role>(null);
  const [step, setStep] = useState(1);
  const router = useRouter();

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate successful registration
    if (role === 'agency') {
      router.push('/dashboard/agency');
    } else if (role === 'client') {
      router.push('/dashboard/client');
    } else {
      router.push('/dashboard');
    }
  };

  return (
    <main className={styles.container}>
      <PlexusBackground />
      <div className={styles.animatedBg}>
        <div className={styles.blob}></div>
        <div className={styles.blob}></div>
        <div className={styles.blob}></div>
        <div className={styles.blob}></div>
        <div className={styles.blob}></div>
      </div>

      <div className={styles.hero}>
        <div className={styles.logoWrapper}>
          <img src="/identidade visual/hoas_png.png" alt="HOAS Logo" className={styles.mainLogo} />
        </div>
        
        <div className={styles.card}>
          {step === 1 ? (
            <div className={styles.roleSelection}>
              <h1>Bem-vindo</h1>
              <p>Selecione o seu perfil para personalizarmos sua experiência no ecossistema.</p>
              
              <div className={styles.roleGrid}>
                <button 
                  className={`${styles.roleCard} ${role === 'vehicle' ? styles.selected : ''}`}
                  onClick={() => setRole('vehicle')}
                >
                  <div className={styles.roleIcon}><Building2 size={32} /></div>
                  <h3>Sou Veículo / Mídia</h3>
                  <p>Para canais de TV, Rádios, Portais e empresas de OOH.</p>
                </button>

                <button 
                  className={`${styles.roleCard} ${role === 'agency' ? styles.selected : ''}`}
                  onClick={() => setRole('agency')}
                >
                  <div className={styles.roleIcon}><Users size={32} /></div>
                  <h3>Sou Agência</h3>
                  <p>Para profissionais de Mídia, Planejamento e Estratégia.</p>
                </button>

                <button 
                  className={`${styles.roleCard} ${role === 'client' ? styles.selected : ''}`}
                  onClick={() => setRole('client')}
                >
                  <div className={styles.roleIcon}><Briefcase size={32} /></div>
                  <h3>Sou Anunciante / Cliente</h3>
                  <p>Marcas que buscam gerenciar seus investimentos e resultados.</p>
                </button>
              </div>

              <button 
                className={styles.nextBtn} 
                disabled={!role}
                onClick={() => setStep(2)}
              >
                Continuar para o Cadastro <ChevronRight size={20} />
              </button>
            </div>
          ) : (
            <form className={styles.form} onSubmit={handleRegister}>
              <header className={styles.formHeader}>
                <button type="button" className={styles.backBtn} onClick={() => setStep(1)}>
                  <ChevronLeft size={18} /> Voltar
                </button>
                <h2>Cadastro de {role === 'vehicle' ? 'Veículo' : role === 'agency' ? 'Agência' : 'Cliente'}</h2>
              </header>

              <div className={styles.logoUploadSection}>
                <div className={styles.logoPreview}>
                  <Building2 size={32} />
                </div>
                <div className={styles.uploadInfo}>
                  <label>Logo da Empresa</label>
                  <input type="file" accept="image/*" className={styles.fileInput} id="logo-upload" />
                  <label htmlFor="logo-upload" className={styles.uploadBtn}>
                    <ImageIcon size={16} /> Selecionar Logo
                  </label>
                  <p>JPG, PNG ou SVG. Máx 2MB.</p>
                </div>
              </div>

              <div className={styles.formGrid}>
                <div className={styles.field}>
                  <label>Nome Completo</label>
                  <input type="text" placeholder="Seu nome" required />
                </div>
                <div className={styles.field}>
                  <label>E-mail Corporativo</label>
                  <input type="email" placeholder="nome@empresa.com.br" required />
                </div>
                
                <div className={styles.field}>
                  <label>Empresa / {role === 'agency' ? 'Agência' : 'Veículo'}</label>
                  <input type="text" placeholder="Nome da empresa" required />
                </div>
                
                <div className={styles.field}>
                  <label>CNPJ</label>
                  <input type="text" placeholder="00.000.000/0000-00" required />
                </div>

                {role === 'vehicle' && (
                  <div className={styles.field}>
                    <label>Tipo de Mídia Principal</label>
                    <select>
                      <option>TV / Vídeo</option>
                      <option>Digital</option>
                      <option>OOH</option>
                      <option>Audio / Rádio</option>
                    </select>
                  </div>
                )}

                {role === 'agency' && (
                  <div className={styles.field}>
                    <label>Cargo / Função</label>
                    <select>
                      <option>Diretor de Mídia</option>
                      <option>Gerente de Mídia</option>
                      <option>Planejamento</option>
                      <option>Comprador</option>
                    </select>
                  </div>
                )}

                {role === 'client' && (
                  <div className={styles.field}>
                    <label>Principal Objetivo</label>
                    <select>
                      <option>Brand Awareness</option>
                      <option>Performance / Vendas</option>
                      <option>Lançamento de Produto</option>
                      <option>Gestão de Verba Anual</option>
                    </select>
                  </div>
                )}

                <div className={styles.field}>
                  <label>Sua Senha</label>
                  <input type="password" placeholder="••••••••" required />
                </div>
                <div className={styles.field}>
                  <label>Confirme sua Senha</label>
                  <input type="password" placeholder="••••••••" required />
                </div>
              </div>

              <div className={styles.terms}>
                <div className={styles.ndaBadge}>
                  <ShieldCheck size={16} />
                  <span>NDA Obrigatório para acesso</span>
                </div>
                <label className={styles.checkbox}>
                  <input type="checkbox" required />
                  <span>Aceito os Termos de Uso e Política de Privacidade do HOAS.</span>
                </label>
              </div>

              <button type="submit" className={styles.submitBtn}>
                <Sparkles size={18} /> Criar Minha Conta e Acessar
              </button>
            </form>
          )}
        </div>

        <p className={styles.footer}>
          Já tem uma conta? <Link href="/">Fazer login na plataforma</Link>
        </p>
      </div>
      
      <div className={styles.backgroundGlow} />
    </main>
  );
}
