'use client';

import React, { useState } from 'react';
import { Camera, Image as ImageIcon, Save, CheckCircle, Globe, Briefcase, BarChart, Layout, Target, MapPin, Plus, Trash2, ExternalLink, Video, Mail } from 'lucide-react';
import styles from './page.module.css';
import { supabase } from '@/lib/supabase';

export default function ProfilePage() {
  const [activeSection, setActiveSection] = useState('identidade');
  const [formData, setFormData] = useState({
    name: 'Grupo Bandeirantes',
    slogan: 'A emoção de viver o Brasil',
    category: 'TV / Vídeo',
    description: 'Um dos maiores conglomerados de mídia do Brasil, com alcance nacional em TV aberta, TV por assinatura, rádio e plataformas digitais. Foco em jornalismo, esporte e entretenimento de qualidade.',
    audienceType: 'B2C - Público Geral',
    monthlyReach: '45.000.000',
    regions: 'Nacional',
    website: 'www.band.com.br',
    location: 'São Paulo, SP'
  });

  const [formats, setFormats] = useState({
    'TV Aberta': true,
    'TV Fechada': true,
    'Digital (Portal)': true,
    'OOH': false,
    'Rádio': true,
    'Branded Content': true,
    'Influenciadores': false,
    'Eventos': true,
  });

  const handleFormatChange = (format: string) => {
    setFormats(prev => ({
      ...prev,
      [format]: !prev[format as keyof typeof formats]
    }));
  };

  const [isSaved, setIsSaved] = useState(false);
  const [connectedApps, setConnectedApps] = useState<string[]>([]);
  const [connectingApp, setConnectingApp] = useState<string | null>(null);

  React.useEffect(() => {
    fetchIntegrations();
  }, []);

  const fetchIntegrations = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data: integrations } = await supabase
      .from('user_integrations')
      .select('provider')
      .eq('profile_id', user.id)
      .eq('is_active', true);
    
    if (integrations) {
      setConnectedApps(integrations.map(i => i.provider));
    }
  };

  const handleConnect = async (app: string) => {
    if (connectedApps.includes(app)) {
      // Disconnect logic
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      await supabase
        .from('user_integrations')
        .delete()
        .eq('profile_id', user.id)
        .eq('provider', app);
      
      setConnectedApps(prev => prev.filter(a => a !== app));
      return;
    }

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    setConnectingApp(app);
    // Redirect to our custom OAuth initiation route
    window.location.href = `/api/auth/integrations/${app}?profileId=${user.id}`;
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const navItems = [
    { id: 'identidade', label: 'Identidade Visual', icon: <ImageIcon size={18} /> },
    { id: 'info', label: 'Informações Básicas', icon: <Briefcase size={18} /> },
    { id: 'audiencia', label: 'Audiência & Alcance', icon: <Target size={18} /> },
    { id: 'portfolio', label: 'Portfólio & Cases', icon: <Layout size={18} /> },
    { id: 'conexoes', label: 'Conexões & Apps', icon: <Globe size={18} /> },
  ];

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.headerInfo}>
          <div className={styles.badge}>Master Account</div>
          <h1>Meu Perfil Profissional</h1>
          <p>Personalize como sua marca é vista por todo o ecossistema HOAS.</p>
        </div>
        <div className={styles.headerActions}>
          <button className={styles.previewBtn}>
            <ExternalLink size={18} />
            <span>Ver Media Kit Público</span>
          </button>
          <button className={`${styles.saveBtn} ${isSaved ? styles.saved : ''}`} onClick={handleSave}>
            {isSaved ? <CheckCircle size={18} /> : <Save size={18} />}
            <span>{isSaved ? 'Alterações Salvas' : 'Salvar Perfil'}</span>
          </button>
        </div>
      </header>

      <div className={styles.layout}>
        <aside className={styles.sidebar}>
          {navItems.map(item => (
            <button 
              key={item.id}
              className={`${styles.navItem} ${activeSection === item.id ? styles.activeNav : ''}`}
              onClick={() => setActiveSection(item.id)}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          ))}
        </aside>

        <main className={styles.mainContent}>
          {activeSection === 'identidade' && (
            <section className={styles.sectionCard}>
              <div className={styles.sectionHeader}>
                <ImageIcon size={20} />
                <h2>Identidade Visual</h2>
              </div>
              
              <div className={styles.uploadGroup}>
                <label>Imagem de Capa (Media Kit)</label>
                <div className={styles.coverUpload}>
                  <div className={styles.coverPreview}>
                    <ImageIcon size={48} />
                    <p>Arraste ou clique para enviar sua capa institucional</p>
                    <span>Tamanho recomendado: 1920x600px</span>
                  </div>
                </div>
              </div>

              <div className={styles.uploadGroup}>
                <label>Logo da Empresa</label>
                <div className={styles.logoRow}>
                  <div className={styles.logoCircle}>
                    <Camera size={24} />
                  </div>
                  <div className={styles.logoInfo}>
                    <button className={styles.uploadMiniBtn}>Alterar Logo</button>
                    <p>PNG com fundo transparente, min. 400x400px.</p>
                  </div>
                </div>
              </div>
            </section>
          )}

          {activeSection === 'info' && (
            <section className={styles.sectionCard}>
              <div className={styles.sectionHeader}>
                <Briefcase size={20} />
                <h2>Informações Básicas</h2>
              </div>
              
              <div className={styles.formGrid}>
                <div className={styles.field}>
                  <label>Razão Social / Nome Fantasia</label>
                  <input 
                    type="text" 
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                </div>
                <div className={styles.field}>
                  <label>Slogan Estratégico</label>
                  <input 
                    type="text" 
                    value={formData.slogan}
                    onChange={(e) => setFormData({...formData, slogan: e.target.value})}
                  />
                </div>
                <div className={styles.field}>
                  <label>Website Oficial</label>
                  <div className={styles.inputWithIcon}>
                    <Globe size={16} />
                    <input 
                      type="text" 
                      value={formData.website}
                      onChange={(e) => setFormData({...formData, website: e.target.value})}
                    />
                  </div>
                </div>
                <div className={styles.field}>
                  <label>Sede Principal</label>
                  <div className={styles.inputWithIcon}>
                    <MapPin size={16} />
                    <input 
                      type="text" 
                      value={formData.location}
                      onChange={(e) => setFormData({...formData, location: e.target.value})}
                    />
                  </div>
                </div>
              </div>

              <div className={styles.field} style={{ marginTop: '2rem' }}>
                <label>Bio / Sobre a Operação</label>
                <textarea 
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  rows={5}
                />
              </div>

              <div className={styles.formatsGroup}>
                <label>Formatos & Canais de Atuação</label>
                <div className={styles.tagsGrid}>
                  {Object.entries(formats).map(([format, isSelected]) => (
                    <button 
                      key={format} 
                      className={`${styles.formatTag} ${isSelected ? styles.formatActive : ''}`}
                      onClick={() => handleFormatChange(format)}
                    >
                      {format}
                    </button>
                  ))}
                  <button className={styles.addTagBtn}>
                    <Plus size={14} />
                    Outro
                  </button>
                </div>
              </div>
            </section>
          )}

          {activeSection === 'audiencia' && (
            <section className={styles.sectionCard}>
              <div className={styles.sectionHeader}>
                <Target size={20} />
                <h2>Audiência & Alcance</h2>
              </div>
              
              <div className={styles.statsEditorGrid}>
                <div className={styles.field}>
                  <label>Alcance Mensal (Impactos/Views)</label>
                  <div className={styles.statInput}>
                    <BarChart size={18} />
                    <input 
                      type="text" 
                      value={formData.monthlyReach}
                      onChange={(e) => setFormData({...formData, monthlyReach: e.target.value})}
                    />
                  </div>
                </div>
                <div className={styles.field}>
                  <label>Perfil do Público</label>
                  <select
                    value={formData.audienceType}
                    onChange={(e) => setFormData({...formData, audienceType: e.target.value})}
                  >
                    <option>B2C - Público Geral</option>
                    <option>B2C - High End (A/B)</option>
                    <option>B2B - Corporativo</option>
                    <option>Nicho Específico</option>
                  </select>
                </div>
              </div>

              <div className={styles.field} style={{ marginTop: '2rem' }}>
                <label>Foco Geográfico</label>
                <div className={styles.regionsGrid}>
                  {['Nacional', 'São Paulo', 'Rio de Janeiro', 'Sul', 'Nordeste'].map(r => (
                    <div key={r} className={styles.regionItem}>
                      <input type="checkbox" checked={formData.regions === r} readOnly />
                      <span>{r}</span>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}

          {activeSection === 'portfolio' && (
            <section className={styles.sectionCard}>
              <div className={styles.sectionHeader}>
                <Layout size={20} />
                <h2>Portfólio & Cases de Sucesso</h2>
              </div>
              
              <div className={styles.portfolioEmpty}>
                <div className={styles.emptyIcon}>
                  <Briefcase size={32} />
                </div>
                <h3>Seu portfólio está vazio</h3>
                <p>Adicione cases, fotos de campanhas ou PDF do seu Media Kit completo para atrair mais parceiros.</p>
                <button className={styles.addPortfolioBtn}>
                  <Plus size={18} />
                  <span>Adicionar Primeiro Case</span>
                </button>
              </div>
            </section>
          )}

          {activeSection === 'conexoes' && (
            <section className={styles.sectionCard}>
              <div className={styles.sectionHeader}>
                <Globe size={20} />
                <h2>Conexões & Aplicativos Externos</h2>
              </div>
              <p className={styles.sectionDescription}>
                Conecte suas contas para que o HOAS possa gerar links de reunião, sincronizar calendários e automatizar fluxos de trabalho.
              </p>

              <div className={styles.integrationsGrid}>
                <div className={styles.integrationCard}>
                  <div className={styles.integrationInfo}>
                    <div className={styles.integrationIcon} style={{ background: '#4285F4' }}>
                      <Globe size={20} color="white" />
                    </div>
                    <div>
                      <h3>Google Meet & Calendar</h3>
                      <p>Sincronize sua agenda e gere links do Meet automaticamente.</p>
                    </div>
                  </div>
                  <button 
                    className={`${styles.connectBtn} ${connectedApps.includes('google') ? styles.connected : ''}`}
                    onClick={() => handleConnect('google')}
                    disabled={connectingApp === 'google'}
                  >
                    {connectingApp === 'google' ? 'Conectando...' : connectedApps.includes('google') ? 'Conectado' : 'Conectar'}
                  </button>
                </div>

                <div className={styles.integrationCard}>
                  <div className={styles.integrationInfo}>
                    <div className={styles.integrationIcon} style={{ background: '#2D8CFF' }}>
                      <Video size={20} color="white" />
                    </div>
                    <div>
                      <h3>Zoom Meetings</h3>
                      <p>Conecte sua conta Zoom para agendamentos diretos pelo HOAS.</p>
                    </div>
                  </div>
                  <button 
                    className={`${styles.connectBtn} ${connectedApps.includes('zoom') ? styles.connected : ''}`}
                    onClick={() => handleConnect('zoom')}
                    disabled={connectingApp === 'zoom'}
                  >
                    {connectingApp === 'zoom' ? 'Conectando...' : connectedApps.includes('zoom') ? 'Conectado' : 'Conectar'}
                  </button>
                </div>

                <div className={styles.integrationCard}>
                  <div className={styles.integrationInfo}>
                    <div className={styles.integrationIcon} style={{ background: '#0078D4' }}>
                      <Mail size={20} color="white" />
                    </div>
                    <div>
                      <h3>Microsoft Teams</h3>
                      <p>Integre com o ecossistema Office 365 para reuniões corporativas.</p>
                    </div>
                  </div>
                  <button 
                    className={`${styles.connectBtn} ${connectedApps.includes('teams') ? styles.connected : ''}`}
                    onClick={() => handleConnect('teams')}
                    disabled={connectingApp === 'teams'}
                  >
                    {connectingApp === 'teams' ? 'Conectando...' : connectedApps.includes('teams') ? 'Conectado' : 'Conectar'}
                  </button>
                </div>
              </div>
            </section>
          )}
        </main>
      </div>
    </div>
  );
}
