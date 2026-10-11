'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { PROFILE, NAV } from '@/lib/data';
import { useScrollProgress } from '@/lib/hooks';

export function Navigation() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const scrollProgress = useScrollProgress();
  const isHomePage = pathname === '/';

  // Detect scroll offset for styling shift
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock body scroll when mobile menu is active
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') setMobileMenuOpen(false);
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => {
        document.body.style.overflow = '';
        window.removeEventListener('keydown', handleKeyDown);
      };
    } else {
      document.body.style.overflow = '';
    }
  }, [mobileMenuOpen]);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  return (
    <>
      {/* 2px ink scroll-progress bar on inner pages */}
      {!isHomePage && (
        <div
          className="fixed top-0 left-0 right-0 h-[2.5px] z-50 pointer-events-none bg-transparent"
          aria-hidden="true"
        >
          <div
            className="h-full bg-[#0d0d0d] transition-[width] duration-150 ease-out"
            style={{ width: `${Math.round(scrollProgress * 100)}%` }}
          />
        </div>
      )}

      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 pointer-events-none ${
          scrolled ? 'py-3' : 'py-5 md:py-7'
        }`}
      >
        <div className="site-container flex items-center justify-between">
          {/* Left: Initials mark linking to / + Full Name (hidden on /) */}
          <div className="flex items-center gap-3 pointer-events-auto">
            <Link
              href="/"
              className={`group flex items-center justify-center w-10 h-10 rounded-full transition-all duration-500 ease-out border focus-visible:ring-2 focus-visible:ring-[#0d0d0d] ${
                scrolled
                  ? 'bg-[#0d0d0d] text-[#f4f2ee] border-[#0d0d0d] shadow-md'
                  : 'bg-transparent text-[#0d0d0d] border-[rgba(13,13,13,0.3)] hover:border-[#0d0d0d]'
              }`}
              aria-label="Home — Saanvi Aggarwal"
            >
              <span className="font-mono text-xs font-bold tracking-tight inline-block transition-transform duration-700 ease-out group-hover:rotate-[360deg]">
                {PROFILE.initials}
              </span>
            </Link>

            {/* Name label: Hidden on home page, and fades out on deep scroll */}
            {!isHomePage && (
              <div
                className={`hidden sm:flex flex-col transition-all duration-300 ease-out ${
                  scrolled
                    ? 'opacity-0 -translate-x-2 pointer-events-none'
                    : 'opacity-100 translate-x-0'
                }`}
              >
                <span className="font-sans font-semibold text-sm tracking-tight text-[#0d0d0d]">
                  {PROFILE.name}
                </span>
                <span className="font-mono text-[10px] uppercase tracking-wider text-[#77756f]">
                  {PROFILE.roleWordAccent}
                </span>
              </div>
            )}
          </div>

          {/* Right: Desktop Pill Navigation with Sliding Active Indicator */}
          <nav
            className={`hidden md:flex items-center p-1.5 rounded-full transition-all duration-500 pointer-events-auto ${
              scrolled
                ? 'bg-white/80 backdrop-blur-md shadow-[0_8px_30px_rgba(0,0,0,0.06)] border border-[rgba(13,13,13,0.08)]'
                : 'bg-[rgba(255,255,255,0.7)] backdrop-blur-sm border border-[rgba(13,13,13,0.07)]'
            }`}
            aria-label="Main Navigation"
          >
            <ul className="flex items-center gap-1 relative">
              {NAV.map((item) => {
                const isActive =
                  pathname === item.href ||
                  (item.href !== '/' && pathname.startsWith(item.href + '/'));

                return (
                  <li key={item.id} className="relative">
                    <Link
                      href={item.href}
                      aria-current={isActive ? 'page' : undefined}
                      className={`relative z-10 block px-3.5 py-1.5 rounded-full text-xs font-medium tracking-tight transition-colors duration-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#0d0d0d] ${
                        isActive
                          ? 'text-[#f4f2ee]'
                          : 'text-[#3a3a3a] hover:text-[#0d0d0d]'
                      }`}
                    >
                      {item.label}
                    </Link>

                    {/* Sliding Solid Ink Pill under Active Route */}
                    {isActive && (
                      <span
                        className="absolute inset-0 bg-[#0d0d0d] rounded-full z-0 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] shadow-sm"
                        style={{ borderRadius: '9999px' }}
                      />
                    )}
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Mobile Menu Pill Button */}
          <div className="md:hidden pointer-events-auto">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="flex items-center gap-2 px-4 py-2 rounded-full text-xs font-mono tracking-wider uppercase bg-white/90 backdrop-blur-md border border-[rgba(13,13,13,0.12)] text-[#0d0d0d] shadow-sm hover:bg-white active:scale-95 transition-all"
              aria-label={mobileMenuOpen ? 'Close Menu' : 'Open Menu'}
              aria-expanded={mobileMenuOpen}
            >
              <span>{mobileMenuOpen ? 'Close' : 'Menu'}</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#0d0d0d]" />
            </button>
          </div>
        </div>
      </header>

      {/* Full-screen Paper Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 z-50 bg-[#f4f2ee] flex flex-col justify-between p-6 sm:p-10 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] md:hidden ${
          mobileMenuOpen
            ? 'opacity-100 pointer-events-auto [clip-path:polygon(0_0,100%_0,100%_100%,0_100%)]'
            : 'opacity-0 pointer-events-none [clip-path:polygon(0_0,100%_0,100%_0,0_0)]'
        }`}
        aria-hidden={!mobileMenuOpen}
        inert={!mobileMenuOpen ? true : undefined}
      >
        {/* Mobile Menu Header */}
        <div className="flex items-center justify-between border-b border-[rgba(13,13,13,0.1)] pb-5">
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-3"
          >
            <span className="w-8 h-8 rounded-full bg-[#0d0d0d] text-[#f4f2ee] flex items-center justify-center font-mono text-xs font-bold">
              {PROFILE.initials}
            </span>
            <span className="font-semibold text-sm tracking-tight text-[#0d0d0d]">
              {PROFILE.name}
            </span>
          </Link>

          <button
            onClick={() => setMobileMenuOpen(false)}
            className="w-10 h-10 rounded-full border border-[rgba(13,13,13,0.15)] flex items-center justify-center text-sm font-mono hover:bg-white active:scale-95 transition-all"
            aria-label="Close menu"
          >
            ✕
          </button>
        </div>

        {/* Mobile Navigation Links */}
        <nav className="my-auto py-8">
          <ul className="flex flex-col gap-4">
            {NAV.map((item, idx) => {
              const isActive =
                pathname === item.href ||
                (item.href !== '/' && pathname.startsWith(item.href + '/'));

              return (
                <li
                  key={item.id}
                  className="overflow-hidden"
                  style={{
                    transform: mobileMenuOpen ? 'translateY(0)' : 'translateY(30px)',
                    opacity: mobileMenuOpen ? 1 : 0,
                    transition: `all 0.5s cubic-bezier(0.16, 1, 0.3, 1) ${idx * 50}ms`,
                  }}
                >
                  <Link
                    href={item.href}
                    aria-current={isActive ? 'page' : undefined}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`group flex items-baseline gap-4 text-2xl sm:text-3xl font-bold tracking-tight transition-colors ${
                      isActive ? 'text-[#0d0d0d]' : 'text-[#77756f] hover:text-[#0d0d0d]'
                    }`}
                  >
                    <span className="font-mono text-xs text-[#a9a6a0] font-normal">
                      {item.index}
                    </span>
                    <span>{item.label}</span>
                    {isActive && (
                      <span className="w-2 h-2 rounded-full bg-[#0d0d0d] ml-2 inline-block" />
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Mobile Menu Footer */}
        <div className="border-t border-[rgba(13,13,13,0.1)] pt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs font-mono text-[#77756f]">
          <span>{PROFILE.location}</span>
          <div className="flex items-center gap-4">
            <a
              href={PROFILE.github}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#0d0d0d] underline hover:no-underline"
            >
              GitHub
            </a>
            <a
              href={PROFILE.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#0d0d0d] underline hover:no-underline"
            >
              LinkedIn
            </a>
            <a
              href={PROFILE.resumePath}
              download="Saanvi_Aggarwal_Resume.pdf"
              className="text-[#0d0d0d] underline hover:no-underline"
            >
              Résumé ↓
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
