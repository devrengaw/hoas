'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Mail, ArrowLeft, Sparkles, CheckCircle2 } from 'lucide-react';
import styles from './page.module.css';
import { supabase } from '@/lib/supabase';
import PlexusBackground from '@/components/PlexusBackground';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleResetRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (resetError) {
        throw resetError;
      }

      setSuccess(true);
    } catch (err: any) {
      console.error('Password reset request error:', err);
      setError(err.message || 'Ocorreu um erro ao enviar o e-mail de recuperação.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className={styles.main}>
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

        <div className={styles.card + " animate-fade-in"}>
          {!success ? (
            <form className={styles.form} onSubmit={handleResetRequest}>
              <div className={styles.badge}>
                <Sparkles size={12} />
                <span>Recuperação de Acesso</span>
              </div>
              
              <h1 className={styles.title}>Esqueceu sua senha?</h1>
              <p className={styles.subtitle}>
                Digite seu e-mail corporativo cadastrado para receber instruções de redefinição de senha.
              </p>

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

              {error && <div className={styles.errorMessage}>{error}</div>}

              <button type="submit" className={styles.primaryButton} disabled={loading}>
                {loading ? 'Enviando...' : 'Enviar Link de Recuperação'}
              </button>

              <Link href="/login" className={styles.backToLogin}>
                <ArrowLeft size={16} /> Voltar para o Login
              </Link>
            </form>
          ) : (
            <div className={styles.successState}>
              <CheckCircle2 size={64} className={styles.successIcon} />
              <h1 className={styles.title}>E-mail enviado!</h1>
              <p className={styles.subtitle}>
                Enviamos um link de redefinição de senha para <strong>{email}</strong>. Verifique sua caixa de entrada e spam.
              </p>
              
              <Link href="/login" className={styles.primaryButton} style={{ textDecoration: 'none' }}>
                Ir para o Login
              </Link>
            </div>
          )}
        </div>
      </div>

      <div className={styles.backgroundGlow} />
    </main>
  );
}
