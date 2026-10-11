'use client';

import React, { useState } from 'react';
import { PROJECTS, ProjectItem } from '@/lib/data';
import { TechLogo } from '@/components/ui/TechLogo';

export function Work() {
  const [activeId, setActiveId] = useState<string>(PROJECTS[0].id);

  return (
    <section id="work" className="section-spacing border-b border-[rgba(13,13,13,0.08)] bg-[#f4f2ee]">
      <div className="site-container">
        {/* Section Header */}
        <div className="rv mb-10">
          <div className="mb-3">
            <span className="mono-tag">03 — Selected work</span>
          </div>
          <h2 className="heading-primary text-3xl sm:text-5xl lg:text-6xl">
            Software projects &amp; <span className="heading-accent">systems.</span>
          </h2>
        </div>

        {/* Desktop Expanding Horizontal Accordion (min(78svh, 600px)) */}
        <div className="hidden lg:flex flex-row gap-4 items-stretch h-[min(78svh,620px)] w-full rv stagger-1">
          {PROJECTS.map((project) => {
            const isActive = activeId === project.id;

            return (
              <div
                key={project.id}
                data-cursor="view"
                tabIndex={0}
                role="button"
                aria-expanded={isActive}
                aria-label={`Project: ${project.title}`}
                onClick={() => setActiveId(project.id)}
                onFocus={() => setActiveId(project.id)}
                className={`relative rounded-3xl overflow-hidden transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] border border-[rgba(13,13,13,0.1)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0d0d0d] ${
                  isActive
                    ? 'flex-[8] bg-white shadow-2xl p-8 cursor-default'
                    : 'flex-[1] bg-white/70 hover:bg-white/95 cursor-pointer p-6 flex flex-col justify-between items-center'
                }`}
              >
                {isActive ? (
                  /* Expanded Panel View */
                  <div className="w-full h-full flex flex-col md:flex-row gap-8 items-stretch justify-between animate-[fadeIn_0.5s_ease-out]">
                    {/* Left: Project Details */}
                    <div className="flex-[5] flex flex-col justify-between overflow-y-auto pr-2">
                      <div>
                        {/* Kicker & Number */}
                        <div className="flex items-center justify-between gap-4 mb-4">
                          <span className="font-mono text-xs uppercase tracking-widest text-[#77756f]">
                            {project.number} — {project.kicker}
                          </span>
                          <span className="w-2.5 h-2.5 rounded-full bg-[#0d0d0d]" />
                        </div>

                        {/* Title */}
                        <h3 className="heading-primary text-3xl sm:text-4xl text-[#0d0d0d] mb-4">
                          {project.title}
                        </h3>

                        {/* Verbatim Resume Description */}
                        <p className="text-sm sm:text-base text-[#3a3a3a] leading-relaxed mb-6 font-normal">
                          {project.description}
                        </p>

                        {/* 2-Column Key Highlights */}
                        <div className="mb-6">
                          <h4 className="font-mono text-xs text-[#77756f] uppercase tracking-wider mb-3">
                            Key Engineering Features
                          </h4>
                          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs text-[#222]">
                            {project.features.map((feature, fIdx) => (
                              <li key={fIdx} className="flex items-start gap-2 bg-[#f4f2ee] p-2.5 rounded-xl border border-[rgba(13,13,13,0.06)]">
                                <span className="text-[#0d0d0d] font-mono mt-0.5">•</span>
                                <span className="leading-tight">{feature}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      {/* Bottom Footer: Tech chips + GitHub Link */}
                      <div className="pt-4 border-t border-[rgba(13,13,13,0.08)] flex flex-wrap items-center justify-between gap-4">
                        <div className="flex flex-wrap items-center gap-1.5">
                          {project.technologies.map((tech) => (
                            <span
                              key={tech}
                              className="px-2.5 py-1 rounded-full text-xs font-mono bg-[#f4f2ee] text-[#0d0d0d] border border-[rgba(13,13,13,0.08)]"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>

                        {project.githubUrl && (
                          <a
                            href={project.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn-pill-primary text-xs !py-2.5 !px-5 inline-flex items-center gap-2"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <span>View on GitHub</span>
                            <span className="font-mono text-xs">↗</span>
                          </a>
                        )}
                      </div>
                    </div>

                    {/* Right: Illustrative Mini-UI (pure CSS/JSX grayscale) */}
                    <div className="flex-[6] rounded-2xl bg-[#0d0d0d] text-[#f4f2ee] p-6 flex flex-col justify-between overflow-hidden shadow-inner relative border border-[#262626]">
                      {/* Top Header */}
                      <div className="flex items-center justify-between border-b border-[#262626] pb-3 mb-4">
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]" />
                          <span className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]" />
                          <span className="w-2.5 h-2.5 rounded-full bg-[#27c93f]" />
                          <span className="ml-2 font-mono text-[10px] text-[#77756f]">
                            {project.repoName} — sandbox
                          </span>
                        </div>
                        <span className="px-2 py-0.5 rounded-full text-[9px] font-mono uppercase bg-[#1f1f1f] text-[#a9a6a0] border border-[#333]">
                          Illustrative UI
                        </span>
                      </div>

                      {/* Mini-UI Canvas */}
                      <div className="flex-1 overflow-y-auto">
                        {project.mockupType === 'email-classifier' ? (
                          <EmailClassifierMockup />
                        ) : project.mockupType === 'instruction-simulator' ? (
                          <InstructionSimulatorMockup />
                        ) : (
                          <LibraryConsoleMockup />
                        )}
                      </div>

                      {/* Footer Badge */}
                      <div className="border-t border-[#262626] pt-3 mt-3 flex items-center justify-between text-[10px] font-mono text-[#77756f]">
                        <span>Engineered by Saanvi Aggarwal</span>
                        <span>{project.kicker}</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* Collapsed Spine View */
                  <div className="w-full h-full flex flex-col justify-between items-center py-4 select-none">
                    <span className="font-mono text-sm font-bold text-[#77756f]">
                      {project.number}
                    </span>

                    <div className="[writing-mode:vertical-rl] transform rotate-180 font-sans font-bold text-lg tracking-tight text-[#0d0d0d] whitespace-nowrap">
                      {project.title}
                    </div>

                    <div className="w-8 h-8 rounded-full border border-[rgba(13,13,13,0.2)] flex items-center justify-center font-mono text-sm text-[#0d0d0d] transition-transform duration-300 group-hover:scale-110">
                      +
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Mobile Vertical Accordion */}
        <div className="flex lg:hidden flex-col gap-5 rv stagger-1">
          {PROJECTS.map((project) => {
            const isOpen = activeId === project.id;

            return (
              <div
                key={project.id}
                className="card-clean overflow-hidden border border-[rgba(13,13,13,0.1)] bg-white"
              >
                {/* Header Toggle */}
                <button
                  onClick={() => setActiveId(isOpen ? '' : project.id)}
                  className="w-full p-6 flex items-center justify-between text-left focus:outline-none"
                  aria-expanded={isOpen}
                >
                  <div className="flex items-center gap-4">
                    <span className="font-mono text-xs text-[#77756f]">
                      {project.number}
                    </span>
                    <h3 className="font-sans font-bold text-xl text-[#0d0d0d]">
                      {project.title}
                    </h3>
                  </div>

                  <span
                    className={`w-8 h-8 rounded-full border border-[rgba(13,13,13,0.15)] flex items-center justify-center font-mono text-sm transition-transform duration-300 ${
                      isOpen ? 'rotate-45 bg-[#0d0d0d] text-white' : 'rotate-0 text-[#0d0d0d]'
                    }`}
                  >
                    +
                  </span>
                </button>

                {/* Collapsible Content */}
                {isOpen && (
                  <div className="p-6 pt-0 border-t border-[rgba(13,13,13,0.06)] space-y-6">
                    <p className="text-sm text-[#3a3a3a] leading-relaxed pt-4">
                      {project.description}
                    </p>

                    <div className="space-y-2">
                      <h4 className="font-mono text-xs text-[#77756f] uppercase tracking-wider">
                        Key Features
                      </h4>
                      <ul className="space-y-1.5 text-xs text-[#3a3a3a]">
                        {project.features.map((f, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <span className="font-mono text-[#0d0d0d]">•</span>
                            <span>{f}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Illustrative UI Preview */}
                    <div className="rounded-2xl bg-[#0d0d0d] text-[#f4f2ee] p-4 text-xs font-mono">
                      <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#262626] text-[10px] text-[#77756f]">
                        <span>Illustrative UI Preview</span>
                        <span>{project.repoName}</span>
                      </div>
                      {project.mockupType === 'email-classifier' ? (
                        <EmailClassifierMockup />
                      ) : project.mockupType === 'instruction-simulator' ? (
                        <InstructionSimulatorMockup />
                      ) : (
                        <LibraryConsoleMockup />
                      )}
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
                      <div className="flex flex-wrap gap-1">
                        {project.technologies.map((t) => (
                          <span
                            key={t}
                            className="px-2 py-0.5 rounded-full text-[11px] font-mono bg-[#f4f2ee] text-[#0d0d0d]"
                          >
                            {t}
                          </span>
                        ))}
                      </div>

                      {project.githubUrl && (
                        <a
                          href={project.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn-pill-primary text-xs !py-2 !px-4"
                        >
                          <span>GitHub</span>
                          <span className="ml-1 font-mono">↗</span>
                        </a>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(0.98);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
    </section>
  );
}

// 1. Grayscale Interactive Mockup for AI Email Classifier
function EmailClassifierMockup() {
  const [selectedCategory, setSelectedCategory] = useState<'Work' | 'Spam' | 'Newsletter' | 'Urgent'>('Work');

  const emails = [
    {
      id: 1,
      sender: 'hr@techcorp.io',
      subject: 'Interview Schedule: Software Engineering Internship',
      category: 'Work' as const,
      confidence: 99.4,
      tokens: ['interview', 'schedule', 'software', 'engineering', 'internship', 'python'],
    },
    {
      id: 2,
      sender: 'deals@unknown-mailer.com',
      subject: 'Claim your immediate $1,000 gift voucher right now!',
      category: 'Spam' as const,
      confidence: 98.7,
      tokens: ['claim', 'immediate', 'voucher', 'prize', 'winner', 'click'],
    },
    {
      id: 3,
      sender: 'updates@ai-weekly.org',
      subject: 'Issue #142: Advances in Transformer Architectures & NLP',
      category: 'Newsletter' as const,
      confidence: 96.2,
      tokens: ['advances', 'transformer', 'nlp', 'machine-learning', 'weekly'],
    },
    {
      id: 4,
      sender: 'mentor@university.edu',
      subject: 'CRITICAL: Project repository submission deadline tonight',
      category: 'Urgent' as const,
      confidence: 97.9,
      tokens: ['critical', 'project', 'deadline', 'tonight', 'submission'],
    },
  ];

  const activeEmail = emails.find((e) => e.category === selectedCategory) || emails[0];

  return (
    <div className="space-y-4 font-mono text-xs">
      {/* Category Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
        {(['Work', 'Spam', 'Newsletter', 'Urgent'] as const).map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-2.5 py-1 rounded-md text-[10px] uppercase tracking-wider transition-colors ${
              selectedCategory === cat
                ? 'bg-white text-[#0d0d0d] font-bold'
                : 'bg-[#1a1a1a] text-[#a9a6a0] hover:text-white'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Selected Email Card */}
      <div className="p-3.5 rounded-xl bg-[#141414] border border-[#2b2b2b] space-y-2.5">
        <div className="flex items-baseline justify-between gap-2">
          <span className="text-[10px] text-[#77756f] truncate">
            FROM: {activeEmail.sender}
          </span>
          <span className="px-2 py-0.5 rounded text-[9px] bg-white/10 text-white font-bold">
            CONFIDENCE: {activeEmail.confidence}%
          </span>
        </div>

        <p className="font-sans font-medium text-sm text-[#f4f2ee]">
          {activeEmail.subject}
        </p>

        {/* NLP Token Extraction Pipeline */}
        <div>
          <span className="text-[9px] text-[#77756f] uppercase block mb-1">
            NLP Vectorized Tokens:
          </span>
          <div className="flex flex-wrap gap-1">
            {activeEmail.tokens.map((token, tIdx) => (
              <span
                key={tIdx}
                className="px-1.5 py-0.5 rounded bg-[#222222] text-[#d4d4d4] text-[9px] border border-[#333]"
              >
                #{token}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// 2. Grayscale Interactive Mockup for Library Management System
function LibraryConsoleMockup() {
  const [search, setSearch] = useState('');

  const books = [
    { id: 101, title: 'The C Programming Language', author: 'Kernighan & Ritchie', status: 'AVAILABLE', year: 1988 },
    { id: 102, title: 'Introduction to Algorithms (CLRS)', author: 'Cormen et al.', status: 'ISSUED', year: 2009 },
    { id: 103, title: 'Data Structures and Algorithms', author: 'A. Aho', status: 'AVAILABLE', year: 1983 },
    { id: 104, title: 'Clean Code: Agile Craftsmanship', author: 'Robert C. Martin', status: 'ISSUED', year: 2008 },
  ];

  const filteredBooks = books.filter(
    (b) =>
      b.title.toLowerCase().includes(search.toLowerCase()) ||
      b.author.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-3 font-mono text-xs">
      {/* Console Input Bar */}
      <div className="flex items-center gap-2 p-2 rounded-lg bg-[#141414] border border-[#2b2b2b]">
        <span className="text-[#10b981] font-bold">&gt;</span>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Type to filter catalog (e.g. Algorithms)..."
          className="w-full bg-transparent text-[#f4f2ee] placeholder-[#555] text-xs focus:outline-none"
        />
      </div>

      {/* Terminal Book Records Table */}
      <div className="border border-[#222] rounded-lg overflow-hidden bg-[#111]">
        <table className="w-full text-[10px] text-left">
          <thead className="bg-[#1a1a1a] text-[#77756f] border-b border-[#222]">
            <tr>
              <th className="p-2">ID</th>
              <th className="p-2">BOOK TITLE</th>
              <th className="p-2">STATUS</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1e1e1e]">
            {filteredBooks.map((book) => (
              <tr key={book.id} className="hover:bg-[#181818] transition-colors">
                <td className="p-2 text-[#a9a6a0]">#{book.id}</td>
                <td className="p-2 text-[#f4f2ee] font-medium truncate max-w-[140px]">
                  {book.title}
                </td>
                <td className="p-2">
                  <span
                    className={`px-1.5 py-0.5 rounded text-[8px] font-bold ${
                      book.status === 'AVAILABLE'
                        ? 'bg-[#14532d] text-[#86efac]'
                        : 'bg-[#262626] text-[#a9a6a0]'
                    }`}
                  >
                    {book.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Struct Definition Code Snippet */}
      <div className="p-2 rounded bg-[#161616] text-[9px] text-[#77756f] border border-[#262626]">
        <code>struct Book &#123; int id; char title[64]; int isIssued; &#125;;</code>
      </div>
    </div>
  );
}

// 3. Grayscale Interactive Mockup for Instruction Set Simulator (C++ & Computer Architecture)
function InstructionSimulatorMockup() {
  const [arch, setArch] = useState<'3-addr' | '2-addr' | '1-addr' | '0-addr'>('3-addr');

  const instructions: Record<string, { code: string; count: number; desc: string }> = {
    '3-addr': {
      code: `ADD  R1, A, B    ; R1 <- A + B\nSUB  R2, C, D    ; R2 <- C - D\nMUL  X, R1, R2   ; X  <- R1 * R2`,
      count: 3,
      desc: '3-Address: Minimal instruction count, requires multi-register hardware',
    },
    '2-addr': {
      code: `MOV  R1, A       ; R1 <- A\nADD  R1, B       ; R1 <- R1 + B\nMOV  R2, C       ; R2 <- C\nSUB  R2, D       ; R2 <- R2 - D\nMUL  R1, R2      ; R1 <- R1 * R2\nMOV  X, R1       ; X  <- R1`,
      count: 6,
      desc: '2-Address: Balanced register transfer, register holds running result',
    },
    '1-addr': {
      code: `LOAD C           ; AC <- C\nSUB  D           ; AC <- AC - D\nSTORE T          ; T  <- AC\nLOAD A           ; AC <- A\nADD  B           ; AC <- AC + B\nMUL  T           ; AC <- AC * T\nSTORE X          ; X  <- AC`,
      count: 7,
      desc: '1-Address: Accumulator architecture, implicit operand in AC register',
    },
    '0-addr': {
      code: `PUSH A           ; Stack <- A\nPUSH B           ; Stack <- B\nADD              ; Stack <- (A + B)\nPUSH C           ; Stack <- C\nPUSH D           ; Stack <- D\nSUB              ; Stack <- (C - D)\nMUL              ; Stack <- (A + B) * (C - D)\nPOP  X           ; X     <- Top of Stack`,
      count: 8,
      desc: '0-Address: Stack-based architecture, operands implicitly on stack top',
    },
  };

  const active = instructions[arch];

  return (
    <div className="space-y-3 font-mono text-xs">
      {/* Expression Preview Bar */}
      <div className="p-2.5 rounded-lg bg-[#141414] border border-[#2b2b2b] flex items-center justify-between gap-2 text-[11px]">
        <span className="text-[#77756f]">EXPR:</span>
        <span className="text-[#f4f2ee] font-bold tracking-wider">(A + B) * (C - D)</span>
        <span className="text-[#a9a6a0] text-[9px] bg-[#222] px-2 py-0.5 rounded">
          POSTFIX: A B + C D - *
        </span>
      </div>

      {/* Architecture Selector Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
        {[
          { id: '3-addr' as const, label: '3-Address' },
          { id: '2-addr' as const, label: '2-Address' },
          { id: '1-addr' as const, label: '1-Address (AC)' },
          { id: '0-addr' as const, label: '0-Address (Stack)' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setArch(tab.id)}
            className={`px-2.5 py-1 rounded-md text-[10px] uppercase tracking-wider transition-colors ${
              arch === tab.id
                ? 'bg-white text-[#0d0d0d] font-bold'
                : 'bg-[#1a1a1a] text-[#a9a6a0] hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Assembly Instruction Stream Output */}
      <div className="p-3 rounded-lg bg-[#111] border border-[#222] text-[#86efac] text-[10px] leading-relaxed overflow-x-auto">
        <pre className="font-mono whitespace-pre">{active.code}</pre>
      </div>

      {/* Efficiency Comparison Stats */}
      <div className="flex items-center justify-between text-[9px] text-[#77756f] border-t border-[#262626] pt-2">
        <span>{active.desc}</span>
        <span className="text-[#f4f2ee] font-bold">TOTAL: {active.count} INSTRUCTIONS</span>
      </div>
    </div>
  );
}

