'use client';

import React, { useState } from 'react';
import { Search, Filter, ShoppingBag, Sparkles, Building2, Target, DollarSign, ArrowRight, Star, MapPin, Eye, ExternalLink, SlidersHorizontal } from 'lucide-react';
import styles from './page.module.css';

export default function AgencyMarketplacePage() {
  const [activeTab, setActiveTab] = useState<'vehicles' | 'clients'>('vehicles');
  const [showFilters, setShowFilters] = useState(false);

  const vehicleProjects = [
    {
      id: 1,
      title: "Caminhos do Sol - Verão 2026",
      vehicle: "TV Alpha",
      category: "Digital / OOH",
      price: "R$ 50k",
      image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=300"
    },
    {
      id: 2,
      title: "Podcast Night Show",
      vehicle: "Rede Audio",
      category: "Podcast / Digital",
      price: "R$ 15k",
      image: "https://images.unsplash.com/photo-1478737270239-2f02b77fc618?auto=format&fit=crop&q=80&w=300"
    }
  ];

  const clientNecessities = [
    {
      id: 1,
      client: "Coca-Cola Brasil",
      title: "Campanha Natal Mágico 2026",
      budget: "R$ 1M - 2M",
      description: "Buscamos agência para experiência imersiva de Natal em 15 capitais.",
      match: 98,
      tags: ["Digital", "OOH"]
    },
    {
      id: 2,
      client: "Samsung Brasil",
      title: "Lançamento Galaxy S27",
      budget: "R$ 500k - 1M",
      description: "Foco em tecnologia e grandes eventos de lançamento simultâneos.",
      match: 85,
      tags: ["PR", "Social Media"]
    }
  ];

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div>
          <h1>Marketplace Unificado</h1>
          <p>Explore projetos de veículos ou atenda necessidades diretas de anunciantes.</p>
        </div>
      </header>

      <div className={styles.topActions}>
        <div className={styles.tabContainer}>
          <button 
            className={`${styles.tab} ${activeTab === 'vehicles' ? styles.activeTab : ''}`}
            onClick={() => setActiveTab('vehicles')}
          >
            <ShoppingBag size={18} />
            <span>Marketplace de Veículos</span>
          </button>
          <button 
            className={`${styles.tab} ${activeTab === 'clients' ? styles.activeTab : ''}`}
            onClick={() => setActiveTab('clients')}
          >
            <Sparkles size={18} />
            <span>Necessidades de Clientes</span>
          </button>
        </div>
      </div>

      <div className={styles.searchSection}>
        <div className={styles.controls}>
          <div className={styles.searchBox}>
            <Search size={18} />
            <input type="text" placeholder={`Buscar no marketplace de ${activeTab === 'vehicles' ? 'veículos' : 'clientes'}...`} />
          </div>
          <button 
            className={`${styles.filterBtn} ${showFilters ? styles.filterBtnActive : ''}`}
            onClick={() => setShowFilters(!showFilters)}
          >
            <SlidersHorizontal size={18} /> 
            Filtros
          </button>
        </div>

        {showFilters && (
          <div className={styles.filterBar + " animate-fade-in"}>
            {activeTab === 'vehicles' ? (
              <>
                <div className={styles.filterGroup}>
                  <label>Tipo de Mídia</label>
                  <select>
                    <option>Todos</option>
                    <option>TV / Vídeo</option>
                    <option>Digital</option>
                    <option>OOH</option>
                    <option>Podcast / Audio</option>
                  </select>
                </div>
                <div className={styles.filterGroup}>
                  <label>Investimento</label>
                  <select>
                    <option>Todos</option>
                    <option>Até R$ 10k</option>
                    <option>R$ 10k - R$ 50k</option>
                    <option>Acima de R$ 50k</option>
                  </select>
                </div>
                <div className={styles.filterGroup}>
                  <label>Praça / Região</label>
                  <select>
                    <option>Nacional</option>
                    <option>Sudeste</option>
                    <option>Sul</option>
                    <option>Nordeste</option>
                  </select>
                </div>
              </>
            ) : (
              <>
                <div className={styles.filterGroup}>
                  <label>Objetivo</label>
                  <select>
                    <option>Todos</option>
                    <option>Branding</option>
                    <option>Lançamento</option>
                    <option>Performance</option>
                  </select>
                </div>
                <div className={styles.filterGroup}>
                  <label>Match IA</label>
                  <select>
                    <option>Acima de 90%</option>
                    <option>Acima de 70%</option>
                    <option>Todos</option>
                  </select>
                </div>
                <div className={styles.filterGroup}>
                  <label>Segmento do Cliente</label>
                  <select>
                    <option>Bens de Consumo</option>
                    <option>Tecnologia</option>
                    <option>Varejo</option>
                  </select>
                </div>
              </>
            )}
            <button className={styles.applyBtn}>Aplicar</button>
          </div>
        )}
      </div>

      {activeTab === 'vehicles' ? (
        <div className={styles.grid}>
          {vehicleProjects.map((p) => (
            <div key={p.id} className={styles.vehicleCard}>
              <div className={styles.cardImage}>
                <img src={p.image} alt={p.title} />
                <div className={styles.priceTag}>{p.price}</div>
              </div>
              <div className={styles.cardContent}>
                <div className={styles.vehicleInfo}>
                  <Building2 size={14} />
                  <span>{p.vehicle}</span>
                </div>
                <h3>{p.title}</h3>
                <span className={styles.category}>{p.category}</span>
                <div className={styles.cardFooter}>
                  <button className={styles.viewBtn}>Ver Detalhes</button>
                  <button className={styles.actionBtn}>Reservar Cota</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className={styles.grid}>
          {clientNecessities.map((n) => (
            <div key={n.id} className={styles.clientCard}>
              <div className={styles.clientHeader}>
                <div className={styles.avatar}>{n.client[0]}</div>
                <div>
                  <h4>{n.client}</h4>
                  <div className={styles.matchBadge}>{n.match}% Match IA</div>
                </div>
              </div>
              <div className={styles.clientBody}>
                <h3>{n.title}</h3>
                <p>{n.description}</p>
                <div className={styles.budgetRow}>
                  <DollarSign size={14} />
                  <span>Investimento: {n.budget}</span>
                </div>
                <div className={styles.tagCloud}>
                  {n.tags.map(t => <span key={t} className={styles.tag}>{t}</span>)}
                </div>
              </div>
              <div className={styles.cardFooter}>
                <button className={styles.proposalBtn}>
                  Enviar Proposta Estratégica
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
