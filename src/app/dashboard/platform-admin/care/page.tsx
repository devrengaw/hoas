'use client';

import React, { useState } from 'react';
import { 
  Heart, Save, Plus, Trash2, Edit3, Image as ImageIcon, 
  Eye, Globe, ShieldCheck, Zap, X, AlignLeft, FileText
} from 'lucide-react';
import styles from './page.module.css';

export default function PlatformCare() {
  const [articles, setArticles] = useState<any[]>([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState<any>(null);
  const [formTitle, setFormTitle] = useState('');

  const handleOpenModal = (article: any = null) => {
    if (article) {
      setEditingArticle(article);
      setFormTitle(article.title);
    } else {
      setEditingArticle(null);
      setFormTitle('');
    }
    setIsModalOpen(true);
  };

  const saveArticle = () => {
    if (!formTitle) return;
    if (editingArticle) {
      setArticles(prev => prev.map(a => a.id === editingArticle.id ? { ...a, title: formTitle, lastUpdate: 'Agora' } : a));
    } else {
      setArticles([...articles, { 
        id: Date.now(), 
        title: formTitle, 
        category: 'Novo', 
        status: 'Rascunho', 
        views: 0, 
        lastUpdate: 'Agora' 
      }]);
    }
    setIsModalOpen(false);
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div>
          <div className={styles.adminBadge}>
            <Heart size={14} />
            <span>Gestão de Conteúdo</span>
          </div>
          <h1>HOAS Care & Curadoria</h1>
          <p>Crie manuais, artigos e guias que serão exibidos para todos os usuários da plataforma.</p>
        </div>
        <button className={styles.addBtn} onClick={() => handleOpenModal()}><Plus size={18} /> Novo Conteúdo</button>
      </header>

      <div className={styles.statsRow}>
        <div className={styles.miniStat}>
          <strong>0</strong>
          <span>Artigos Ativos</span>
        </div>
        <div className={styles.miniStat}>
          <strong>0</strong>
          <span>Visualizações Totais</span>
        </div>
        <div className={styles.miniStat}>
          <strong>0%</strong>
          <span>Taxa de Aprovação</span>
        </div>
      </div>

      <div className={styles.mainBox}>
        <div className={styles.listHeader}>
          <span>Conteúdo</span>
          <span>Categoria</span>
          <span>Status</span>
          <span>Acessos</span>
          <span>Ações</span>
        </div>

        <div className={styles.articleList}>
          {articles.map(article => (
            <div key={article.id} className={styles.articleItem}>
              <div className={styles.articleMain}>
                <div className={styles.iconWrapper}><FileText size={20} /></div>
                <div>
                  <strong>{article.title}</strong>
                  <span>Editado {article.lastUpdate}</span>
                </div>
              </div>
              <div className={styles.categoryTag}>{article.category}</div>
              <div className={article.status === 'Publicado' ? styles.statusPub : styles.statusDraft}>
                {article.status}
              </div>
              <div className={styles.viewsCount}><Eye size={14} /> {article.views}</div>
              <div className={styles.actions}>
                <button title="Editar" onClick={() => handleOpenModal(article)}><Edit3 size={16} /></button>
                <button title="Excluir" className={styles.deleteBtn}><Trash2 size={16} /></button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Content Modal */}
      {isModalOpen && (
        <div className={styles.modalOverlay} onClick={() => setIsModalOpen(false)}>
          <div className={styles.modal} onClick={e => e.stopPropagation()}>
            <button className={styles.closeBtn} onClick={() => setIsModalOpen(false)}><X size={20} /></button>
            <div className={styles.modalHeader}>
              <h2>{editingArticle ? 'Editar Conteúdo' : 'Criar Novo Conteúdo'}</h2>
              <p>O conteúdo será revisado pela diretoria antes da publicação global.</p>
            </div>
            
            <div className={styles.form}>
              <div className={styles.inputGroup}>
                <label>Título do Artigo / Manual</label>
                <input 
                  type="text" 
                  value={formTitle} 
                  onChange={e => setFormTitle(e.target.value)} 
                  placeholder="Ex: Como configurar sua carteira digital"
                />
              </div>
              <div className={styles.inputGroup}>
                <label>Categoria</label>
                <select>
                  <option>Manual</option>
                  <option>Bem-estar</option>
                  <option>Insights</option>
                  <option>Comercial</option>
                </select>
              </div>
              <div className={styles.editorPlaceholder}>
                <AlignLeft size={32} />
                <p>O editor de texto enriquecido será carregado aqui.</p>
              </div>
              <button className={styles.primaryBtn} onClick={saveArticle}>
                <Save size={18} /> {editingArticle ? 'Salvar Alterações' : 'Publicar Rascunho'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
