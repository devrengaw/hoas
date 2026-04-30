'use client';

import React from 'react';
import Link from 'next/link';
import { Search, Filter } from 'lucide-react';
import FifaCard from '@/components/FifaCard';
import styles from './page.module.css';

export default function VehicleDirectory() {
  const vehicles = [
    { name: "David Chen", role: "VP, Sales", company: "TV Alpha", rating: 94, position: "EXEC" },
    { name: "Ana Paula", role: "Diretora Comercial", company: "Rede Globo", rating: 96, position: "DIR" },
    { name: "Carlos Melo", role: "Executivo", company: "Alpha Outdoor", rating: 89, position: "EXE" },
    { name: "Julia Ferraz", role: "Head de Audio", company: "Spotlight", rating: 92, position: "EXEC" },
  ];

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div>
          <h1>Diretório de Veículos</h1>
          <p>Conecte-se com os executivos dos principais veículos de mídia.</p>
        </div>
      </header>

      <div className={styles.controls}>
        <div className={styles.searchBox}>
          <Search size={20} />
          <input type="text" placeholder="Buscar veículo ou executivo..." />
        </div>
        <button className={styles.filterBtn}><Filter size={18} /> Filtros</button>
      </div>

      <div className={styles.grid}>
        <Link href="/dashboard/directory/picpay-ads" style={{ textDecoration: 'none' }}>
          <FifaCard 
            name="PicPay Ads"
            role="Veículo de Mídia"
            company="Financial Media"
            rating={98}
            position="FIN"
            imageUrl="https://i.pravatar.cc/300?u=picpay"
            interests={['Financial', 'Retail', 'In-app']}
          />
        </Link>
        {vehicles.map((person, i) => (
          <FifaCard 
            key={i}
            name={person.name}
            role={person.role}
            company={person.company}
            rating={person.rating}
            position={person.position}
            imageUrl={`https://i.pravatar.cc/300?u=${person.name}`}
            interests={['Negociação', 'Projetos', 'IA']}
          />
        ))}
      </div>
    </div>
  );
}
