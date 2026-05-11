'use client';

import React, { useState } from 'react';
import { 
  Users, UserPlus, ShieldCheck, Mail, Lock, Trash2, 
  Search, Filter, ChevronRight, CheckCircle2, X
} from 'lucide-react';
import styles from './page.module.css';
import { supabase } from '@/lib/supabase';

export default function UserManagementAdmin() {
  const [users, setUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  React.useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setUsers(data.map(u => ({
        id: u.id,
        name: u.full_name,
        email: u.email,
        role: u.role || 'Usuário',
        status: 'Ativo'
      })));
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div>
          <div className={styles.adminBadge}>
            <ShieldCheck size={14} />
            <span>Gestão Interna HOAS</span>
          </div>
          <h1>Gestão de Usuários Admin</h1>
          <p>Gerencie os membros da equipe que administram a plataforma HOAS.</p>
        </div>
        <button className={styles.addBtn} onClick={() => setIsModalOpen(true)}>
          <UserPlus size={18} /> Novo Usuário Admin
        </button>
      </header>

      <div className={styles.mainBox}>
        <div className={styles.searchBar}>
          <Search size={20} />
          <input type="text" placeholder="Buscar administrador por nome ou e-mail..." />
        </div>

        <div className={styles.userList}>
          <div className={styles.listHeader}>
            <span>Usuário</span>
            <span>Cargo / Role</span>
            <span>Status</span>
            <span>Ações</span>
          </div>
          {users.map(user => (
            <div key={user.id} className={styles.userItem}>
              <div className={styles.userInfo}>
                <div className={styles.avatar}>{user.name[0]}</div>
                <div>
                  <strong>{user.name}</strong>
                  <p>{user.email}</p>
                </div>
              </div>
              <div className={styles.userRole}>
                <span className={styles.roleTag}>{user.role}</span>
              </div>
              <div className={styles.userStatus}>
                <span className={user.status === 'Ativo' ? styles.statusActive : styles.statusInactive}>
                  {user.status}
                </span>
              </div>
              <div className={styles.userActions}>
                <button title="Redefinir Senha"><Lock size={14} /></button>
                <button className={styles.deleteBtn} title="Remover Acesso"><Trash2 size={14} /></button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {isModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <button className={styles.closeBtn} onClick={() => setIsModalOpen(false)}><X size={20} /></button>
            <h2>Novo Administrador</h2>
            <p>Adicione um novo membro para a equipe de gestão da plataforma.</p>
            
            <div className={styles.form}>
              <div className={styles.inputGroup}>
                <label>Nome Completo</label>
                <input type="text" placeholder="Ex: Lucas Wagner" />
              </div>
              <div className={styles.inputGroup}>
                <label>E-mail Corporativo</label>
                <input type="email" placeholder="nome@hoas.com" />
              </div>
              <div className={styles.inputGroup}>
                <label>Nível de Acesso</label>
                <select>
                  <option>Super Admin</option>
                  <option>Suporte</option>
                  <option>Financeiro</option>
                  <option>Curador de Conteúdo</option>
                </select>
              </div>
              <button className={styles.confirmBtn}>Criar Conta Admin</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
