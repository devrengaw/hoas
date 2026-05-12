'use client';

import React, { useState } from 'react';
import { 
  ShieldCheck, Search, Users, Building2, Mail, RefreshCw, 
  ChevronRight, ArrowLeftRight, CheckCircle2, Lock, X, 
  AlertCircle, DollarSign, CreditCard, Layout, Globe, MapPin,
  Trash2, UserPlus, Save, Settings, TrendingUp, Target, BarChart3,
  Heart
} from 'lucide-react';
import styles from './page.module.css';
import { supabase } from '@/lib/supabase';

type OrgType = 'AGENCY' | 'VEHICLE' | 'CLIENT';

export type Organization = {
  id: string;
  name: string;
  type: string;
  status: string;
  masterName: string;
  masterEmail: string;
  users: any[];
  plan?: string;
  paymentsCount?: number;
  profile?: any;
};

export default function PlatformAdmin() {
  const [allOrgs, setAllOrgs] = useState<Organization[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeType, setActiveType] = useState<OrgType>('AGENCY');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrg, setSelectedOrg] = useState<Organization | null>(null);
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
  const [isEditUserModalOpen, setIsEditUserModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [editingUser, setEditingUser] = useState<any>(null);
  const [activeView, setActiveView] = useState<'OVERVIEW' | 'CONFIG'>('OVERVIEW');
  const [configSection, setConfigSection] = useState<'ORGS' | 'EMAILS' | 'CONTENT'>('ORGS');

  React.useEffect(() => {
    fetchOrgs();
  }, []);

  const [globalEvents, setGlobalEvents] = useState<any[]>([]);
  const [careCampaigns, setCareCampaigns] = useState<any[]>([]);

  const fetchContent = async () => {
    try {
      const { data: events } = await supabase.from('global_events').select('*').order('created_at', { ascending: false });
      if (events) setGlobalEvents(events);
      
      const { data: care } = await supabase.from('global_care_campaigns').select('*').order('created_at', { ascending: false });
      if (care) setCareCampaigns(care);
    } catch (error) {
      console.error('Error fetching content:', error);
    }
  };

  React.useEffect(() => {
    if (configSection === 'CONTENT') {
      fetchContent();
    }
  }, [configSection]);

  const fetchOrgs = async () => {
    try {
      setIsLoading(true);
      const { data: companies, error: compError } = await supabase
        .from('companies')
        .select('*, profiles(*)');
      
      if (compError) throw compError;

      const mapped: Organization[] = companies.map(c => ({
        id: c.id,
        name: c.name,
        type: c.type?.toUpperCase() || 'AGENCY',
        status: 'Ativo',
        masterName: c.profiles?.[0]?.full_name || 'N/A',
        masterEmail: c.profiles?.[0]?.email || 'N/A',
        users: c.profiles?.map((p: any) => ({
          id: p.id,
          name: p.full_name,
          email: p.email,
          role: p.role,
          lastAccess: 'Agora'
        })) || []
      }));

      setAllOrgs(mapped);
    } catch (error) {
      console.error('Error fetching orgs:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Email states
  const [emailTemplates, setEmailTemplates] = useState({
    welcome: {
      subject: 'Bem-vindo ao HOAS: Sua nova jornada começa aqui',
      body: 'Olá {{name}}, ficamos felizes em ter você conosco...',
      layout: 'standard'
    },
    passwordChange: {
      subject: 'Segurança HOAS: Sua senha foi alterada',
      body: 'Olá {{name}}, este é um aviso de que sua senha foi modificada...',
      layout: 'minimal'
    }
  });
  const [selectedTemplate, setSelectedTemplate] = useState<'welcome' | 'passwordChange'>('welcome');
  
  // Form states
  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');

  const filteredOrgs = allOrgs.filter(o => 
    o.type === activeType &&
    (o.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
     o.masterEmail.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleEditUser = (user: any) => {
    setEditingUser(user);
    setFormName(user.name);
    setFormEmail(user.email);
    setIsEditUserModalOpen(true);
  };

  const showSuccess = (msg: string) => {
    setSuccessMessage(msg);
    setIsSuccessModalOpen(true);
  };

  const saveUserChanges = () => {
    if (!selectedOrg || !editingUser) return;

    const updatedOrgs = allOrgs.map(org => {
      if (org.id === selectedOrg.id) {
        const updatedUsers = org.users.map(u => 
          u.id === editingUser.id ? { ...u, name: formName, email: formEmail } : u
        );
        const isMaster = editingUser.email === org.masterEmail;
        return { 
          ...org, 
          users: updatedUsers,
          masterName: isMaster ? formName : org.masterName,
          masterEmail: isMaster ? formEmail : org.masterEmail
        };
      }
      return org;
    });

    setAllOrgs(updatedOrgs);
    setSelectedOrg(updatedOrgs.find(o => o.id === selectedOrg.id) || null);
    setIsEditUserModalOpen(false);
    showSuccess('Alterações salvas com sucesso! O histórico do usuário foi preservado.');
  };

  const handleResetPassword = (email: string) => {
    showSuccess(`Uma senha provisória foi enviada para ${email}. O usuário deverá alterá-la no próximo acesso.`);
  };

  const handleDeleteUser = (userId: string) => {
    if (!confirm('Tem certeza que deseja remover este usuário?')) return;
    
    const updatedOrgs = allOrgs.map(org => {
      if (org.id === selectedOrg?.id) {
        return { ...org, users: org.users.filter(u => u.id !== userId) };
      }
      return org;
    });
    setAllOrgs(updatedOrgs);
    setSelectedOrg(updatedOrgs.find(o => o.id === selectedOrg?.id) || null);
    showSuccess('Usuário removido da organização.');
  };

  return (
    <>
      <div className={styles.container}>
      <header className={styles.header}>
        <div>
          <div className={styles.adminBadge}>
            <ShieldCheck size={14} />
            <span>Acesso Restrito: Platform Admin</span>
          </div>
          <h1>{activeView === 'OVERVIEW' ? 'Visão Geral do Ecossistema' : 'Configurações do Sistema'}</h1>
          <p>
            {activeView === 'OVERVIEW' 
              ? 'Métricas de performance, metas globais e saúde da plataforma.' 
              : 'Gerenciamento de organizações, templates de comunicação e regras de negócio.'}
          </p>
        </div>
      </header>

      <div className={styles.tabsRow}>
        <button 
          className={`${styles.tabBtn} ${activeView === 'OVERVIEW' ? styles.activeTab : ''}`}
          onClick={() => setActiveView('OVERVIEW')}
        >
          <BarChart3 size={18} /> Visão Geral
        </button>
        <button 
          className={`${styles.tabBtn} ${activeView === 'CONFIG' ? styles.activeTab : ''}`}
          onClick={() => setActiveView('CONFIG')}
        >
          <Settings size={18} /> Configurações
        </button>
      </div>

      {activeView === 'OVERVIEW' ? (
        <div className={styles.overviewContent}>
          <div className={styles.sectionHeaderWithAction}>
            <div className={styles.goalsRow}>
              <div className={styles.goalCard}>
                <div className={styles.goalHeader}>
                  <Target size={18} className={styles.goalIcon} />
                  <span>Meta de Receita Global (Mês)</span>
                  <span className={styles.goalProgress}>0%</span>
                </div>
                <div className={styles.progressBar}>
                  <div className={styles.progressFill} style={{ width: '0%' }} />
                </div>
                <div className={styles.goalFooter}>
                  <span>R$ 0 de R$ 0</span>
                  <div className={styles.rankingHint}>Ver Detalhes <ChevronRight size={12} /></div>
                </div>
              </div>
              <div className={styles.goalCard}>
                <div className={styles.goalHeader}>
                  <TrendingUp size={18} className={styles.goalIcon} />
                  <span>Meta de Expansão (Q2)</span>
                  <span className={styles.goalProgress}>0%</span>
                </div>
                <div className={styles.progressBar}>
                  <div className={styles.progressFill} style={{ width: '0%' }} />
                </div>
                <div className={styles.goalFooter}>
                  <span>0 de 0 novas conexões</span>
                  <div className={styles.rankingHint}>Ver Detalhes <ChevronRight size={12} /></div>
                </div>
              </div>
            </div>
            <button className={styles.configGoalsBtn} onClick={() => { setActiveView('CONFIG'); setConfigSection('ORGS'); }}>
              <Settings size={18} />
              <span>Gerenciar Sistema</span>
            </button>
          </div>

          <div className={styles.statsGrid}>
            <div className={styles.statMiniCard}>
              <Users size={20} />
              <div>
                <label>Total de Usuários</label>
                <strong>0</strong>
              </div>
            </div>
            <div className={styles.statMiniCard}>
              <Building2 size={20} />
              <div>
                <label>Organizações</label>
                <strong>0</strong>
              </div>
            </div>
            <div className={styles.statMiniCard}>
              <ArrowLeftRight size={20} />
              <div>
                <label>Transações/Dia</label>
                <strong>0</strong>
              </div>
            </div>
            <div className={styles.statMiniCard}>
              <ShieldCheck size={20} />
              <div>
                <label>Taxa de Retenção</label>
                <strong>0%</strong>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className={styles.configContent}>
          <div className={styles.subTabsRow}>
            <button 
              className={`${styles.subTabBtn} ${configSection === 'ORGS' ? styles.activeSubTab : ''}`}
              onClick={() => setConfigSection('ORGS')}
            >
              <Building2 size={16} /> Gestão de Organizações
            </button>
            <button 
              className={`${styles.subTabBtn} ${configSection === 'EMAILS' ? styles.activeSubTab : ''}`}
              onClick={() => setConfigSection('EMAILS')}
            >
              <Mail size={16} /> E-mails & Notificações
            </button>
            <button 
              className={`${styles.subTabBtn} ${configSection === 'CONTENT' ? styles.activeSubTab : ''}`}
              onClick={() => setConfigSection('CONTENT')}
            >
              <Layout size={16} /> Gestão de Conteúdo
            </button>
          </div>

          {configSection === 'ORGS' ? (
            <>
              <div className={styles.typeTabsRow}>
                {['AGENCY', 'VEHICLE', 'CLIENT'].map((type) => (
                  <button 
                    key={type}
                    className={`${styles.typeTabBtn} ${activeType === type ? styles.activeTypeTab : ''}`}
                    onClick={() => setActiveType(type as OrgType)}
                  >
                    {type === 'AGENCY' ? 'Agências' : type === 'VEHICLE' ? 'Veículos' : 'Clientes'} 
                    <span>{allOrgs.filter(o => o.type === type).length}</span>
                  </button>
                ))}
              </div>

              <div className={styles.mainBox}>
                <div className={styles.searchBar}>
                  <Search size={20} />
                  <input 
                    type="text" 
                    placeholder={`Buscar em ${activeType === 'AGENCY' ? 'Agências' : activeType === 'VEHICLE' ? 'Veículos' : 'Clientes'}...`} 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>

                <div className={styles.orgGrid}>
                  {filteredOrgs.map(org => (
                    <div key={org.id} className={styles.orgCard} onClick={() => setSelectedOrg(org)}>
                      <div className={styles.cardHeader}>
                        <div className={styles.orgIcon}>{org.name[0]}</div>
                        <div className={styles.planBadge}>{org.plan}</div>
                      </div>
                      <h3>{org.name}</h3>
                      <p className={styles.masterEmail}>{org.masterEmail}</p>
                      <div className={styles.cardStats}>
                        <div>
                          <span>Pagamentos</span>
                          <strong>{org.paymentsCount}</strong>
                        </div>
                        <div>
                          <span>Usuários</span>
                          <strong>{org.users.length}</strong>
                        </div>
                      </div>
                      <div className={styles.viewDetails}>Ver Detalhes <ChevronRight size={14} /></div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : configSection === 'CONTENT' ? (
            <div className={styles.contentManager}>
              <div className={styles.contentGrid}>
                <section className={styles.contentSection}>
                  <div className={styles.sectionHeader}>
                    <h3><Globe size={18} /> Eventos do Mercado</h3>
                    <button className={styles.addBtn} onClick={() => showSuccess('Funcionalidade de adicionar evento em breve!')}>+ Novo Evento</button>
                  </div>
                  <div className={styles.contentList}>
                    {globalEvents.length === 0 ? (
                      <div className={styles.emptyContent}>Nenhum evento cadastrado.</div>
                    ) : (
                      globalEvents.map(event => (
                        <div key={event.id} className={styles.contentItem}>
                          <div className={styles.itemInfo}>
                            <strong>{event.title}</strong>
                            <span>{event.date} • {event.location}</span>
                          </div>
                          <div className={styles.itemActions}>
                            <button><Settings size={14} /></button>
                            <button className={styles.deleteBtn}><Trash2 size={14} /></button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </section>

                <section className={styles.contentSection}>
                  <div className={styles.sectionHeader}>
                    <h3><Heart size={18} /> HOAS Care (Campanhas)</h3>
                    <button className={styles.addBtn} onClick={() => showSuccess('Funcionalidade de adicionar campanha em breve!')}>+ Nova Campanha</button>
                  </div>
                  <div className={styles.contentList}>
                    {careCampaigns.length === 0 ? (
                      <div className={styles.emptyContent}>Nenhuma campanha cadastrada.</div>
                    ) : (
                      careCampaigns.map(camp => (
                        <div key={camp.id} className={styles.contentItem}>
                          <div className={styles.itemInfo}>
                            <strong>{camp.title}</strong>
                            <span>{camp.description.substring(0, 40)}...</span>
                          </div>
                          <div className={styles.itemActions}>
                            <button><Settings size={14} /></button>
                            <button className={styles.deleteBtn}><Trash2 size={14} /></button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </section>
              </div>
            </div>
          ) : (
            <div className={styles.emailManager}>
              <div className={styles.emailSidebar}>
                <div className={styles.templateList}>
                  <h3>Templates Disponíveis</h3>
                  <button 
                    className={`${styles.templateItem} ${selectedTemplate === 'welcome' ? styles.activeTemplate : ''}`}
                    onClick={() => setSelectedTemplate('welcome')}
                  >
                    <Mail size={16} />
                    <div>
                      <strong>Boas-vindas (Novo Cadastro)</strong>
                      <span>Enviado após o primeiro acesso</span>
                    </div>
                  </button>
                  <button 
                    className={`${styles.templateItem} ${selectedTemplate === 'passwordChange' ? styles.activeTemplate : ''}`}
                    onClick={() => setSelectedTemplate('passwordChange')}
                  >
                    <Lock size={16} />
                    <div>
                      <strong>Alteração de Senha</strong>
                      <span>Enviado por segurança</span>
                    </div>
                  </button>
                </div>
              </div>

              <div className={styles.emailEditor}>
                <div className={styles.editorHeader}>
                  <h2>Editar Template: {selectedTemplate === 'welcome' ? 'Boas-vindas' : 'Alteração de Senha'}</h2>
                  <button className={styles.saveTemplateBtn} onClick={() => showSuccess('Template salvo com sucesso!')}>
                    <Save size={18} /> Salvar Template
                  </button>
                </div>

                <div className={styles.editorFields}>
                  <div className={styles.inputGroup}>
                    <label>Assunto do E-mail</label>
                    <input 
                      type="text" 
                      value={emailTemplates[selectedTemplate].subject}
                      onChange={(e) => {
                        const newTemplates = { ...emailTemplates };
                        newTemplates[selectedTemplate].subject = e.target.value;
                        setEmailTemplates(newTemplates);
                      }}
                      className={styles.editorInput}
                    />
                  </div>

                  <div className={styles.editorContainer}>
                    <div className={styles.textEditor}>
                      <label>Conteúdo (Markdown/HTML)</label>
                      <textarea 
                        value={emailTemplates[selectedTemplate].body}
                        onChange={(e) => {
                          const newTemplates = { ...emailTemplates };
                          newTemplates[selectedTemplate].body = e.target.value;
                          setEmailTemplates(newTemplates);
                        }}
                        placeholder="Escreva seu e-mail aqui..."
                      />
                      <div className={styles.tagHint}>
                        Variáveis: <code>{"{{name}}"}</code>, <code>{"{{email}}"}</code>, <code>{"{{link}}"}</code>
                      </div>
                    </div>

                    <div className={styles.previewPanel}>
                      <label>Visualização em Tempo Real</label>
                      <div className={styles.emailPreview}>
                        <div className={styles.previewContent}>
                          <div className={styles.previewHeader}>
                            <img src="/identidade visual/hoas_png.png" alt="HOAS" />
                          </div>
                          <div className={styles.previewBody}>
                            <h3>{emailTemplates[selectedTemplate].subject}</h3>
                            <p>{emailTemplates[selectedTemplate].body.replace('{{name}}', 'Lucas Wagner')}</p>
                            <div className={styles.previewCta}>
                              Acessar Plataforma
                            </div>
                          </div>
                          <div className={styles.previewFooter}>
                            © 2026 HOAS Ecosystem. Todos os direitos reservados.
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>


      {/* Organization Details Drawer */}
      {selectedOrg && (
        <div className={styles.drawerOverlay} onClick={() => setSelectedOrg(null)}>
          <div className={styles.drawer} onClick={e => e.stopPropagation()}>
            <button className={styles.closeDrawer} onClick={() => setSelectedOrg(null)}><X size={24} /></button>
            
            <div className={styles.drawerHeader}>
              <div className={styles.drawerAvatar}>{selectedOrg.name[0]}</div>
              <div className={styles.drawerTitle}>
                <h2>{selectedOrg.name}</h2>
                <span className={styles.typeTag}>{selectedOrg.type}</span>
              </div>
            </div>

            <div className={styles.drawerGrid}>
              <div className={styles.drawerSection}>
                <h3><CreditCard size={16} /> Plano & Faturamento</h3>
                <div className={styles.planInfo}>
                  <div className={styles.currentPlan}>
                    <label>Plano Ativo</label>
                    <strong>{selectedOrg.plan}</strong>
                  </div>
                  <div className={styles.paymentInfo}>
                    <label>Faturas Pagas</label>
                    <strong>{selectedOrg.paymentsCount}</strong>
                  </div>
                </div>
                <button className={styles.secondaryActionBtn}>Ver Histórico Financeiro</button>
              </div>

              <div className={styles.drawerSection}>
                <h3><Layout size={16} /> Perfil da Empresa</h3>
                <div className={styles.profileDetails}>
                  <p>{selectedOrg.profile?.description}</p>
                  <div className={styles.linkRow}><Globe size={14} /> {selectedOrg.profile?.website}</div>
                  <div className={styles.linkRow}><MapPin size={14} /> {selectedOrg.profile?.address}</div>
                </div>
              </div>

              <div className={`${styles.drawerSection} ${styles.fullWidth}`}>
                <div className={styles.sectionHeader}>
                  <h3><Users size={16} /> Gestão de Usuários</h3>
                  <button className={styles.addUserBtn}>+ Adicionar Usuário</button>
                </div>
                <div className={styles.userList}>
                  {selectedOrg.users.map(user => (
                    <div key={user.id} className={styles.userItem}>
                      <div className={styles.userInfo}>
                        <strong>{user.name}</strong>
                        <span>{user.email}</span>
                      </div>
                      <div className={styles.userRoleBadge}>{user.role}</div>
                      <div className={styles.userActions}>
                        <button title="Editar Usuário" onClick={() => handleEditUser(user)}><Mail size={14} /></button>
                        <button title="Resetar Senha" onClick={() => handleResetPassword(user.email)}><Lock size={14} /></button>
                        <button className={styles.deleteUser} onClick={() => handleDeleteUser(user.id)}><Trash2 size={14} /></button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className={styles.drawerFooter}>
              <button 
                className={styles.transferMasterBtn}
                onClick={() => setIsTransferModalOpen(true)}
              >
                <ArrowLeftRight size={18} /> Transferir Admin Master
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {isEditUserModalOpen && editingUser && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <button className={styles.closeBtn} onClick={() => setIsEditUserModalOpen(false)}><X size={20} /></button>
            <div className={styles.modalHeader}>
              <div className={styles.modalIconWrapper}>
                <UserPlus size={24} />
              </div>
              <h2>Editar Usuário</h2>
              <p>O novo usuário herdará todo o histórico e permissões desta conta.</p>
            </div>
            <div className={styles.form}>
              <div className={styles.inputGroup}>
                <label className={styles.fieldLabel}>Nome Completo</label>
                <input 
                  type="text" 
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className={styles.modalInput}
                  placeholder="Nome do usuário"
                  style={{ fontFamily: 'inherit' }}
                />
              </div>
              <div className={styles.inputGroup}>
                <label className={styles.fieldLabel}>E-mail</label>
                <input 
                  type="email" 
                  value={formEmail}
                  onChange={(e) => setFormEmail(e.target.value)}
                  className={styles.modalInput}
                  placeholder="email@empresa.com"
                  style={{ fontFamily: 'inherit' }}
                />
              </div>
              <div className={styles.securityNotice}>
                <Lock size={14} />
                <span>Ao alterar o e-mail, uma nova senha provisória será exigida no primeiro acesso.</span>
              </div>
              <button className={styles.primaryActionBtn} onClick={saveUserChanges}>
                <Save size={18} /> Salvar Alterações
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Modal (Replacing ugly alert) */}
      {isSuccessModalOpen && (
        <div className={styles.modalOverlay} onClick={() => setIsSuccessModalOpen(false)}>
          <div className={styles.modal} onClick={e => e.stopPropagation()}>
            <div className={styles.successIconWrapper}>
              <CheckCircle2 size={40} />
            </div>
            <h2>Sucesso!</h2>
            <p className={styles.successText}>{successMessage}</p>
            <button className={styles.primaryActionBtn} onClick={() => setIsSuccessModalOpen(false)}>
              Entendido
            </button>
          </div>
        </div>
      )}

      {/* Transfer Master Modal */}
      {isTransferModalOpen && selectedOrg && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <button className={styles.closeBtn} onClick={() => setIsTransferModalOpen(false)}><X size={20} /></button>
            <div className={styles.modalHeader}>
              <div className={styles.modalIconWrapper}><RefreshCw size={24} /></div>
              <h2>Transferir Master Admin</h2>
              <p>Substitua o gestor principal da organização.</p>
            </div>
            <div className={styles.form}>
              <div className={styles.inputGroup}>
                <label className={styles.fieldLabel}>Novo Nome</label>
                <input type="text" placeholder="Nome do novo Master" className={styles.modalInput} style={{ fontFamily: 'inherit' }} />
              </div>
              <div className={styles.inputGroup}>
                <label className={styles.fieldLabel}>Novo E-mail</label>
                <input type="email" placeholder="email@empresa.com" className={styles.modalInput} style={{ fontFamily: 'inherit' }} />
              </div>
              <button className={styles.primaryActionBtn} onClick={() => { setIsTransferModalOpen(false); showSuccess('Transferência solicitada com sucesso!'); }}>
                Confirmar Transferência
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
