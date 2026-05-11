'use client';

import React from 'react';
import styles from './LoginDynamicBackground.module.css';

const LoginDynamicBackground = () => {
  return (
    <div className={styles.container}>
      <div className={styles.backgroundImage}></div>
      
      <div className={styles.shapesContainer}>
        <div className={styles.pill} style={{ left: '5%', top: '-5%', width: '160px', height: '450px', animationDuration: '15s', opacity: 0.15 }}></div>
        <div className={styles.pill} style={{ left: '22%', top: '15%', width: '140px', height: '520px', animationDuration: '18s', animationDelay: '-2s', opacity: 0.1 }}></div>
        <div className={styles.pill} style={{ left: '42%', top: '5%', width: '180px', height: '480px', animationDuration: '20s', animationDelay: '-5s', opacity: 0.2 }}></div>
        <div className={styles.pill} style={{ left: '62%', top: '25%', width: '150px', height: '550px', animationDuration: '22s', animationDelay: '-8s', opacity: 0.12 }}></div>
        <div className={styles.pill} style={{ left: '82%', top: '10%', width: '130px', height: '420px', animationDuration: '16s', animationDelay: '-3s', opacity: 0.18 }}></div>
        
        {/* Adicionando mais camadas para profundidade */}
        <div className={styles.pill} style={{ left: '12%', top: '40%', width: '120px', height: '350px', animationDuration: '25s', animationDelay: '-12s', opacity: 0.08 }}></div>
        <div className={styles.pill} style={{ left: '75%', top: '-10%', width: '170px', height: '600px', animationDuration: '28s', animationDelay: '-15s', opacity: 0.05 }}></div>
      </div>
      
      <div className={styles.overlay}></div>
    </div>
  );
};

export default LoginDynamicBackground;
