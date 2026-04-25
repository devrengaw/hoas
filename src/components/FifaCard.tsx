'use client';

import React, { useState } from 'react';
import { Heart, Handshake, Network, Box, Shield, Users } from 'lucide-react';
import styles from './FifaCard.module.css';

interface FifaCardProps {
  name: string;
  role: string;
  company: string;
  imageUrl?: string;
  rating?: number;
  position?: string;
  stats?: {
    label: string;
    value: string | number;
    icon: React.ElementType;
  }[];
  interests?: string[];
}

export default function FifaCard({ 
  name, role, company, imageUrl, rating = 94, position = 'EXEC', stats, interests 
}: FifaCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  // Default stats matching the reference image if none provided
  const displayStats = stats || [
    { label: 'RS', value: 95, icon: Heart },
    { label: 'NEG', value: 88, icon: Handshake },
    { label: 'NTW', value: 92, icon: Network },
    { label: 'CLS', value: 89, icon: Box },
    { label: 'ACT', value: 90, icon: Shield },
    { label: 'LDR', value: 94, icon: Users },
  ];

  return (
    <div 
      className={styles.container} 
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <div className={`${styles.card} ${isFlipped ? styles.flipped : ''}`}>
        {/* Front Side - Neon Holographic Style */}
        <div className={styles.front}>
          <div className={styles.cardHeader}>
            <div className={styles.mainStats}>
              <span className={styles.rankLabel}>RANK</span>
              <span className={styles.rating}>{rating}</span>
              <span className={styles.overallLabel}>Overall</span>
              <span className={styles.position}>{position}</span>
            </div>
            <div className={styles.playerImageContainer}>
              {imageUrl ? (
                <img src={imageUrl} alt={name} className={styles.playerImage} />
              ) : (
                <div className={styles.playerImagePlaceholder}>
                   {/* Fallback image/icon could go here */}
                </div>
              )}
            </div>
          </div>

          <div className={styles.cardBody}>
            <h3 className={styles.name}>{name}</h3>
            <p className={styles.role}>{role}</p>
            
            <div className={styles.statsRow}>
              {displayStats.map((stat, i) => (
                <div key={i} className={styles.miniStat}>
                  <stat.icon size={14} className={styles.statIcon} />
                  <span className={styles.statValue}>{stat.value}</span>
                  <span className={styles.statLabel}>{stat.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Back Side - Premium Dark */}
        <div className={styles.back}>
          <div className={styles.backHeader}>
            <h3>Bio & Interesses</h3>
          </div>
          <div className={styles.statsGrid}>
            <div className={styles.statItem}>
              <span className={styles.statLabelBack}>Empresa</span>
              <span className={styles.statValueBack}>{company}</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statLabelBack}>Status</span>
              <span className={styles.statValueBack}>Ativo</span>
            </div>
          </div>
          <div className={styles.interestsSection}>
            <h4>Foco de Atuação</h4>
            <div className={styles.interestsList}>
              {interests?.map((interest, i) => (
                <span key={i} className={styles.interestTag}>{interest}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
