'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { 
  Home, 
  FileText, 
  Users, 
  ShoppingBag, 
  Wallet, 
  Calendar, 
  Heart, 
  BarChart2,
  Settings,
  LogOut,
  MessageSquare,
  Briefcase,
  User,
  Target,
  ShieldCheck,
  UserPlus
} from 'lucide-react';
import styles from './Sidebar.module.css';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, profile, signOut } = useAuth();
  
  const handleLogout = async () => {
    await signOut();
    router.push('/login');
  };

  const isPlatformAdmin = pathname.startsWith('/dashboard/platform-admin');
  const isAgency = pathname.includes('/agency');
  const isClient = pathname.includes('/client');
  
  let basePath = '/dashboard';
  if (isPlatformAdmin) basePath = '/dashboard/platform-admin';
  else if (isAgency) basePath = '/dashboard/agency';
  else if (isClient) basePath = '/dashboard/client';

  // Role-based menu items
  const menuItems = isPlatformAdmin ? [
    { icon: Home, label: 'Dashboard Admin', href: '/dashboard/platform-admin' },
    { icon: UserPlus, label: 'Gestão de Usuários', href: '/dashboard/platform-admin/users' },
    { icon: BarChart2, label: 'Pipeline', href: '/dashboard/platform-admin/pipeline' },
    { icon: Wallet, label: 'Carteira', href: '/dashboard/platform-admin/wallet' },
    { icon: Calendar, label: 'Agenda', href: '/dashboard/platform-admin/calendar' },
    { icon: Calendar, label: 'Eventos', href: '/dashboard/platform-admin/events' },
    { icon: Heart, label: 'HOAS Care', href: '/dashboard/platform-admin/care' },
  ] : [
    { icon: Home, label: 'Home', href: basePath },
    { icon: FileText, label: isAgency ? 'Meus Briefings' : isClient ? 'Minhas Necessidades' : 'Propostas', href: `${basePath}/briefings` },
    { icon: Briefcase, label: 'Propostas Recebidas', href: `${basePath}/proposals`, hidden: !isAgency && !isClient },
    { icon: MessageSquare, label: 'Mensagens', href: `${basePath}/messages` },
    { icon: Calendar, label: 'Agenda', href: `${basePath}/meetings` },
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
        <img src="/identidade visual/hoas_png.png" alt="HOAS Logo" className={styles.sidebarLogo} />
      </div>

      <nav className={styles.nav}>
        <div className={styles.sectionLabel}>
          {isPlatformAdmin ? 'Administração Global' : 'Menu Principal'}
        </div>
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
        <div className={styles.userProfile}>
          <div className={styles.userAvatar}>{profile?.full_name?.[0] || 'U'}</div>
          <div className={styles.userInfo}>
            <span className={styles.userName}>{profile?.full_name || 'Usuário'}</span>
            <span className={styles.userRole}>
              {profile?.role === 'vehicle' ? 'Veículo' : 
               profile?.role === 'agency' ? 'Agência' : 
               profile?.role === 'client' ? 'Anunciante' : 
               profile?.role === 'platform-admin' ? 'Administrador' : 'Visitante'}
            </span>
          </div>
        </div>

        {isPlatformAdmin && (
          <div className={styles.adminBadge}>
            <ShieldCheck size={14} />
            <span>Platform Admin</span>
          </div>
        )}
        
        {!isPlatformAdmin && (
          <>
            <Link href={`${basePath}/settings/team`} className={styles.navLink}>
              <Settings size={20} />
              <span>Configurações</span>
            </Link>
          </>
        )}
        
        <button className={styles.logoutBtn} onClick={handleLogout}>
          <LogOut size={20} />
          <span>Sair</span>
        </button>
      </div>
    </aside>
  );
}
