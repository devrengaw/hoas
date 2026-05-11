'use client';

import React, { useState } from 'react';
import { UserPlus, Mail, Shield, Trash2, CheckCircle, Search, MoreVertical, X } from 'lucide-react';
import styles from './page.module.css';

export default function TeamPage() {
  const [showModal, setShowModal] = useState(false);
  const [users, setUsers] = useState([
    { id: 1, name: "Lucas Wagner", email: "lucas@empresa.com.br", role: "Admin", status: "Ativo" },
    { id: 2, name: "Ana Beatriz", email: "ana@empresa.com.br", role: "Executivo", status: "Ativo" },
    { id: 3, name: "Carlos Melo", email: "carlos@empresa.com.br", role: "Analista", status: "Pendente" },
  ]);

  const [newUser, setNewUser] = useState({ name: '', email: '', role: 'Analista', password: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/admin/create-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newUser,
          userType: 'client',
          companyId: 'CLIENT_ID' // In a real app, this comes from the current user's profile
        })
      });

      const result = await response.json();

      if (!result.success) throw new Error(result.error);

      const userToAdd = {
        id: users.length + 1,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        status: 'Ativo'
      };

      setUsers([...users, userToAdd]);
      setShowModal(false);
      setNewUser({ name: '', email: '', role: 'Analista', password: '' });
      alert('Usuário cadastrado com sucesso!');
    } catch (error: any) {
      alert('Erro ao cadastrar usuário: ' + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div>
          <h1>Gestão da Equipe</h1>
          <p>Cadastre e gerencie os usuários que têm acesso ao painel da sua empresa.</p>
        </div>
        <button className={styles.addBtn} onClick={() => setShowModal(true)}>
          <UserPlus size={18} />
          <span>Cadastrar Usuário</span>
        </button>
      </header>

      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <label>Total de Usuários</label>
          <h3>{users.length}</h3>
        </div>
        <div className={styles.statCard}>
          <label>Licenças Disponíveis</label>
          <h3>{15 - users.length}</h3>
        </div>
        <div className={styles.statCard}>
          <label>Acessos este Mês</label>
          <h3>142</h3>
        </div>
      </div>

      <section className={styles.tableSection}>
        <div className={styles.tableControls}>
          <div className={styles.searchBox}>
            <Search size={18} />
            <input type="text" placeholder="Buscar por nome ou e-mail..." />
          </div>
        </div>

        <table className={styles.table}>
          <thead>
            <tr>
              <th>Usuário</th>
              <th>E-mail</th>
              <th>Cargo / Nível</th>
              <th>Status</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>
                  <div className={styles.userName}>
                    <div className={styles.avatar}>{user.name[0]}</div>
                    <span>{user.name}</span>
                  </div>
                </td>
                <td>{user.email}</td>
                <td>
                  <div className={styles.roleBadge}>
                    <Shield size={12} />
                    {user.role}
                  </div>
                </td>
                <td>
                  <span className={`${styles.status} ${user.status === 'Ativo' ? styles.active : styles.pending}`}>
                    {user.status}
                  </span>
                </td>
                <td>
                  <div className={styles.actions}>
                    <button className={styles.iconBtn}><Trash2 size={16} /></button>
                    <button className={styles.iconBtn}><MoreVertical size={16} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {showModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <h2>Cadastrar Novo Usuário</h2>
              <button className={styles.closeBtn} onClick={() => setShowModal(false)}><X size={20} /></button>
            </div>
            <form onSubmit={handleAddUser} className={styles.modalForm}>
              <div className={styles.field}>
                <label>Nome Completo</label>
                <input 
                  type="text" 
                  placeholder="Nome do colaborador" 
                  value={newUser.name}
                  onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                  required 
                />
              </div>
              <div className={styles.field}>
                <label>E-mail Corporativo</label>
                <input 
                  type="email" 
                  placeholder="email@empresa.com.br" 
                  value={newUser.email}
                  onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                  required 
                />
              </div>
              <div className={styles.field}>
                <label>Cargo / Nível de Acesso</label>
                <select 
                  value={newUser.role}
                  onChange={(e) => setNewUser({...newUser, role: e.target.value})}
                >
                  <option value="Admin">Administrador</option>
                  <option value="Executivo">Executivo de Contas</option>
                  <option value="Analista">Analista / Operação</option>
                </select>
              </div>
              <div className={styles.field}>
                <label>Senha Provisória</label>
                <input 
                  type="password" 
                  placeholder="••••••••" 
                  value={newUser.password}
                  onChange={(e) => setNewUser({...newUser, password: e.target.value})}
                  required 
                />
              </div>
              <div className={styles.modalFooter}>
                <button type="button" className={styles.cancelBtn} onClick={() => setShowModal(false)} disabled={isSubmitting}>Cancelar</button>
                <button type="submit" className={styles.submitBtn} disabled={isSubmitting}>
                  {isSubmitting ? 'Salvando...' : 'Salvar Usuário'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
