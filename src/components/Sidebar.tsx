'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Home, 
  FileText, 
  Users, 
  Video, 
  ShoppingBag, 
  Wallet, 
  Calendar, 
  Heart, 
  BarChart2,
  Settings,
  LogOut,
  MessageSquare,
  Briefcase,
  Sparkles
} from 'lucide-react';
import styles from './Sidebar.module.css';

export default function Sidebar() {
  const pathname = usePathname();
  const isAgency = pathname.includes('/agency');
  const isClient = pathname.includes('/client');
  const basePath = isAgency ? '/dashboard/agency' : isClient ? '/dashboard/client' : '/dashboard';

  const menuItems = [
    { icon: Home, label: 'Home', href: basePath },
    { icon: FileText, label: isAgency ? 'Meus Briefings' : isClient ? 'Minhas Necessidades' : 'Propostas', href: `${basePath}/briefings` },
    { icon: Briefcase, label: 'Propostas Recebidas', href: `${basePath}/proposals`, hidden: !isAgency && !isClient },
    { icon: MessageSquare, label: 'Mensagens', href: `${basePath}/messages` },
    { icon: Video, label: 'Reuniões', href: `${basePath}/meetings` },
    { icon: ShoppingBag, label: 'Marketplace', href: `${basePath}/marketplace` },
    { icon: Users, label: isAgency ? 'Veículos' : 'Mídias', href: `${basePath}/directory` },
    { icon: Wallet, label: 'Carteira', href: `${basePath}/wallet` },
    { icon: BarChart2, label: 'Pipeline', href: `${basePath}/pipeline` },
    { icon: Calendar, label: 'Eventos', href: `${basePath}/events` },
    { icon: Heart, label: 'HOAS Care', href: `${basePath}/care` },
  ];

  return (
    <aside className={styles.sidebar}>
      <div className={styles.logo}>
        <span className={styles.logoText}>HOAS</span>
      </div>

      <nav className={styles.nav}>
        <div className={styles.sectionLabel}>Menu Principal</div>
        {menuItems.filter(item => !item.hidden).map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link 
              key={item.href} 
              href={item.href}
              className={`${styles.navLink} ${isActive ? styles.active : ''}`}
            >
              <item.icon size={20} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className={styles.footer}>
        <Link href={`${basePath}/settings/team`} className={styles.navLink}>
          <Settings size={20} />
          <span>Configurações</span>
        </Link>
        <button className={styles.logoutBtn}>
          <LogOut size={20} />
          <span>Sair</span>
        </button>
      </div>
    </aside>
  );
}
