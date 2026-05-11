'use client';

import React, { useState, useEffect } from 'react';
import styles from "./page.module.css";
import { useRouter } from "next/navigation";
import { Sparkles, ArrowRight, Mail, Lock } from "lucide-react";
import LoadingScreen from '@/components/LoadingScreen';
import LoginDynamicBackground from '@/components/LoginDynamicBackground';

export default function Home() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [pendingPath, setPendingPath] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simulate role identification based on email
    const lowerEmail = email.toLowerCase();
    let path = '/dashboard';
    
    // Admin check with specific password
    if (lowerEmail === 'contato@rengawdev.com' && password === 'Santos1992*') {
      path = '/dashboard/platform-admin';
    } else if (lowerEmail.includes('admin')) {
      path = '/dashboard/platform-admin';
    } else if (lowerEmail.includes('agency') || lowerEmail.includes('agencia') || lowerEmail.includes('midia')) {
      path = '/dashboard/agency';
    } else if (lowerEmail.includes('client') || lowerEmail.includes('cliente') || lowerEmail.includes('anunciante')) {
      path = '/dashboard/client';
    }
    
    setPendingPath(path);
    setIsLoading(true);
  };

  const handleLoadingFinished = () => {
    router.push(pendingPath);
  };

  if (isLoading) {
    return <LoadingScreen onFinished={handleLoadingFinished} />;
  }

  return (
    <main className={styles.main}>
      <LoginDynamicBackground />

      <div className={styles.hero}>
        <div className={styles.badge + " animate-bounce-subtle"}>
          <Sparkles size={14} />
          <span>Inteligência de Mercado B2B</span>
        </div>
        <div className={styles.logoWrapper + " animate-fade-in"}>
          <img src="/identidade visual/hoas_png.png" alt="HOAS Logo" className={styles.mainLogo} />
        </div>
        
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
            <button className={styles.socialButton} onClick={() => { setPendingPath('/dashboard'); setIsLoading(true); }}>
              <img src="https://www.google.com/favicon.ico" alt="Google" width={16} /> Google Workspace
            </button>
            <button className={styles.socialButton} onClick={() => { setPendingPath('/dashboard'); setIsLoading(true); }}>
              <img src="https://www.microsoft.com/favicon.ico" alt="MS" width={16} /> Microsoft 365
            </button>
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
