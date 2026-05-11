'use client';

import React from 'react';
import styles from './SynapseBackground.module.css';

export default function SynapseBackground() {
  return (
    <div className={styles.container}>
      <svg className={styles.svg} viewBox="0 0 800 600" preserveAspectRatio="xMidYMid slice">
        <defs>
          <filter id="whiteGlow">
            <feGaussianBlur stdDeviation="3" result="blur"/>
            <feMerge>
              <feMergeNode in="blur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        {/* Neural Paths - Clean and Subtle */}
        <path d="M-100,300 C200,300 400,100 900,100" className={styles.subtlePath} />
        <path d="M-100,100 C400,100 400,500 900,500" className={styles.subtlePath} />
        <path d="M400,-100 C400,200 400,400 400,700" className={styles.subtlePath} />
        <path d="M900,300 C600,300 200,500 -100,500" className={styles.subtlePath} />

        {/* Single Tranquil White Pulse */}
        <circle r="4" fill="#ffffff" filter="url(#whiteGlow)">
          <animateMotion 
            dur="20s" 
            repeatCount="indefinite" 
            path="M-100,100 C400,100 400,500 900,500"
          />
          <animate 
            attributeName="opacity" 
            values="0;0.8;0.2;0.8;0" 
            keyTimes="0;0.2;0.5;0.8;1"
            dur="4s" 
            repeatCount="indefinite" 
          />
        </circle>

        {/* Another one on a different path with offset */}
        <circle r="3" fill="#ffffff" filter="url(#whiteGlow)" opacity="0.4">
          <animateMotion 
            dur="25s" 
            begin="5s"
            repeatCount="indefinite" 
            path="M900,300 C600,300 200,500 -100,500"
          />
          <animate 
            attributeName="opacity" 
            values="0;0.5;0.1;0.5;0" 
            keyTimes="0;0.2;0.5;0.8;1"
            dur="6s" 
            repeatCount="indefinite" 
          />
        </circle>
      </svg>
    </div>
  );
}
