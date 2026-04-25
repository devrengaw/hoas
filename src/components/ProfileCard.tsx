'use client';

import React from 'react';
import { Mail, MessageSquare, Phone, MapPin, Zap } from 'lucide-react';
import styles from './ProfileCard.module.css';

interface ProfileCardProps {
  name: string;
  role: string;
  company: string;
  rating: number;
  imageUrl?: string;
  tags?: string[];
}

export default function ProfileCard({ name, role, company, rating, imageUrl, tags = ['Negociação', 'IA', 'Mídia'] }: ProfileCardProps) {
  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <div className={styles.avatarContainer}>
          <img src={imageUrl || `https://i.pravatar.cc/150?u=${name}`} alt={name} className={styles.avatar} />
          <div className={styles.ratingBadge}>
            <Zap size={12} fill="currentColor" />
            <span>{rating}</span>
          </div>
        </div>
        <div className={styles.info}>
          <h3>{name}</h3>
          <p className={styles.role}>{role} • <strong>{company}</strong></p>
        </div>
      </div>
      
      <div className={styles.tags}>
        {tags.map(tag => (
          <span key={tag} className={styles.tag}>{tag}</span>
        ))}
      </div>

      <div className={styles.footer}>
        <button className={styles.connectBtn}>Conectar</button>
        <div className={styles.socialIcons}>
          <MessageSquare size={18} className={styles.socialIcon} />
          <Mail size={18} className={styles.socialIcon} />
        </div>
      </div>
    </div>
  );
}
