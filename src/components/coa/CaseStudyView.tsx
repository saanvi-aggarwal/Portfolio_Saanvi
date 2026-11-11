'use client';

import React, { useState } from 'react';
import { COA_CASE_STUDY } from '@/lib/data';

export function CaseStudyView() {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const keyPoints = [
    {
      stage: '01. Fetch',
      action: 'PC → MAR → Memory Read → MDR → IR',
      note: 'Retrieves instruction ADD R3, R1, R2 from memory; PC increments to next address.',
    },
    {
      stage: '02. Decode',
      action: 'CU Decodes Opcode & Identifies Operands',
      note: 'Isolates ADD operation, destination register R3, and reads source registers R1 (12) and R2 (8).',
    },
    {
      stage: '03. Execute',
      action: 'ALU Binary Addition (12 + 8 = 20)',
      note: 'Computes 0000 1100₂ + 0000 1000₂ = 0001 0100₂ and latches result in output buffer.',
    },
    {
      stage: '04. Write-Back',
      action: 'Result Bus → R3 Register Update',
      note: 'Result (20₁₀) is committed to destination register R3 under the RegWrite control signal.',
    },
  ];

  const coreTakeaways = [
    {
      title: 'Program Counter (PC)',
      desc: 'Maintains sequential instruction flow by auto-incrementing after each fetch cycle.',
    },
    {
      title: 'Control Unit (CU)',
      desc: 'Decodes opcodes and asserts timing/control strobes (MemRead, RegWrite, ALUOp).',
    },
    {
      title: 'Registers (R1, R2, R3)',
      desc: 'Built directly into CPU core for single-cycle high-speed operand storage.',
    },
    {
      title: 'ALU & Binary Adder',
      desc: 'Carries out 8-bit arithmetic computation and evaluates condition flags.',
    },
  ];

  return (
    <div className="w-full space-y-8 sm:space-y-10">
      {/* Header & Academic Info */}
      <div className="space-y-3">
        <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
          <span className="px-3 py-1 rounded-full bg-[#faf9f5] border border-[rgba(13,13,13,0.08)] text-[#0d0d0d] font-semibold">
            {COA_CASE_STUDY.institution}
          </span>
          <span className="text-[#a9a6a0]" aria-hidden="true">
            •
          </span>
          <span className="text-[#77756f]">{COA_CASE_STUDY.course}</span>
        </div>

        <h1 className="heading-primary text-3xl sm:text-4xl lg:text-5xl text-[#0d0d0d] tracking-tight">
          Case Study:{' '}
          <span className="font-serif italic font-normal text-[#0d0d0d]">
            CPU Instruction Cycle
          </span>
        </h1>

        <p className="text-sm sm:text-base text-[#52504b] max-w-2xl leading-relaxed">
          Tracing register, ALU, Control Unit, and Program Counter operations during the execution
          of <code className="font-mono text-[#0d0d0d] font-semibold">ADD R3, R1, R2</code> (evaluating A = B + C).
        </p>
      </div>

      {/* Primary Download Banner (Hero CTA) */}
      <div className="p-6 sm:p-8 rounded-[28px] bg-[#0d0d0d] text-white shadow-md flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-mono text-xs uppercase tracking-wider text-[#a9a6a0]">
              Complete Academic Submission
            </span>
          </div>
          <h2 className="heading-primary text-xl sm:text-2xl text-white">
            Download the Full Verified Case Study
          </h2>
          <p className="text-xs sm:text-sm text-[#a9a6a0] leading-relaxed">
            Includes the complete problem statement, the labeled CPU block diagram &amp; annotated
            data path, theoretical Q&amp;A, and step-by-step cycle breakdown.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <a
            href={COA_CASE_STUDY.pdfPath}
            download="COA-Case-Study-Saanvi-Aggarwal.pdf"
            className="px-5 py-3 rounded-full bg-white text-[#0d0d0d] font-semibold text-xs sm:text-sm hover:bg-[#faf9f5] transition-all shadow-sm inline-flex items-center gap-2"
          >
            <span>Download PDF</span>
            <span className="text-xs">↓</span>
          </a>

          <a
            href={COA_CASE_STUDY.pdfPath}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-3 rounded-full border border-white/20 text-white text-xs sm:text-sm font-medium hover:bg-white/10 transition-colors inline-flex items-center gap-1.5"
          >
            <span>Open PDF</span>
            <span className="text-xs">↗</span>
          </a>

          <button
            type="button"
            onClick={() => setIsPreviewOpen((prev) => !prev)}
            className="px-4 py-3 rounded-full border border-white/20 text-white text-xs sm:text-sm font-medium hover:bg-white/10 transition-colors inline-flex items-center gap-1.5 font-mono"
          >
            <span>{isPreviewOpen ? 'Hide Preview' : 'Inline Preview'}</span>
            <span className="text-xs">{isPreviewOpen ? '▴' : '▾'}</span>
          </button>
        </div>
      </div>

      {/* Collapsible Inline PDF Preview */}
      {isPreviewOpen && (
        <div className="rounded-[28px] overflow-hidden border border-[rgba(13,13,13,0.1)] bg-white shadow-sm p-4 sm:p-6 space-y-4 animate-in fade-in duration-300">
          <div className="flex items-center justify-between pb-3 border-b border-[rgba(13,13,13,0.08)]">
            <div className="flex items-center gap-2 font-mono text-xs">
              <span className="font-semibold text-[#0d0d0d]">Case Study Document Preview</span>
              <span className="text-[#77756f]">(Word to PDF Export)</span>
            </div>
            <button
              type="button"
              onClick={() => setIsPreviewOpen(false)}
              className="text-xs font-mono text-[#77756f] hover:text-[#0d0d0d]"
            >
              Close ✕
            </button>
          </div>
          <div className="w-full h-[680px] rounded-2xl overflow-hidden border border-[rgba(13,13,13,0.08)] bg-[#faf9f5]">
            <iframe
              src={`${COA_CASE_STUDY.pdfPath}#view=FitH`}
              title="COA Case Study Document Preview"
              className="w-full h-full"
            />
          </div>
        </div>
      )}

      {/* Main Points: Scenario & Instruction Setup */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="p-6 rounded-[24px] bg-white border border-[rgba(13,13,13,0.1)] shadow-2xs space-y-2">
          <span className="mono-tag text-[11px] text-[#77756f]">Scenario</span>
          <h3 className="font-semibold text-base text-[#0d0d0d]">Program Evaluation</h3>
          <p className="text-xs sm:text-sm text-[#52504b] leading-relaxed">
            A program evaluates <strong className="text-[#0d0d0d]">A = B + C</strong>, where B = 12
            and C = 8, executing via assembly <code className="font-mono text-[#0d0d0d]">ADD R3, R1, R2</code>.
          </p>
        </div>

        <div className="p-6 rounded-[24px] bg-white border border-[rgba(13,13,13,0.1)] shadow-2xs space-y-2">
          <span className="mono-tag text-[11px] text-[#77756f]">Binary Operands</span>
          <h3 className="font-semibold text-base text-[#0d0d0d]">Register Setup</h3>
          <div className="space-y-1 font-mono text-xs text-[#0d0d0d]">
            <div className="flex justify-between">
              <span className="text-[#77756f]">R1 (B = 12):</span>
              <span className="font-semibold">0000 1100₂</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#77756f]">R2 (C = 8):</span>
              <span className="font-semibold">0000 1000₂</span>
            </div>
            <div className="flex justify-between text-emerald-700 font-semibold pt-1 border-t border-[rgba(13,13,13,0.06)]">
              <span>R3 (Sum = 20):</span>
              <span>0001 0100₂</span>
            </div>
          </div>
        </div>

        <div className="p-6 rounded-[24px] bg-white border border-[rgba(13,13,13,0.1)] shadow-2xs space-y-2">
          <span className="mono-tag text-[11px] text-[#77756f]">Academic Context</span>
          <h3 className="font-semibold text-base text-[#0d0d0d]">Author Details</h3>
          <div className="space-y-0.5 text-xs font-mono text-[#52504b]">
            <p><span className="text-[#77756f]">Name:</span> {COA_CASE_STUDY.studentName}</p>
            <p><span className="text-[#77756f]">UID:</span> {COA_CASE_STUDY.uid}</p>
            <p><span className="text-[#77756f]">Section:</span> {COA_CASE_STUDY.classSection}</p>
          </div>
        </div>
      </div>

      {/* Main Points: 4-Stage Execution Cycle */}
      <div className="p-6 sm:p-8 rounded-[28px] bg-white border border-[rgba(13,13,13,0.1)] shadow-2xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-[rgba(13,13,13,0.08)]">
          <div>
            <span className="mono-tag text-xs text-[#77756f]">Execution Lifecycle</span>
            <h2 className="heading-primary text-xl sm:text-2xl text-[#0d0d0d]">
              Key Stages of the Instruction Cycle
            </h2>
          </div>
          <span className="font-mono text-xs text-[#77756f]">ADD R3, R1, R2</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {keyPoints.map((item, idx) => (
            <div
              key={idx}
              className="p-4 sm:p-5 rounded-2xl bg-[#faf9f5] border border-[rgba(13,13,13,0.06)] space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-semibold text-[#0d0d0d]">
                  {item.stage}
                </span>
                <span className="font-mono text-[11px] px-2 py-0.5 rounded bg-white border border-[rgba(13,13,13,0.06)] text-[#77756f]">
                  Stage {idx + 1}
                </span>
              </div>
              <div className="font-mono text-xs text-emerald-800 bg-emerald-50/80 px-2.5 py-1 rounded-lg inline-block font-medium">
                {item.action}
              </div>
              <p className="text-xs sm:text-sm text-[#52504b] leading-relaxed">
                {item.note}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Core Component Takeaways */}
      <div className="p-6 sm:p-8 rounded-[28px] bg-white border border-[rgba(13,13,13,0.1)] shadow-2xs space-y-5">
        <div className="pb-3 border-b border-[rgba(13,13,13,0.08)]">
          <span className="mono-tag text-xs text-[#77756f]">Hardware Architecture</span>
          <h2 className="heading-primary text-xl sm:text-2xl text-[#0d0d0d]">
            Primary Hardware Components Involved
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {coreTakeaways.map((c, i) => (
            <div
              key={i}
              className="p-4 rounded-2xl bg-[#faf9f5] border border-[rgba(13,13,13,0.06)] space-y-1.5"
            >
              <span className="font-mono text-xs font-semibold text-[#0d0d0d] block">
                {c.title}
              </span>
              <p className="text-xs text-[#52504b] leading-relaxed">{c.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Secondary Download Option for Original DOCX */}
      <div className="p-5 rounded-2xl bg-[#faf9f5] border border-[rgba(13,13,13,0.08)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="text-xs">
          <span className="font-semibold text-[#0d0d0d] block">
            Need the raw Word Document?
          </span>
          <span className="text-[#77756f]">
            Download Case Study.docx for original formatting and course metadata.
          </span>
        </div>
        <a
          href={COA_CASE_STUDY.docxPath}
          download="Case Study.docx"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-[rgba(13,13,13,0.15)] text-[#0d0d0d] text-xs font-mono hover:bg-white hover:border-[#0d0d0d] transition-all"
        >
          <span>Download DOCX</span>
          <span className="text-xs">↓</span>
        </a>
      </div>
    </div>
  );
}
