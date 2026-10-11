'use client';

import React, { useState } from 'react';
import { ASSIGNMENTS, AssignmentItem } from '@/lib/data';

export function AssignmentsList() {
  const [activePreviewId, setActivePreviewId] = useState<string | null>(null);

  const togglePreview = (id: string) => {
    setActivePreviewId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="w-full space-y-8">
      {/* Grid of Assignments */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        {ASSIGNMENTS.map((item: AssignmentItem, idx: number) => {
          const isPreviewOpen = activePreviewId === item.id;
          const indexFormatted = String(idx + 1).padStart(2, '0');

          return (
            <div
              key={item.id}
              className={`p-6 sm:p-8 rounded-[28px] bg-white border border-[rgba(13,13,13,0.1)] shadow-sm transition-all duration-300 flex flex-col justify-between ${
                isPreviewOpen ? 'md:col-span-2' : 'hover:-translate-y-1 hover:shadow-md'
              }`}
            >
              <div className="space-y-4">
                {/* Header: Index & Subject Tag */}
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs text-[#77756f] font-semibold">{indexFormatted}</span>
                  <span className="font-mono text-[11px] uppercase tracking-wider px-3 py-1 rounded-full bg-[#f4f2ee] text-[#0d0d0d] border border-[rgba(13,13,13,0.06)]">
                    {item.subject}
                  </span>
                </div>

                {/* Title */}
                <h2 className="heading-primary text-xl sm:text-2xl text-[#0d0d0d]">
                  {item.title}
                </h2>

                {/* Description */}
                <p className="text-sm text-[#77756f] leading-relaxed">
                  {item.description}
                </p>

                {/* Topics from Verified PDF */}
                {item.topics && item.topics.length > 0 && (
                  <div className="space-y-2 pt-1">
                    <span className="text-[11px] font-mono uppercase tracking-wider text-[#77756f] block">
                      Curriculum Topics Covered:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {item.topics.map((topic, tIdx) => (
                        <span
                          key={tIdx}
                          className="font-mono text-[11px] px-2.5 py-1 rounded-lg bg-[#faf9f5] text-[#3a3a3a] border border-[rgba(13,13,13,0.06)]"
                        >
                          {topic}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons: Primary "Open PDF ↗" + Secondary Download */}
              <div className="pt-6 mt-6 border-t border-[rgba(13,13,13,0.08)] flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <a
                    href={item.file}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-pill-primary text-xs py-2 px-5"
                  >
                    <span>Open PDF</span>
                    <span className="text-xs ml-1">↗</span>
                  </a>

                  <a
                    href={item.file}
                    download="coa-assignment-1.pdf"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-[rgba(13,13,13,0.15)] text-[#0d0d0d] text-xs font-medium hover:border-[#0d0d0d] transition-colors"
                  >
                    <span>Download</span>
                    <span className="text-xs">↓</span>
                  </a>
                </div>

                <button
                  type="button"
                  onClick={() => togglePreview(item.id)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-mono text-[#0d0d0d] hover:bg-[#f4f2ee] transition-colors"
                >
                  <span>{isPreviewOpen ? 'Close Preview' : 'Inline Preview'}</span>
                  <span className="font-mono text-xs">{isPreviewOpen ? '▴' : '▾'}</span>
                </button>
              </div>

              {/* Collapsible Inline PDF Preview */}
              {isPreviewOpen && (
                <div className="mt-6 pt-6 border-t border-[rgba(13,13,13,0.08)] space-y-3 animate-in fade-in duration-300">
                  <div className="flex items-center justify-between text-xs font-mono text-[#77756f]">
                    <span>PDF Viewer · {item.title}</span>
                    <a
                      href={item.file}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline hover:text-[#0d0d0d]"
                    >
                      Open in dedicated viewer ↗
                    </a>
                  </div>

                  <div className="w-full h-[70svh] rounded-2xl overflow-hidden border border-[rgba(13,13,13,0.1)] bg-[#f4f2ee]">
                    <object
                      data={item.file}
                      type="application/pdf"
                      className="w-full h-full"
                    >
                      <div className="flex flex-col items-center justify-center h-full p-6 text-center space-y-3">
                        <p className="text-sm text-[#77756f]">
                          Your browser does not support inline PDF rendering.
                        </p>
                        <a
                          href={item.file}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn-pill-primary text-xs py-2 px-5"
                        >
                          Open PDF Directly ↗
                        </a>
                      </div>
                    </object>
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {/* Small dashed placeholder card: More assignments */}
        <div className="p-8 rounded-[28px] border-2 border-dashed border-[rgba(13,13,13,0.12)] flex flex-col items-center justify-center text-center min-h-[260px] bg-transparent text-[#77756f] space-y-2">
          <div className="w-8 h-8 rounded-full border border-dashed border-[rgba(13,13,13,0.2)] flex items-center justify-center font-mono text-xs text-[#0d0d0d]">
            +
          </div>
          <span className="font-mono text-xs uppercase tracking-wider text-[#0d0d0d] font-semibold">
            More assignments coming soon
          </span>
          <p className="text-xs text-[#77756f] max-w-xs leading-relaxed">
            Additional laboratory coursework, problem sets, and architecture reports will be posted here.
          </p>
        </div>
      </div>
    </div>
  );
}
