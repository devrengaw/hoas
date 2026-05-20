'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Building2, Globe, Phone, MapPin, Target, 
  Rocket, ChevronRight, Check, Upload, ArrowRight
} from 'lucide-react';
import styles from './page.module.css';
import { supabase } from '@/lib/supabase';
import PlexusBackground from '@/components/PlexusBackground';

export default function OnboardingPage() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  const [company, setCompany] = useState<any>(null);
  const [selectedMediaTypes, setSelectedMediaTypes] = useState<string[]>([]);
  
  const [formData, setFormData] = useState({
    description: '',
    website: '',
    phone: '',
    city: '',
    state: '',
    media_type: '',
    reach_estimate: '',
    specialties: [] as string[],
    is_public: true
  });

  const toggleMediaType = (type: string) => {
    setSelectedMediaTypes(prev => {
      const next = prev.includes(type) 
        ? prev.filter(t => t !== type) 
        : [...prev, type];
      
      // Keep formData.media_type in sync
      setFormData(f => ({ ...f, media_type: next.join(', ') }));
      return next;
    });
  };

  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
        return;
      }

      const { data: profileData } = await supabase
        .from('profiles')
        .select('*, companies(*)')
        .eq('id', user.id)
        .single();

      if (profileData?.onboarding_completed) {
        // router.push('/dashboard');
        // Keep for testing
      }

      setProfile(profileData);
      if (profileData?.companies) {
        setCompany(profileData.companies);
        const initialMediaType = profileData.companies.media_type || profileData.media_type || '';
        setFormData(prev => ({
          ...prev,
          description: profileData.companies.description || '',
          website: profileData.companies.website || '',
          phone: profileData.companies.phone || '',
          city: profileData.companies.city || '',
          state: profileData.companies.state || '',
          media_type: initialMediaType,
        }));

        if (initialMediaType) {
          setSelectedMediaTypes(
            initialMediaType.split(', ')
              .map((s: string) => s.trim())
              .filter(Boolean)
          );
        }
      }
    };

    checkUser();
  }, [router]);

  const handleComplete = async () => {
    setLoading(true);
    try {
      // 1. Update Company
      if (profile?.company_id) {
        const { error: companyError } = await supabase
          .from('companies')
          .update({
            description: formData.description,
            website: formData.website,
            phone: formData.phone,
            city: formData.city,
            state: formData.state,
            media_type: formData.media_type,
            reach_estimate: formData.reach_estimate,
            specialties: formData.specialties,
            is_public: formData.is_public
          })
          .eq('id', profile.company_id);

        if (companyError) throw companyError;
      }

      // 2. Mark onboarding as completed
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ onboarding_completed: true })
        .eq('id', profile.id);

      if (profileError) throw profileError;

      // 3. Redirect
      const basePath = profile?.role === 'agency' ? '/dashboard/agency' : profile?.role === 'client' ? '/dashboard/client' : '/dashboard';
      router.push(basePath);
    } catch (err) {
      console.error('Onboarding error:', err);
      alert('Erro ao salvar dados. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleSkip = async () => {
    setLoading(true);
    try {
      // Mark onboarding as completed even if data is missing
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ onboarding_completed: true })
        .eq('id', profile.id);

      if (profileError) throw profileError;

      const basePath = profile?.role === 'agency' ? '/dashboard/agency' : profile?.role === 'client' ? '/dashboard/client' : '/dashboard';
      router.push(basePath);
    } catch (err) {
      console.error('Skip onboarding error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!profile) return <div className={styles.loadingContainer}>Carregando...</div>;

  return (
    <main className={styles.container}>
      <PlexusBackground />
      
      <div className={styles.content}>
        <div className={styles.steps}>
          <div className={`${styles.stepIndicator} ${step >= 1 ? styles.active : ''}`}>
            <span className={styles.stepNum}>{step > 1 ? <Check size={14} /> : '1'}</span>
            <span className={styles.stepLabel}>Perfil da Empresa</span>
          </div>
          <div className={styles.stepLine} />
          <div className={`${styles.stepIndicator} ${step >= 2 ? styles.active : ''}`}>
            <span className={styles.stepNum}>{step > 2 ? <Check size={14} /> : '2'}</span>
            <span className={styles.stepLabel}>Detalhes do Negócio</span>
          </div>
          <div className={styles.stepLine} />
          <div className={`${styles.stepIndicator} ${step >= 3 ? styles.active : ''}`}>
            <span className={styles.stepNum}>3</span>
            <span className={styles.stepLabel}>Finalizar</span>
          </div>
        </div>

        <div className={styles.card}>
          {step === 1 && (
            <div className={styles.stepContent}>
              <div className={styles.stepHeader}>
                <Building2 size={32} color="var(--primary)" />
                <h1>Vamos configurar o perfil da {company?.name || 'sua empresa'}</h1>
                <p>Essas informações ajudarão outros membros do ecossistema a conhecerem seu negócio.</p>
              </div>

              <div className={styles.formGrid}>
                <div className={styles.field}>
                  <label>Descrição da Empresa</label>
                  <textarea 
                    placeholder="Conte um pouco sobre a história e atuação da empresa..."
                    value={formData.description}
                    onChange={e => setFormData({...formData, description: e.target.value})}
                  />
                </div>
                
                <div className={styles.field}>
                  <label>Website</label>
                  <div className={styles.inputWithIcon}>
                    <Globe size={16} />
                    <input 
                      type="url" 
                      placeholder="https://suaempresa.com.br"
                      value={formData.website}
                      onChange={e => setFormData({...formData, website: e.target.value})}
                    />
                  </div>
                </div>

                <div className={styles.field}>
                  <label>Telefone de Contato</label>
                  <div className={styles.inputWithIcon}>
                    <Phone size={16} />
                    <input 
                      type="tel" 
                      placeholder="(00) 00000-0000"
                      value={formData.phone}
                      onChange={e => setFormData({...formData, phone: e.target.value})}
                    />
                  </div>
                </div>
              </div>

              <div className={styles.buttonRow}>
                <button className={styles.skipBtn} onClick={handleSkip}>Pular e configurar depois</button>
                <button className={styles.nextBtn} onClick={() => setStep(2)}>
                  Próximo Passo <ChevronRight size={18} />
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className={styles.stepContent}>
              <div className={styles.stepHeader}>
                <Target size={32} color="var(--primary)" />
                <h1>Detalhes de Atuação</h1>
                <p>Personalize sua presença no marketplace do HOAS.</p>
              </div>

              <div className={styles.formGrid}>
                <div className={styles.fieldRow}>
                  <div className={styles.field}>
                    <label>Cidade</label>
                    <input 
                      type="text" 
                      placeholder="Ex: São Paulo"
                      value={formData.city}
                      onChange={e => setFormData({...formData, city: e.target.value})}
                    />
                  </div>
                  <div className={styles.field}>
                    <label>Estado</label>
                    <input 
                      type="text" 
                      placeholder="Ex: SP"
                      value={formData.state}
                      onChange={e => setFormData({...formData, state: e.target.value})}
                    />
                  </div>
                </div>

                {profile.role === 'vehicle' && (
                  <>
                    <div className={styles.field} style={{ gridColumn: 'span 2' }}>
                      <label>Tipos de Mídia (Escolha uma ou mais)</label>
                      <div className={styles.mediaTypesGrid}>
                        {[
                          'TV / Vídeo',
                          'Digital / Portais',
                          'OOH / OOH Digital',
                          'Rádio / Áudio',
                          'Mídia Impressa (Jornal e Revista)',
                          'Streaming'
                        ].map((type) => {
                          const isSelected = selectedMediaTypes.includes(type);
                          return (
                            <div
                              key={type}
                              className={`${styles.mediaTypeCard} ${isSelected ? styles.mediaTypeCardSelected : ''}`}
                              onClick={() => toggleMediaType(type)}
                            >
                              <div
                                style={{
                                  width: '20px',
                                  height: '20px',
                                  border: '2px solid ' + (isSelected ? 'var(--primary)' : 'rgba(255,255,255,0.2)'),
                                  borderRadius: '6px',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  background: isSelected ? 'var(--primary)' : 'transparent',
                                  transition: 'all 0.2s'
                                }}
                              >
                                {isSelected && <Check size={14} strokeWidth={3} color="white" />}
                              </div>
                              <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>{type}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                    <div className={styles.field}>
                      <label>Estimativa de Alcance (Mensal)</label>
                      <input 
                        type="text" 
                        placeholder="Ex: 5 milhões de impactos"
                        value={formData.reach_estimate}
                        onChange={e => setFormData({...formData, reach_estimate: e.target.value})}
                      />
                    </div>
                  </>
                )}

                <div className={styles.field}>
                  <label className={styles.checkboxLabel}>
                    <input 
                      type="checkbox" 
                      checked={formData.is_public}
                      onChange={e => setFormData({...formData, is_public: e.target.checked})}
                    />
                    <span>Tornar perfil público no Marketplace/Diretório</span>
                  </label>
                </div>
              </div>

              <div className={styles.buttonRow}>
                <button className={styles.backBtn} onClick={() => setStep(1)}>Voltar</button>
                <button className={styles.skipBtn} onClick={handleSkip}>Pular Etapa</button>
                <button className={styles.nextBtn} onClick={() => setStep(3)}>Próximo Passo <ChevronRight size={18} /></button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className={styles.stepContent}>
              <div className={styles.stepHeader}>
                <Rocket size={48} className={styles.rocketIcon} />
                <h1>Tudo pronto!</h1>
                <p>Sua empresa agora faz parte oficial do ecossistema HOAS.</p>
              </div>

              <div className={styles.summaryCard}>
                <div className={styles.summaryItem}>
                  <Check size={20} color="var(--secondary)" />
                  <span>Perfil da empresa configurado</span>
                </div>
                <div className={styles.summaryItem}>
                  <Check size={20} color="var(--secondary)" />
                  <span>{formData.is_public ? 'Visível no Marketplace' : 'Perfil privado configurado'}</span>
                </div>
                <div className={styles.summaryItem}>
                  <Check size={20} color="var(--secondary)" />
                  <span>Acesso total ao dashboard liberado</span>
                </div>
              </div>

              <button className={styles.finishBtn} onClick={handleComplete} disabled={loading}>
                {loading ? 'Finalizando...' : 'Acessar Plataforma'} <ArrowRight size={18} />
              </button>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
