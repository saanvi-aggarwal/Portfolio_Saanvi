'use client';

import React, { useState, useEffect } from 'react';
import { usePrefersReducedMotion } from '@/lib/hooks';

const RUN_COMMANDS = `# 1. Clone repository
git clone https://github.com/saanvi-aggarwal/Instruction-Set-Simulator.git
cd Instruction-Set-Simulator

# 2. Compile using C++17
g++ -std=c++17 main.cpp -o simulator

# 3. Execute interactive CLI
./simulator`;

const TERMINAL_LINES = [
  { text: '$ ./simulator', delay: 0 },
  { text: '=========================================', delay: 400 },
  { text: '   INSTRUCTION SET ARCHITECTURE SIMULATOR', delay: 700 },
  { text: '=========================================', delay: 1000 },
  { text: 'Enter infix arithmetic expression: (A+B)*(C-D)', delay: 1500 },
  { text: '[Validating token stream... OK]', delay: 2000 },
  { text: 'Generated Postfix Notation: AB+CD-*', delay: 2400 },
  { text: '', delay: 2700 },
  { text: '--- 3-ADDRESS FORMAT ---', delay: 3000 },
  { text: '  ADD  R1, A, B', delay: 3300 },
  { text: '  SUB  R2, C, D', delay: 3600 },
  { text: '  MUL  X, R1, R2', delay: 3900 },
  { text: '  Total Instructions: 3', delay: 4200 },
  { text: '', delay: 4400 },
  { text: '--- 2-ADDRESS FORMAT ---', delay: 4700 },
  { text: '  MOV  R1, A', delay: 5000 },
  { text: '  ADD  R1, B', delay: 5300 },
  { text: '  MOV  R2, C', delay: 5600 },
  { text: '  SUB  R2, D', delay: 5900 },
  { text: '  MUL  R1, R2', delay: 6200 },
  { text: '  Total Instructions: 5', delay: 6500 },
  { text: '', delay: 6700 },
  { text: '--- 0-ADDRESS (STACK) ---', delay: 7000 },
  { text: '  PUSH A', delay: 7300 },
  { text: '  PUSH B', delay: 7600 },
  { text: '  ADD', delay: 7900 },
  { text: '  PUSH C', delay: 8200 },
  { text: '  PUSH D', delay: 8500 },
  { text: '  SUB', delay: 8800 },
  { text: '  MUL', delay: 9100 },
  { text: '  POP  X', delay: 9400 },
  { text: '  Total Instructions: 8', delay: 9700 },
];

export function InstructionSimulator() {
  const [showHowToRun, setShowHowToRun] = useState(false);
  const [copiedCommands, setCopiedCommands] = useState(false);
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const prefersReduced = usePrefersReducedMotion();

  const GITHUB_URL = 'https://github.com/saanvi-aggarwal/Instruction-Set-Simulator';

  const handleCopyCommands = () => {
    navigator.clipboard.writeText(RUN_COMMANDS);
    setCopiedCommands(true);
    setTimeout(() => setCopiedCommands(false), 2000);
  };

  useEffect(() => {
    if (prefersReduced) {
      setCurrentLineIndex(TERMINAL_LINES.length);
      return;
    }

    const timer = setInterval(() => {
      setCurrentLineIndex((prev) => {
        if (prev >= TERMINAL_LINES.length) {
          setTimeout(() => setCurrentLineIndex(1), 3000);
          return prev;
        }
        return prev + 1;
      });
    }, 280);

    return () => clearInterval(timer);
  }, [prefersReduced]);

  return (
    <div className="w-full space-y-8">
      {/* Main Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Specification Column */}
        <div className="lg:col-span-7 p-6 sm:p-10 rounded-[28px] bg-white border border-[rgba(13,13,13,0.1)] shadow-sm space-y-6">
          <div className="space-y-1.5">
            <span className="mono-tag text-xs text-[#77756f]">C++17 Project</span>
            <h2 className="heading-primary text-2xl sm:text-3xl lg:text-4xl text-[#0d0d0d]">
              Instruction Set Simulator
            </h2>
            <p className="font-mono text-xs text-[#77756f]">
              Stack-based Infix to Postfix parser and multi-format CPU instruction generator.
            </p>
          </div>

          <p className="text-sm sm:text-base text-[#3a3a3a] leading-relaxed">
            Developed a C++-based simulator that parses arithmetic expressions from infix to
            postfix notation using stack-based processing and operand validation.
            Generates equivalent 3-address, 2-address, 1-address (accumulator), and 0-address
            (stack) CPU instructions, simulating hardware register allocations and comparing
            instruction densities across instruction set architectures.
          </p>

          {/* Capabilities */}
          <div className="space-y-3 pt-2">
            <h3 className="text-xs font-mono uppercase tracking-wider text-[#77756f]">
              Core Capabilities
            </h3>
            <ul className="space-y-2">
              {[
                'Infix to postfix conversion using STL stack processing and input syntax validation (A-Z, operators, parentheses)',
                'Generates equivalent 3-address, 2-address, 1-address (accumulator), and 0-address (stack) instructions',
                'Simulates different instruction formats and operand-handling mechanisms',
                'Compares instruction counts across all four formats, analyzing CPU execution steps and register efficiency',
              ].map((feat, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-[#3a3a3a]">
                  <span className="font-mono text-[#0d0d0d] font-bold mt-0.5">•</span>
                  <span>{feat}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Technologies */}
          <div className="space-y-2 pt-2">
            <h3 className="text-xs font-mono uppercase tracking-wider text-[#77756f]">
              Tech Foundation
            </h3>
            <div className="flex flex-wrap gap-2">
              {['C++17', 'STL Stack', 'Assembly ISA', 'Computer Architecture', 'Infix/Postfix', 'Git'].map(
                (tech) => (
                  <span
                    key={tech}
                    className="font-mono text-xs px-3 py-1 rounded-full bg-[#f4f2ee] text-[#0d0d0d] border border-[rgba(13,13,13,0.06)]"
                  >
                    {tech}
                  </span>
                )
              )}
            </div>
          </div>

          {/* Primary Action + Run Toggle */}
          <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-[rgba(13,13,13,0.08)]">
            <a
              href={GITHUB_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-pill-primary text-xs sm:text-sm"
            >
              <span>View on GitHub</span>
              <span className="text-xs ml-1">↗</span>
            </a>

            <button
              type="button"
              onClick={() => setShowHowToRun(!showHowToRun)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-[rgba(13,13,13,0.15)] text-[#0d0d0d] text-xs sm:text-sm font-medium hover:border-[#0d0d0d] transition-colors"
            >
              <span>How to run</span>
              <span className="font-mono text-xs">{showHowToRun ? '▴' : '▾'}</span>
            </button>
          </div>

          {/* Collapsible Runbook */}
          {showHowToRun && (
            <div className="p-4 rounded-xl bg-[#faf9f5] border border-[rgba(13,13,13,0.08)] space-y-3 animate-in fade-in duration-200">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-[#77756f]">
                  Terminal Commands (from repository README)
                </span>
                <button
                  type="button"
                  onClick={handleCopyCommands}
                  className="text-xs font-mono px-2.5 py-1 rounded-full bg-white border border-[rgba(13,13,13,0.12)] hover:border-[#0d0d0d] transition-colors"
                >
                  {copiedCommands ? 'Copied ✓' : 'Copy Commands'}
                </button>
              </div>

              <pre className="font-mono text-xs text-[#0d0d0d] overflow-x-auto p-3 bg-white rounded-lg border border-[rgba(13,13,13,0.06)] leading-relaxed">
                {RUN_COMMANDS}
              </pre>
            </div>
          )}
        </div>

        {/* Right Terminal Simulation Column */}
        <div className="lg:col-span-5 space-y-4">
          <div className="rounded-[28px] bg-[#faf9f5] border border-[rgba(13,13,13,0.1)] shadow-sm overflow-hidden flex flex-col">
            {/* Terminal Title Bar */}
            <div className="flex items-center justify-between px-5 py-3.5 bg-[#f4f2ee] border-b border-[rgba(13,13,13,0.08)]">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-[#d4d2cc]" />
                <div className="w-2.5 h-2.5 rounded-full bg-[#d4d2cc]" />
                <div className="w-2.5 h-2.5 rounded-full bg-[#d4d2cc]" />
              </div>
              <span className="font-mono text-[11px] text-[#77756f]">
                simulator — bash (C++17)
              </span>
              <div className="w-8" />
            </div>

            {/* Terminal Body */}
            <div className="p-5 font-mono text-xs leading-relaxed text-[#0d0d0d] min-h-[380px] max-h-[460px] overflow-y-auto space-y-1">
              {TERMINAL_LINES.slice(0, currentLineIndex).map((line, idx) => (
                <div
                  key={idx}
                  className={`${
                    line.text.startsWith('$')
                      ? 'text-[#0d0d0d] font-bold'
                      : line.text.startsWith('---')
                      ? 'text-[#77756f] font-semibold mt-2'
                      : line.text.startsWith('Total')
                      ? 'text-emerald-700 font-semibold'
                      : 'text-[#3a3a3a]'
                  }`}
                >
                  {line.text}
                </div>
              ))}
              <span className="inline-block w-2 h-4 bg-[#0d0d0d] animate-pulse align-middle ml-0.5" />
            </div>
          </div>

          {/* Repo Specs Grid */}
          <div className="p-5 rounded-[22px] bg-white border border-[rgba(13,13,13,0.1)] grid grid-cols-2 gap-3 text-xs font-mono shadow-2xs">
            <div>
              <span className="text-[#77756f] block">Source Standard</span>
              <span className="font-bold text-[#0d0d0d]">C++17 (ISO/IEC)</span>
            </div>
            <div>
              <span className="text-[#77756f] block">Data Structures</span>
              <span className="font-bold text-[#0d0d0d]">std::stack, std::string</span>
            </div>
            <div>
              <span className="text-[#77756f] block">Address Modes</span>
              <span className="font-bold text-[#0d0d0d]">3, 2, 1, 0 Formats</span>
            </div>
            <div>
              <span className="text-[#77756f] block">Repository Status</span>
              <span className="font-bold text-emerald-700">Public · Verified</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
