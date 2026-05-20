'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Building2, Users, Briefcase, ChevronRight, ChevronLeft, 
  Check, Sparkles, ShieldCheck, Image as ImageIcon 
} from 'lucide-react';
import styles from './page.module.css';
import { supabase } from '@/lib/supabase';
import PlexusBackground from '@/components/PlexusBackground';

type Role = 'vehicle' | 'agency' | 'client' | null;

export default function RegisterPage() {
  const [role, setRole] = useState<Role>(null);
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    cnpj: '',
    password: '',
    confirmPassword: '',
    rolePosition: 'Diretor de Mídia',
    objective: 'Brand Awareness'
  });

  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreviewUrl, setLogoPreviewUrl] = useState<string | null>(null);
  const [selectedMediaTypes, setSelectedMediaTypes] = useState<string[]>(['TV / Vídeo']);

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setError('A imagem do logo deve ter no máximo 2MB.');
        return;
      }
      setLogoFile(file);
      const objectUrl = URL.createObjectURL(file);
      setLogoPreviewUrl(objectUrl);
    }
  };

  const toggleMediaType = (type: string) => {
    setSelectedMediaTypes(prev => 
      prev.includes(type) 
        ? prev.filter(t => t !== type) 
        : [...prev, type]
    );
  };

  const router = useRouter();

  const formatCNPJ = (value: string) => {
    const digits = value.replace(/\D/g, '');
    return digits
      .replace(/^(\d{2})(\d)/, '$1.$2')
      .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
      .replace(/\.(\d{3})(\d)/, '.$1/$2')
      .replace(/(\d{4})(\d)/, '$1-$2')
      .substring(0, 18);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (formData.password !== formData.confirmPassword) {
      setError('As senhas não coincidem.');
      setLoading(false);
      return;
    }

    try {
      const mediaTypesString = role === 'vehicle' ? selectedMediaTypes.join(', ') : null;

      const { data, error: signUpError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.name,
            company_name: formData.company,
            cnpj: formData.cnpj,
            role: role,
            media_type: mediaTypesString,
            position: role === 'agency' ? formData.rolePosition : null,
            objective: role === 'client' ? formData.objective : null
          }
        }
      });

      if (signUpError) throw signUpError;

      if (data.user) {
        // Logo upload logic
        let logoUrl = null;
        if (logoFile) {
          try {
            const fileExt = logoFile.name.split('.').pop();
            const fileName = `${data.user.id}-${Math.random().toString(36).substring(2)}.${fileExt}`;
            const filePath = `company-logos/${fileName}`;

            const { error: uploadError } = await supabase.storage
              .from('logos')
              .upload(filePath, logoFile);

            if (uploadError) {
              console.error('Error uploading logo:', uploadError.message);
            } else {
              const { data: publicUrlData } = supabase.storage
                .from('logos')
                .getPublicUrl(filePath);
              logoUrl = publicUrlData?.publicUrl || null;
            }
          } catch (uploadErr) {
            console.error('Failed to upload company logo:', uploadErr);
          }
        }

        // 1. Create Company first
        const { data: companyData, error: companyError } = await supabase
          .from('companies')
          .insert([
            {
              name: formData.company,
              type: role,
              is_public: false, // Start as private until onboarding completes
              is_test: false, // Explicitly production
              logo_url: logoUrl,
              media_type: mediaTypesString
            }
          ])
          .select()
          .single();

        if (companyError) throw companyError;

        // 2. Create profile entry with company reference
        const { error: profileError } = await supabase.from('profiles').insert([
          {
            id: data.user.id,
            company_id: companyData.id,
            full_name: formData.name,
            role: role,
            email: formData.email,
            media_type: mediaTypesString,
            position: role === 'agency' ? formData.rolePosition : null,
            objective: role === 'client' ? formData.objective : null,
            avatar_url: logoUrl,
            onboarding_completed: false,
            is_master: true,
            is_test: false // Explicitly production
          }
        ]);
        
        if (profileError) throw profileError;
      }
      
      // Always redirect to onboarding for new registrations
      router.push('/onboarding');
    } catch (err: any) {
      setError(err.message || 'Erro ao realizar cadastro.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className={styles.container}>
      <PlexusBackground />
      <div className={styles.animatedBg}>
        <div className={styles.blob}></div>
        <div className={styles.blob}></div>
        <div className={styles.blob}></div>
        <div className={styles.blob}></div>
        <div className={styles.blob}></div>
      </div>

      <div className={styles.hero}>
        <div className={styles.logoWrapper}>
          <img src="/identidade visual/hoas_png.png" alt="HOAS Logo" className={styles.mainLogo} />
        </div>
        
        <div className={styles.card}>
          {step === 1 ? (
            <div className={styles.roleSelection}>
              <h1>Bem-vindo</h1>
              <p>Selecione o seu perfil para personalizarmos sua experiência no ecossistema.</p>
              
              <div className={styles.roleGrid}>
                <button 
                  className={`${styles.roleCard} ${role === 'vehicle' ? styles.selected : ''}`}
                  onClick={() => setRole('vehicle')}
                >
                  <div className={styles.roleIcon}><Building2 size={32} /></div>
                  <h3>Sou Veículo</h3>
                  <p>Para canais de TV, Rádios, Portais e empresas de OOH.</p>
                </button>

                <button 
                  className={`${styles.roleCard} ${role === 'agency' ? styles.selected : ''}`}
                  onClick={() => setRole('agency')}
                >
                  <div className={styles.roleIcon}><Users size={32} /></div>
                  <h3>Sou Agência</h3>
                  <p>Para profissionais de Mídia, Planejamento e Estratégia.</p>
                </button>

                <button 
                  className={`${styles.roleCard} ${role === 'client' ? styles.selected : ''}`}
                  onClick={() => setRole('client')}
                >
                  <div className={styles.roleIcon}><Briefcase size={32} /></div>
                  <h3>Sou Anunciante / Cliente</h3>
                  <p>Marcas que buscam gerenciar seus investimentos e resultados.</p>
                </button>
              </div>

              <button 
                className={styles.nextBtn} 
                disabled={!role}
                onClick={() => setStep(2)}
              >
                Continuar para o Cadastro <ChevronRight size={20} />
              </button>
            </div>
          ) : (
            <form className={styles.form} onSubmit={handleRegister}>
              <header className={styles.formHeader}>
                <button type="button" className={styles.backBtn} onClick={() => setStep(1)} disabled={loading}>
                  <ChevronLeft size={18} /> Voltar
                </button>
                <h2>Cadastro de {role === 'vehicle' ? 'Veículo' : role === 'agency' ? 'Agência' : 'Cliente'}</h2>
              </header>

              {error && <div className={styles.errorMessage}>{error}</div>}

              <div className={styles.logoUploadSection}>
                <div className={styles.logoPreview}>
                  {logoPreviewUrl ? (
                    <img src={logoPreviewUrl} alt="Logo Preview" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '16px' }} />
                  ) : (
                    <Building2 size={32} />
                  )}
                </div>
                <div className={styles.uploadInfo}>
                  <label>Logo da Empresa</label>
                  <input type="file" accept="image/*" className={styles.fileInput} id="logo-upload" onChange={handleLogoChange} />
                  <label htmlFor="logo-upload" className={styles.uploadBtn}>
                    <ImageIcon size={16} /> Selecionar Logo
                  </label>
                  <p>JPG, PNG ou SVG. Máx 2MB.</p>
                </div>
              </div>

              <div className={styles.formGrid}>
                <div className={styles.field}>
                  <label>Nome Completo</label>
                  <input type="text" placeholder="Seu nome" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
                </div>
                <div className={styles.field}>
                  <label>E-mail Corporativo</label>
                  <input type="email" placeholder="nome@empresa.com.br" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} required />
                </div>
                
                <div className={styles.field}>
                  <label>Empresa / {role === 'agency' ? 'Agência' : 'Veículo'}</label>
                  <input type="text" placeholder="Nome da empresa" value={formData.company} onChange={e => setFormData({...formData, company: e.target.value})} required />
                </div>
                
                <div className={styles.field}>
                  <label>CNPJ</label>
                  <input 
                    type="text" 
                    placeholder="00.000.000/0000-00" 
                    value={formData.cnpj} 
                    onChange={e => setFormData({...formData, cnpj: formatCNPJ(e.target.value)})} 
                    maxLength={18}
                    required 
                  />
                </div>

                {role === 'vehicle' && (
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
                )}

                {role === 'agency' && (
                  <div className={styles.field}>
                    <label>Cargo / Função</label>
                    <select value={formData.rolePosition} onChange={e => setFormData({...formData, rolePosition: e.target.value})}>
                      <option>Diretor de Mídia</option>
                      <option>Gerente de Mídia</option>
                      <option>Planejamento</option>
                      <option>Comprador</option>
                    </select>
                  </div>
                )}

                {role === 'client' && (
                  <div className={styles.field}>
                    <label>Principal Objetivo</label>
                    <select value={formData.objective} onChange={e => setFormData({...formData, objective: e.target.value})}>
                      <option>Brand Awareness</option>
                      <option>Performance / Vendas</option>
                      <option>Lançamento de Produto</option>
                      <option>Gestão de Verba Anual</option>
                    </select>
                  </div>
                )}

                <div className={styles.field}>
                  <label>Sua Senha</label>
                  <input type="password" placeholder="••••••••" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} required />
                </div>
                <div className={styles.field}>
                  <label>Confirme sua Senha</label>
                  <input type="password" placeholder="••••••••" value={formData.confirmPassword} onChange={e => setFormData({...formData, confirmPassword: e.target.value})} required />
                </div>
              </div>

              <div className={styles.terms}>
                <div className={styles.ndaBadge}>
                  <ShieldCheck size={16} />
                  <span>NDA Obrigatório para acesso</span>
                </div>
                <label className={styles.checkbox}>
                  <input type="checkbox" required />
                  <span>Aceito os Termos de Uso e Política de Privacidade do HOAS.</span>
                </label>
              </div>

              <button type="submit" className={styles.submitBtn} disabled={loading}>
                <Sparkles size={18} /> {loading ? 'Criando conta...' : 'Criar Minha Conta e Acessar'}
              </button>
            </form>
          )}
        </div>

        <p className={styles.footer}>
          Já tem uma conta? <Link href="/login">Fazer login na plataforma</Link>
        </p>
      </div>
      
      <div className={styles.backgroundGlow} />
    </main>
  );
}
