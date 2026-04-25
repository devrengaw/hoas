'use client';

import React, { useState } from 'react';
import styles from "./page.module.css";
import { useRouter } from "next/navigation";
import { Sparkles, ArrowRight, Mail, Lock } from "lucide-react";

export default function Home() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simulate role identification based on email
    const lowerEmail = email.toLowerCase();
    
    if (lowerEmail.includes('agency') || lowerEmail.includes('midia')) {
      router.push('/dashboard/agency');
    } else if (lowerEmail.includes('client') || lowerEmail.includes('anunciante')) {
      router.push('/dashboard/client');
    } else {
      router.push('/dashboard'); // Default to Vehicle for others
    }
  };

  return (
    <main className={styles.main}>
      <div className={styles.hero}>
        <div className={styles.badge}>
          <Sparkles size={14} />
          <span>Inteligência de Mercado B2B</span>
        </div>
        <h1 className="animate-fade-in">HOAS</h1>
        <p className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
          Hub of Advertising Sales
        </p>
        
        <div className={styles.actions + " animate-fade-in"} style={{ animationDelay: '0.4s' }}>
          <form className={styles.loginForm} onSubmit={handleLogin}>
            <div className={styles.field}>
              <label>E-mail Corporativo</label>
              <div className={styles.inputWrapper}>
                <Mail size={18} />
                <input 
                  type="email" 
                  placeholder="seu@email.com.br" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required 
                />
              </div>
            </div>

            <div className={styles.field}>
              <label>Senha</label>
              <div className={styles.inputWrapper}>
                <Lock size={18} />
                <input 
                  type="password" 
                  placeholder="••••••••" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required 
                />
              </div>
            </div>
            
            <button type="submit" className={styles.primaryButton}>
              Entrar na Plataforma <ArrowRight size={18} />
            </button>
          </form>

          <div className={styles.divider}>ou acesse via SSO</div>
          
          <div className={styles.socialAuth}>
            <button className={styles.socialButton} onClick={() => router.push('/dashboard')}>Google Workspace</button>
            <button className={styles.socialButton} onClick={() => router.push('/dashboard')}>Microsoft 365</button>
          </div>

          <div className={styles.registerLink}>
            <span>Ainda não tem conta?</span>
            <button className={styles.linkButton} onClick={() => router.push('/register')}>
              Registrar-se agora
            </button>
          </div>
        </div>
      </div>
      
      <div className={styles.backgroundGlow} />
    </main>
  );
}
