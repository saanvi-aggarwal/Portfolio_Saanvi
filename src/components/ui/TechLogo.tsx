'use client';

import React from 'react';
import Image from 'next/image';

export const BRAND_LOGOS: Record<string, string> = {
  python: '/logos/python.svg',
  cpp: '/logos/cpp.webp',
  c: '/logos/c.png',
  sql: '/logos/sql.png',
  mysql: '/logos/mysql.svg',
  azure: '/logos/azure.webp',
  git: '/logos/git.png',
  github: '/logos/github.svg',
  linkedin: '/logos/linkedin.svg',
  leetcode: '/logos/leetcode.svg',
  ideathon: '/logos/ideathon.svg',
  cu: '/logos/cu.svg',
  psb: '/logos/psb.svg',
  java: '/logos/java.svg',
};

export function isBrand(logoKey?: string): boolean {
  if (!logoKey) return false;
  return logoKey in BRAND_LOGOS;
}

interface TechLogoProps {
  name: string;
  logoKey?: string;
  size?: number;
  className?: string;
}

export function TechLogo({ name, logoKey, size = 28, className = '' }: TechLogoProps) {
  const brandPath = logoKey ? BRAND_LOGOS[logoKey] : undefined;

  if (brandPath) {
    return (
      <div
        className={`relative inline-flex items-center justify-center shrink-0 ${className}`}
        style={{ width: size, height: size }}
      >
        <Image
          src={brandPath}
          alt={`${name} logo`}
          width={size}
          height={size}
          className="w-full h-full object-contain"
          priority={size > 40}
          unoptimized
        />
      </div>
    );
  }

  // Thin line custom concept SVG icons
  const renderConceptIcon = () => {
    switch (logoKey) {
      case 'dsa':
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="w-full h-full">
            <circle cx="12" cy="5" r="2.5" />
            <circle cx="6" cy="19" r="2.5" />
            <circle cx="18" cy="19" r="2.5" />
            <path d="M12 7.5V12M12 12L6 16.5M12 12L18 16.5" />
          </svg>
        );
      case 'oop':
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="w-full h-full">
            <rect x="3" y="3" width="7" height="7" rx="1.5" />
            <rect x="14" y="3" width="7" height="7" rx="1.5" />
            <rect x="14" y="14" width="7" height="7" rx="1.5" />
            <rect x="3" y="14" width="7" height="7" rx="1.5" />
            <path d="M10 6.5h4M6.5 10v4M17.5 10v4M10 17.5h4" strokeDasharray="2 2" />
          </svg>
        );
      case 'ml':
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="w-full h-full">
            <path d="M12 2a5 5 0 0 1 5 5c0 2.2-1.5 4-3.5 4.7V14h-3v-2.3C8.5 11 7 9.2 7 7a5 5 0 0 1 5-5z" />
            <path d="M9 18h6M10 22h4" />
            <circle cx="4" cy="12" r="1.5" />
            <circle cx="20" cy="12" r="1.5" />
            <path d="M5.5 12h2.5M16 12h2.5" />
          </svg>
        );
      case 'nlp':
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="w-full h-full">
            <path d="M4 6h16M4 12h10M4 18h14" />
            <path d="M18 10l3 2-3 2" />
          </svg>
        );
      case 'dbms':
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="w-full h-full">
            <ellipse cx="12" cy="5" rx="8" ry="3" />
            <path d="M4 5v6c0 1.66 3.58 3 8 3s8-1.34 8-3V5" />
            <path d="M4 11v6c0 1.66 3.58 3 8 3s8-1.34 8-3v-6" />
          </svg>
        );
      case 'automation':
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="w-full h-full">
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
          </svg>
        );
      case 'leadership':
      case 'collaboration':
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="w-full h-full">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
          </svg>
        );
      case 'critical-thinking':
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="w-full h-full">
            <circle cx="12" cy="12" r="9" />
            <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
        );
      case 'learner':
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="w-full h-full">
            <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
            <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
          </svg>
        );
      case 'goal':
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="w-full h-full">
            <circle cx="12" cy="12" r="9" />
            <circle cx="12" cy="12" r="5" />
            <circle cx="12" cy="12" r="1" />
          </svg>
        );
      case 'adaptability':
      default:
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="w-full h-full">
            <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67" />
          </svg>
        );
    }
  };

  return (
    <div
      className={`inline-flex items-center justify-center shrink-0 text-[#0d0d0d] ${className}`}
      style={{ width: size, height: size }}
      aria-label={name}
    >
      {renderConceptIcon()}
    </div>
  );
}
