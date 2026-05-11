import React, { useEffect, useState } from 'react';
import styles from './LoadingScreen.module.css';

const proverbs = [
  "Consagre seus projetos ao Senhor, e seus planos serão bem-sucedidos.",
  "O coração do homem planeja o seu caminho, mas o Senhor firma os seus passos.",
  "Os planos bem elaborados levam à fartura; a pressa desmedida, à pobreza.",
  "Em todo trabalho proveitoso há lucro, mas o só falar leva à escassez.",
  "Aquele que cultiva sua terra com dedicação terá fartura de alimento.",
  "Onde não há conselhos os projetos fracassam, mas com muitos conselheiros há sucesso.",
  "O trabalho diligente enriquece, enquanto a mão frouxa leva à pobreza.",
  "Aquele que é excelente em seu trabalho terá lugar de destaque diante de grandes líderes.",
  "A sabedoria é o fundamento; busque entendimento em tudo o que realizar."
];

interface LoadingScreenProps {
  onFinished?: () => void;
}

export default function LoadingScreen({ onFinished }: LoadingScreenProps) {
  const [quote, setQuote] = useState('');
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const randomQuote = proverbs[Math.floor(Math.random() * proverbs.length)];
    setQuote(randomQuote);

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          if (onFinished) {
            // Give extra time to read the quote after progress hits 100%
            setTimeout(onFinished, 1200);
          }
          return 100;
        }
        return prev + 1;
      });
    }, 60);

    return () => clearInterval(interval);
  }, [onFinished]);

  return (
    <div className={styles.overlay}>
      <div className={styles.backgroundGlow} />
      <div className={styles.content}>
        <div className={styles.loaderWrapper}>
          <div className={styles.ring}></div>
          <div className={styles.ring}></div>
          <div className={styles.ring}></div>
          <div className={styles.percentage}>{progress}%</div>
        </div>
        
        <div className={styles.quoteWrapper}>
          <p className={styles.quote}>{quote}</p>
        </div>

        <div className={styles.progressBar}>
          <div 
            className={styles.progressFill} 
            style={{ width: `${progress}%` }}
          />
        </div>
        
        <span className={styles.statusText}>Preparando seu ambiente de alta performance...</span>
      </div>
    </div>
  );
}
