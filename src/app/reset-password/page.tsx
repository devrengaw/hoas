'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Lock, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';
import styles from './page.module.css';
import { supabase } from '@/lib/supabase';
import PlexusBackground from '@/components/PlexusBackground';

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Check if we have an active session or a recovery token.
    // Supabase will automatically handle the URL hash and authenticate the session on load.
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        // We can show a small warning but let them try to update anyway since Supabase handles recovery flows gracefully
        console.warn('No active recovery session detected. If you clicked a link, it might have expired.');
      }
    };
    checkSession();
  }, []);

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (password !== confirmPassword) {
      setError('As senhas não coincidem.');
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('A senha deve conter no mínimo 6 caracteres.');
      setLoading(false);
      return;
    }

    try {
      const { error: updateError } = await supabase.auth.updateUser({
        password: password,
      });

      if (updateError) {
        throw updateError;
      }

      setSuccess(true);
    } catch (err: any) {
      console.error('Password reset error:', err);
      setError(err.message || 'Ocorreu um erro ao redefinir sua senha.');
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
            <form className={styles.form} onSubmit={handlePasswordReset}>
              <div className={styles.badge}>
                <Sparkles size={12} />
                <span>Nova Senha</span>
              </div>
              
              <h1 className={styles.title}>Redefinir Senha</h1>
              <p className={styles.subtitle}>
                Digite sua nova senha abaixo para reestabelecer o acesso à sua conta.
              </p>

              <div className={styles.field}>
                <label>Nova Senha</label>
                <div className={styles.inputWrapper}>
                  <Lock size={18} />
                  <input
                    type="password"
                    placeholder="Mínimo 6 caracteres"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className={styles.field}>
                <label>Confirmar Nova Senha</label>
                <div className={styles.inputWrapper}>
                  <Lock size={18} />
                  <input
                    type="password"
                    placeholder="Repita a nova senha"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              {error && <div className={styles.errorMessage}>{error}</div>}

              <button type="submit" className={styles.primaryButton} disabled={loading}>
                {loading ? 'Redefinindo...' : 'Atualizar Senha'}
              </button>
            </form>
          ) : (
            <div className={styles.successState}>
              <CheckCircle2 size={64} className={styles.successIcon} />
              <h1 className={styles.title}>Senha atualizada!</h1>
              <p className={styles.subtitle}>
                Sua senha foi redefinida com sucesso. Você já pode acessar a plataforma utilizando suas novas credenciais.
              </p>
              
              <Link href="/login" className={styles.primaryButton} style={{ textDecoration: 'none', width: '100%' }}>
                Ir para o Login <ArrowRight size={18} />
              </Link>
            </div>
          )}
        </div>
      </div>

      <div className={styles.backgroundGlow} />
    </main>
  );
}
