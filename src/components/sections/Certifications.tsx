'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { CERTIFICATIONS, CertificationItem } from '@/lib/data';
import { TechLogo } from '@/components/ui/TechLogo';

export function Certifications() {
  const [activeCert, setActiveCert] = useState<CertificationItem | null>(null);

  // Close modal on Escape key press
  useEffect(() => {
    if (!activeCert) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setActiveCert(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    // Lock background scroll when modal is open
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [activeCert]);

  return (
    <section
      id="certifications"
      className="section-spacing border-b border-[rgba(13,13,13,0.08)] bg-[#f4f2ee]"
    >
      <div className="site-container">
        {/* 2-Column Layout: Left Sticky Header, Right Certificate Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-12 lg:gap-14 items-start">
          {/* Left: Sticky Heading & Count Line */}
          <div className="lg:sticky lg:top-32 rv">
            <div className="mb-3">
              <span className="mono-tag">04 — Professional credentials</span>
            </div>

            <h2 className="heading-primary text-3xl sm:text-5xl lg:text-6xl mb-4">
              Always <span className="heading-accent">learning.</span>
            </h2>

            <p className="text-sm sm:text-base text-[#3a3a3a] leading-relaxed mb-6 font-normal">
              Validated industry certifications in cloud infrastructure, machine learning architectures, and artificial intelligence workloads.
            </p>

            {/* Credential summary pill */}
            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white border border-[rgba(13,13,13,0.08)] shadow-xs">
              <TechLogo name="Microsoft Azure" logoKey="azure" size={18} />
              <span className="font-mono text-xs text-[#0d0d0d] font-medium">
                {String(CERTIFICATIONS.length).padStart(2, '0')} Microsoft Azure Credentials
              </span>
            </div>
          </div>

          {/* Right: Rich Certificate Showcase Cards */}
          <div className="space-y-6 rv stagger-1">
            {CERTIFICATIONS.map((cert) => (
              <div
                key={cert.id}
                className="group rounded-3xl bg-white border border-[rgba(13,13,13,0.1)] p-6 sm:p-8 shadow-sm hover:shadow-md transition-all duration-300"
              >
                <div className="grid grid-cols-1 md:grid-cols-[1.1fr_0.9fr] gap-6 sm:gap-8 items-center">
                  {/* Left: Metadata, Title, Description, and Actions */}
                  <div className="flex flex-col justify-between h-full space-y-4">
                    <div>
                      {/* Top Row: Index + Logo + Issuer Code */}
                      <div className="flex items-center justify-between gap-3 mb-3">
                        <div className="flex items-center gap-3">
                          <span className="font-mono text-xs font-bold px-2.5 py-1 rounded-full bg-[#f4f2ee] text-[#0d0d0d] border border-[rgba(13,13,13,0.08)]">
                            {cert.number}
                          </span>
                          <div className="w-8 h-8 rounded-lg bg-[#f4f2ee] flex items-center justify-center p-1.5 border border-[rgba(13,13,13,0.06)]">
                            <TechLogo name={cert.issuer} logoKey="azure" size={20} />
                          </div>
                          <span className="font-mono text-xs uppercase tracking-wider text-[#77756f]">
                            {cert.issuer} · {cert.code}
                          </span>
                        </div>

                        {cert.issueDate && (
                          <span className="font-mono text-[11px] text-[#77756f] hidden sm:inline-block">
                            {cert.issueDate}
                          </span>
                        )}
                      </div>

                      {/* Title */}
                      <h3 className="font-sans font-bold text-xl sm:text-2xl tracking-tight text-[#0d0d0d] leading-snug mb-2">
                        {cert.title}
                      </h3>

                      {/* Description */}
                      <p className="text-xs sm:text-sm text-[#55534e] leading-relaxed mb-4">
                        {cert.description}
                      </p>
                    </div>

                    {/* Actions Row */}
                    <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-[rgba(13,13,13,0.08)]">
                      <button
                        type="button"
                        onClick={() => setActiveCert(cert)}
                        className="btn-pill-primary text-xs !py-2 !px-4 flex items-center gap-1.5 cursor-pointer"
                        aria-label={`View ${cert.title} certificate`}
                      >
                        <span>View Certificate</span>
                        <span className="text-sm font-mono leading-none">⤢</span>
                      </button>

                      {cert.pdfUrl && (
                        <a
                          href={cert.pdfUrl}
                          download
                          className="btn-pill-secondary text-xs !py-2 !px-4 flex items-center gap-1.5"
                          aria-label={`Download ${cert.title} PDF`}
                        >
                          <span>PDF</span>
                          <span className="text-xs font-mono leading-none">↓</span>
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Right: Visual Certificate Preview */}
                  {cert.imageUrl && (
                    <div
                      role="button"
                      tabIndex={0}
                      onClick={() => setActiveCert(cert)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          setActiveCert(cert);
                        }
                      }}
                      aria-label={`Open full certificate preview for ${cert.title}`}
                      className="group/img relative overflow-hidden rounded-2xl border border-[rgba(13,13,13,0.12)] bg-[#fcfbf9] shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0d0d0d]"
                    >
                      {/* Certificate Aspect Ratio Container */}
                      <div className="relative aspect-[4/3] w-full overflow-hidden bg-white">
                        <Image
                          src={cert.imageUrl}
                          alt={`${cert.title} Certificate`}
                          fill
                          sizes="(max-width: 768px) 100vw, 420px"
                          className="object-cover object-top transition-transform duration-500 ease-out group-hover/img:scale-[1.03]"
                        />

                        {/* Hover Overlay with Preview Pill */}
                        <div className="absolute inset-0 bg-[#0d0d0d]/40 opacity-0 group-hover/img:opacity-100 group-focus/img:opacity-100 transition-opacity duration-300 flex items-center justify-center p-4">
                          <span className="px-4 py-2 rounded-full bg-white/95 text-[#0d0d0d] font-mono text-xs font-semibold shadow-lg backdrop-blur-sm transform translate-y-2 group-hover/img:translate-y-0 transition-transform duration-300 flex items-center gap-2">
                            <span>Inspect Certificate</span>
                            <span>⤢</span>
                          </span>
                        </div>
                      </div>

                      {/* Small Bottom Strip */}
                      <div className="px-4 py-2 bg-[#faf8f5] border-t border-[rgba(13,13,13,0.06)] flex items-center justify-between text-[11px] font-mono text-[#77756f]">
                        <span>Official Microsoft Credential</span>
                        <span className="text-[#0d0d0d] font-medium group-hover/img:underline">Preview →</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Full-Screen Lightbox Modal */}
      {activeCert && activeCert.imageUrl && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-cert-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 lg:p-8 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
          onClick={() => setActiveCert(null)}
        >
          <div
            className="relative w-full max-w-4xl max-h-[92vh] flex flex-col bg-white rounded-3xl overflow-hidden shadow-2xl border border-white/20 select-none animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-[rgba(13,13,13,0.08)] bg-[#fcfbf9]">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#f4f2ee] flex items-center justify-center p-1.5 border border-[rgba(13,13,13,0.06)]">
                  <TechLogo name={activeCert.issuer} logoKey="azure" size={20} />
                </div>
                <div>
                  <h3 id="modal-cert-title" className="font-sans font-bold text-base sm:text-lg text-[#0d0d0d]">
                    {activeCert.title}
                  </h3>
                  <p className="font-mono text-xs text-[#77756f]">
                    {activeCert.issuer} · {activeCert.code} {activeCert.issueDate ? `· ${activeCert.issueDate}` : ''}
                  </p>
                </div>
              </div>

              {/* Close Button */}
              <button
                type="button"
                onClick={() => setActiveCert(null)}
                aria-label="Close certificate preview"
                className="w-10 h-10 rounded-full border border-[rgba(13,13,13,0.15)] bg-white hover:bg-[#0d0d0d] hover:text-white flex items-center justify-center font-mono text-sm transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Modal Certificate Image Body */}
            <div className="relative w-full overflow-auto bg-[#1a1a1a] flex items-center justify-center p-2 sm:p-6">
              <div className="relative w-full aspect-[4/3] max-h-[70vh] rounded-lg overflow-hidden shadow-2xl bg-white border border-white/10">
                <Image
                  src={activeCert.imageUrl}
                  alt={activeCert.title}
                  fill
                  sizes="(max-width: 1200px) 100vw, 1000px"
                  className="object-contain"
                  priority
                />
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-6 py-4 border-t border-[rgba(13,13,13,0.08)] bg-[#fcfbf9]">
              <div className="flex items-center gap-2 font-mono text-xs text-[#77756f]">
                <span>Official Microsoft Credential</span>
              </div>

              <div className="flex items-center gap-3">
                {activeCert.pdfUrl && (
                  <a
                    href={activeCert.pdfUrl}
                    download
                    className="btn-pill-primary text-xs !py-2 !px-4 flex items-center gap-1.5"
                  >
                    <span>Download PDF</span>
                    <span className="font-mono text-xs">↓</span>
                  </a>
                )}

                <button
                  type="button"
                  onClick={() => setActiveCert(null)}
                  className="btn-pill-secondary text-xs !py-2 !px-4 cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
