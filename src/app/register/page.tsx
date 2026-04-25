'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Building2, Users, Briefcase, ChevronRight, ChevronLeft, Check, Sparkles, ShieldCheck } from 'lucide-react';
import styles from './page.module.css';

type Role = 'vehicle' | 'agency' | 'client' | null;

export default function RegisterPage() {
  const [role, setRole] = useState<Role>(null);
  const [step, setStep] = useState(1);
  const router = useRouter();

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate successful registration
    router.push(role === 'agency' ? '/dashboard/agency' : '/dashboard');
  };

  return (
    <main className={styles.container}>
      <div className={styles.logo}>HOAS</div>
      
      <div className={styles.card}>
        {step === 1 ? (
          <div className={styles.roleSelection}>
            <h1>Bem-vindo ao HOAS</h1>
            <p>Selecione o seu perfil para personalizarmos sua experiência.</p>
            
            <div className={styles.roleGrid}>
              <button 
                className={`${styles.roleCard} ${role === 'vehicle' ? styles.selected : ''}`}
                onClick={() => setRole('vehicle')}
              >
                <div className={styles.roleIcon}><Building2 size={32} /></div>
                <h3>Veículo</h3>
                <p>Sou um executivo ou diretor comercial de um veículo de mídia.</p>
              </button>

              <button 
                className={`${styles.roleCard} ${role === 'agency' ? styles.selected : ''}`}
                onClick={() => setRole('agency')}
              >
                <div className={styles.roleIcon}><Users size={32} /></div>
                <h3>Agência</h3>
                <p>Sou profissional de mídia, planejamento ou compras.</p>
              </button>

              <button 
                className={`${styles.roleCard} ${role === 'client' ? styles.selected : ''}`}
                onClick={() => setRole('client')}
              >
                <div className={styles.roleIcon}><Briefcase size={32} /></div>
                <h3>Cliente</h3>
                <p>Sou o anunciante e quero acompanhar minhas campanhas.</p>
              </button>
            </div>

            <button 
              className={styles.nextBtn} 
              disabled={!role}
              onClick={() => setStep(2)}
            >
              Continuar <ChevronRight size={18} />
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

              <div className={styles.field}>
                <label>Sua Senha</label>
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
              <Sparkles size={18} /> Criar Minha Conta
            </button>
          </form>
        )}
      </div>

      <p className={styles.footer}>
        Já tem uma conta? <Link href="/">Fazer login</Link>
      </p>
    </main>
  );
}
