'use client';

import styles from "./page.module.css";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  const handleLogin = () => {
    // Simulating auth flow
    router.push('/dashboard');
  };

  return (
    <main className={styles.main}>
      <div className={styles.hero}>
        <h1 className="animate-fade-in">HOAS</h1>
        <p className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
          Hub of Advertising Sales
        </p>
        
        <div className={styles.actions + " animate-fade-in"} style={{ animationDelay: '0.4s' }}>
          <button 
            className={styles.primaryButton}
            onClick={handleLogin}
          >
            Entrar com Email Corporativo
          </button>
          <div className={styles.divider}>ou</div>
          <div className={styles.socialAuth}>
            <button className={styles.socialButton} onClick={handleLogin}>Google</button>
            <button className={styles.socialButton} onClick={handleLogin}>Microsoft 365</button>
          </div>
        </div>
      </div>
      
      <div className={styles.backgroundGlow} />
    </main>
  );
}
