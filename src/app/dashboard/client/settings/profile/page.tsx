'use client';

import React, { useState } from 'react';
import { Camera, Image as ImageIcon, Save, CheckCircle } from 'lucide-react';
import styles from './page.module.css';

export default function ProfilePage() {
  const [formData, setFormData] = useState({
    name: 'Grupo Bandeirantes',
    slogan: 'A emoção de viver o Brasil',
    category: 'TV / Vídeo',
    description: 'Um dos maiores conglomerados de mídia do Brasil, com alcance nacional em TV aberta, TV por assinatura, rádio e plataformas digitais. Foco em jornalismo, esporte e entretenimento de qualidade.',
    audienceType: 'B2C - Público Geral',
    monthlyReach: '45.000.000',
    regions: 'Nacional',
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

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate save
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div>
          <h1>Meu Perfil (Media Kit)</h1>
          <p>Preencha as informações que serão exibidas para agências e clientes no Marketplace.</p>
        </div>
        <button className={styles.saveBtn} onClick={handleSave}>
          {isSaved ? <CheckCircle size={18} /> : <Save size={18} />}
          <span>{isSaved ? 'Salvo!' : 'Salvar Alterações'}</span>
        </button>
      </header>

      <div className={styles.content}>
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Identidade Visual</h2>
          
          <div className={styles.coverUpload}>
            <ImageIcon size={32} />
            <p>Clique para enviar a imagem de capa (1200x400px)</p>
          </div>

          <div className={styles.logoUploadContainer}>
            <div className={styles.logoUpload}>
              <Camera size={24} />
              <span>Logo</span>
            </div>
            <div className={styles.logoHelp}>
              Recomendado: 400x400px, fundo transparente (PNG)
            </div>
          </div>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Informações Básicas</h2>
          
          <div className={styles.grid}>
            <div className={styles.field}>
              <label>Nome do Veículo / Empresa</label>
              <input 
                type="text" 
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
            </div>
            <div className={styles.field}>
              <label>Slogan (Opcional)</label>
              <input 
                type="text" 
                value={formData.slogan}
                onChange={(e) => setFormData({...formData, slogan: e.target.value})}
              />
            </div>
            <div className={styles.field}>
              <label>Categoria Principal</label>
              <select 
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
              >
                <option>TV / Vídeo</option>
                <option>Digital</option>
                <option>OOH</option>
                <option>Audio / Rádio</option>
                <option>Impresso</option>
                <option>Retail Media</option>
              </select>
            </div>
          </div>

          <div className={styles.field} style={{ marginTop: '1.5rem' }}>
            <label>Sobre a Empresa</label>
            <textarea 
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              placeholder="Descreva o foco, a história e os diferenciais do seu veículo..."
            />
            <span>Aparecerá na página principal do seu Media Kit.</span>
          </div>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Audiência e Alcance</h2>
          
          <div className={styles.grid}>
            <div className={styles.field}>
              <label>Público-Alvo Principal</label>
              <select
                value={formData.audienceType}
                onChange={(e) => setFormData({...formData, audienceType: e.target.value})}
              >
                <option>B2C - Público Geral</option>
                <option>B2C - Classes A/B</option>
                <option>B2C - Classes C/D</option>
                <option>B2B - Executivos e Empresas</option>
                <option>Nicho (Especifique na descrição)</option>
              </select>
            </div>
            <div className={styles.field}>
              <label>Alcance Mensal Estimado</label>
              <input 
                type="text" 
                value={formData.monthlyReach}
                onChange={(e) => setFormData({...formData, monthlyReach: e.target.value})}
                placeholder="Ex: 10.000.000 de impactos"
              />
            </div>
            <div className={styles.field}>
              <label>Região de Cobertura</label>
              <select
                value={formData.regions}
                onChange={(e) => setFormData({...formData, regions: e.target.value})}
              >
                <option>Nacional</option>
                <option>Sudeste</option>
                <option>Sul</option>
                <option>Nordeste</option>
                <option>Centro-Oeste</option>
                <option>Norte</option>
                <option>Foco Estadual / Regional</option>
              </select>
            </div>
          </div>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Formatos de Mídia Oferecidos</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
            Selecione os formatos que seu veículo comercializa para que as agências possam encontrar você pelos filtros corretos.
          </p>

          <div className={styles.tagsGrid}>
            {Object.entries(formats).map(([format, isSelected]) => (
              <label 
                key={format} 
                className={`${styles.tagCheckbox} ${isSelected ? styles.active : ''}`}
              >
                <input 
                  type="checkbox" 
                  checked={isSelected}
                  onChange={() => handleFormatChange(format)}
                />
                <span>{format}</span>
              </label>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
