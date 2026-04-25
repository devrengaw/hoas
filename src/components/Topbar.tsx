'use client';

import { Bell, Search, Zap, UserCircle } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './Topbar.module.css';

export default function Topbar() {
  const pathname = usePathname();

  // Determine current role based on path for UI display
  const isAgency = pathname.includes('/dashboard/agency');
  const isClient = pathname.includes('/dashboard/client');
  const roleName = isAgency ? 'Mídia (Agência)' : isClient ? 'Cliente' : 'Executivo de Veículo';

  return (
    <header className={styles.topbar}>
      <div className={styles.searchContainer}>
        <Search size={18} className={styles.searchIcon} />
        <input 
          type="text" 
          placeholder="Buscar..." 
          className={styles.searchInput}
        />
      </div>

      <div className={styles.roleSwitcher}>
        <Link href="/dashboard" className={!isAgency && !isClient ? styles.activeRole : ''}>Veículo</Link>
        <Link href="/dashboard/agency" className={isAgency ? styles.activeRole : ''}>Agência</Link>
        <Link href="/dashboard/client" className={isClient ? styles.activeRole : ''}>Cliente</Link>
      </div>

      <div className={styles.actions}>
        <div className={styles.aiStatus}>
          <Zap size={16} fill="currentColor" />
          <span>IA Ativa</span>
        </div>
        
        <button className={styles.iconBtn}>
          <Bell size={20} />
          <span className={styles.badge} />
        </button>

        <div className={styles.userProfile}>
          <div className={styles.userInfo}>
            <span className={styles.userName}>Lucas Wagner</span>
            <span className={styles.userRole}>{roleName}</span>
          </div>
          <div className={styles.avatar}>LW</div>
        </div>
      </div>
    </header>
  );
}
