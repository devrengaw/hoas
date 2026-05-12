'use client';

import React, { useState, useEffect } from 'react';
import { UserPlus, Mail, Shield, Trash2, CheckCircle, Search, MoreVertical, X, ShieldCheck, Settings, Lock, Users, FileText, Video, MessageSquare, Building2, Zap, DollarSign, Target } from 'lucide-react';
import styles from './page.module.css';
import { supabase } from '@/lib/supabase';

export default function TeamPage() {
  const [activeTab, setActiveTab] = useState<'users' | 'permissions'>('users');
  const [showModal, setShowModal] = useState(false);
  const [showActionsMenu, setShowActionsMenu] = useState<string | null>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<any>(null);

  const [userPermissions, setUserPermissions] = useState<Record<string, Record<string, boolean>>>({});
  const [newUser, setNewUser] = useState({ name: '', email: '', role: 'Analista' });

  const fetchTeam = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      
      setCurrentUser(profile);

      if (profile?.company_id) {
        const { data: team } = await supabase
          .from('profiles')
          .select('*')
          .eq('company_id', profile.company_id);
        
        if (team) {
          setUsers(team.map(u => ({
            id: u.id,
            name: u.full_name || 'Usuário HOAS',
            email: u.email,
            role: u.position || (u.role === 'admin' ? 'Admin' : 'Membro'),
            status: 'Ativo'
          })));
        }
      }
    } catch (error) {
      console.error('Error fetching team:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeam();
  }, []);

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    const newId = users.length + 1;
    const userToAdd = {
      id: newId,
      ...newUser,
      status: 'Pendente'
    };
    setUsers([...users, userToAdd]);
    setUserPermissions({
      ...userPermissions,
      [newId]: { proposals: false, meetings: false, messages: false, marketplace: false, analytics: false, finance: false }
    });
    setShowModal(false);
    setNewUser({ name: '', email: '', role: 'Analista' });
  };

  const toggleUserPermission = (userId: string, module: string) => {
    setUserPermissions(prev => ({
      ...prev,
      [userId]: {
        ...prev[userId],
        [module]: !prev[userId]?.[module]
      }
    }));
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div>
          <h1>Gestão da Equipe & Acessos</h1>
          <p>Gerencie quem acessa sua empresa e quais permissões individuais cada usuário possui.</p>
        </div>
        {activeTab === 'users' && (
          <button className={styles.addBtn} onClick={() => setShowModal(true)}>
            <UserPlus size={18} />
            <span>Cadastrar Usuário</span>
          </button>
        )}
      </header>

      <div className={styles.tabs}>
        <button 
          className={`${styles.tab} ${activeTab === 'users' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('users')}
        >
          <Users size={18} />
          <span>Usuários</span>
        </button>
        <button 
          className={`${styles.tab} ${activeTab === 'permissions' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('permissions')}
        >
          <Lock size={18} />
          <span>Permissões por Usuário</span>
        </button>
      </div>

      {activeTab === 'users' ? (
        <>
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
                {loading ? (
                  <tr><td colSpan={5} style={{ textAlign: 'center', padding: '2rem' }}>Carregando equipe...</td></tr>
                ) : users.length === 0 ? (
                  <tr><td colSpan={5} style={{ textAlign: 'center', padding: '2rem' }}>Nenhum membro na equipe encontrado.</td></tr>
                ) : (
                  users.map((user) => (
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
                        <div className={styles.actionsWrapper}>
                          <button 
                            className={styles.iconBtn} 
                            onClick={() => setShowActionsMenu(showActionsMenu === user.id ? null : user.id)}
                          >
                            <MoreVertical size={16} />
                          </button>
                          
                          {showActionsMenu === user.id && (
                            <div className={styles.dropdown}>
                              <button onClick={() => { setActiveTab('permissions'); setShowActionsMenu(null); }}>
                                <Shield size={14} />
                                <span>Configurar Permissões</span>
                              </button>
                              <button onClick={() => { window.location.href = '/dashboard/settings/goals'; }}>
                                <Target size={14} />
                                <span>Configurar Metas</span>
                              </button>
                              <hr />
                              <button className={styles.deleteOption}>
                                <Trash2 size={14} />
                                <span>Excluir Usuário</span>
                              </button>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </section>
        </>
      ) : (
        <div className={styles.permissionsContainer}>
          <div className={styles.permissionsHeader}>
            <div className={styles.permTitle}>
              <ShieldCheck size={20} />
              <h3>Configurar Permissões Individuais</h3>
            </div>
            <button className={styles.savePermsBtn}>Salvar Configurações</button>
          </div>

          <div className={styles.permissionsGrid}>
            <table className={styles.permTable}>
              <thead>
                <tr>
                  <th>Usuário / Módulo</th>
                  <th title="Propostas"><FileText size={16} /></th>
                  <th title="Reuniões"><Video size={16} /></th>
                  <th title="Mensagens"><MessageSquare size={16} /></th>
                  <th title="Marketplace"><Building2 size={16} /></th>
                  <th title="Analytics"><Zap size={16} /></th>
                  <th title="Financeiro"><DollarSign size={16} /></th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={7} style={{ textAlign: 'center', padding: '2rem' }}>Carregando permissões...</td></tr>
                ) : users.length === 0 ? (
                  <tr><td colSpan={7} style={{ textAlign: 'center', padding: '2rem' }}>Nenhum membro encontrado.</td></tr>
                ) : (
                  users.map((user) => (
                    <tr key={user.id}>
                      <td>
                        <div className={styles.userNamePerm}>
                          <div className={styles.avatarSmall}>{user.name[0]}</div>
                          <div className={styles.nameInfo}>
                            <span>{user.name}</span>
                            <small>{user.role}</small>
                          </div>
                        </div>
                      </td>
                      <td>
                        <input 
                          type="checkbox" 
                          checked={!!userPermissions[user.id]?.proposals}
                          onChange={() => toggleUserPermission(user.id, 'proposals')}
                        />
                      </td>
                      <td>
                        <input 
                          type="checkbox" 
                          checked={!!userPermissions[user.id]?.meetings}
                          onChange={() => toggleUserPermission(user.id, 'meetings')}
                        />
                      </td>
                      <td>
                        <input 
                          type="checkbox" 
                          checked={!!userPermissions[user.id]?.messages}
                          onChange={() => toggleUserPermission(user.id, 'messages')}
                        />
                      </td>
                      <td>
                        <input 
                          type="checkbox" 
                          checked={!!userPermissions[user.id]?.marketplace}
                          onChange={() => toggleUserPermission(user.id, 'marketplace')}
                        />
                      </td>
                      <td>
                        <input 
                          type="checkbox" 
                          checked={!!userPermissions[user.id]?.analytics}
                          onChange={() => toggleUserPermission(user.id, 'analytics')}
                        />
                      </td>
                      <td>
                        <input 
                          type="checkbox" 
                          checked={!!userPermissions[user.id]?.finance}
                          onChange={() => toggleUserPermission(user.id, 'finance')}
                        />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

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
              <div className={styles.modalFooter}>
                <button type="button" className={styles.cancelBtn} onClick={() => setShowModal(false)}>Cancelar</button>
                <button type="submit" className={styles.submitBtn}>Salvar Usuário</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
