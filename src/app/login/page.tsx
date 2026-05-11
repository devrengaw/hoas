'use client';

import React, { useState, useEffect } from 'react';
import styles from "./page.module.css";
import { useRouter } from "next/navigation";
import { Sparkles, ArrowRight, Mail, Lock } from "lucide-react";
import LoadingScreen from '@/components/LoadingScreen';
import LoginDynamicBackground from '@/components/LoginDynamicBackground';
import { supabase } from '@/lib/supabase';

export default function Home() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pendingPath, setPendingPath] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        setError("E-mail ou senha incorretos. Por favor, verifique seus dados.");
        return;
      }

      // If successful, determine path and THEN start loading animation
      let path = '/dashboard';
      const lowerEmail = email.toLowerCase();
      
      if (lowerEmail === 'contato@rengawdev.com') {
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
    } catch (err) {
      console.error(err);
      setError("Ocorreu um erro ao processar o login.");
    }
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
        <div className={styles.actions + " animate-fade-in"}>
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
            
            {error && <div className={styles.errorMessage + " animate-shake"}>{error}</div>}

            <button type="submit" className={styles.primaryButton}>
              Entrar na Plataforma <ArrowRight size={18} />
            </button>
          </form>

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
