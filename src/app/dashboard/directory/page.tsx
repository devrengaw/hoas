'use client';

import React from 'react';
import { Search, Filter } from 'lucide-react';
import ProfileCard from '@/components/ProfileCard';
import styles from './page.module.css';

export default function MediaDirectory() {
  const mediaPros = [
    { name: "Mariana Silva", role: "Diretora de Mídia", company: "Agência Global", rating: 92, position: "DIR" },
    { name: "Pedro Santos", role: "Planejamento", company: "XYZ Media", rating: 88, position: "PLN" },
    { name: "Bia Oliveira", role: "Mídia Online", company: "Creative Co", rating: 91, position: "MID" },
    { name: "Roberto Lima", role: "Sócio Diretor", company: "Impact Agency", rating: 95, position: "DIR" },
  ];

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div>
          <h1>Diretório de Mídias</h1>
          <p>Encontre os profissionais de mídia das maiores agências do mercado.</p>
        </div>
      </header>

      <div className={styles.controls}>
        <div className={styles.searchBox}>
          <Search size={20} />
          <input type="text" placeholder="Buscar mídia ou agência..." />
        </div>
        <button className={styles.filterBtn}><Filter size={18} /> Filtros</button>
      </div>

      <div className={styles.grid}>
        {mediaPros.map((person, i) => (
          <ProfileCard 
            key={i}
            name={person.name}
            role={person.role}
            company={person.company}
            rating={person.rating}
            imageUrl={`https://i.pravatar.cc/300?u=${person.name}`}
          />
        ))}
      </div>
    </div>
  );
}
