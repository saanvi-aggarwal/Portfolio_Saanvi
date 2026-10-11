'use client';

import React, { useState, useEffect, useRef, useId, useMemo } from 'react';
import {
  validateNumber,
  convertNumber,
  detectPrefix,
  generatePracticeQuestion,
  checkAnswer,
  ConversionOutput,
  PositionalStep,
  DivisionStep,
  MultiplicationStep,
  BitGroup,
  DIGITS,
} from '@/lib/numberSystems';
import { usePrefersReducedMotion } from '@/lib/hooks';

interface BaseOption {
  label: string;
  name: string;
  digitsRange: string;
  value: number;
}

const PRESET_BASES: BaseOption[] = [
  { label: 'Binary', name: 'Binary', digitsRange: 'digits 0–1', value: 2 },
  { label: 'Octal', name: 'Octal', digitsRange: 'digits 0–7', value: 8 },
  { label: 'Decimal', name: 'Decimal', digitsRange: 'digits 0–9', value: 10 },
  { label: 'Hexadecimal', name: 'Hexadecimal', digitsRange: '0–9, A–F', value: 16 },
];

const TRY_CHIPS = [
  { label: '1011.101', val: '1011.101', from: 2, to: 10 },
  { label: '255', val: '255', from: 10, to: 16 },
  { label: 'FF.8', val: 'FF.8', from: 16, to: 2 },
  { label: '-45', val: '-45', from: 10, to: 2 },
];

function getBaseName(base: number): string {
  const found = PRESET_BASES.find((b) => b.value === base);
  return found ? found.name : `Base ${base}`;
}

function getHintForBase(base: number): string {
  if (base === 2) return 'Binary uses only 0 and 1';
  if (base === 8) return 'Octal uses only digits 0–7';
  if (base === 10) return 'Decimal uses only digits 0–9';
  if (base === 16) return 'Hexadecimal uses digits 0–9 and letters A–F';
  const maxChar = DIGITS[base - 1];
  return `Base ${base} uses digits 0–${maxChar}`;
}

export function NumberConverter() {
  const prefersReduced = usePrefersReducedMotion();

  // Mode: Convert or Practice
  const [mode, setMode] = useState<'convert' | 'practice'>('convert');

  // Converter state: default blank
  const [inputValue, setInputValue] = useState('');
  const [fromBase, setFromBase] = useState(10);
  const [toBase, setToBase] = useState(2);
  const [isSwapping, setIsSwapping] = useState(false);

  // Popover state
  const [openFromPopover, setOpenFromPopover] = useState(false);
  const [openToPopover, setOpenToPopover] = useState(false);
  const [customFromInput, setCustomFromInput] = useState('10');
  const [customToInput, setCustomToInput] = useState('2');
  const [showCustomFrom, setShowCustomFrom] = useState(false);
  const [showCustomTo, setShowCustomTo] = useState(false);

  // Input UX
  const [shake, setShake] = useState(false);
  const [hintMessage, setHintMessage] = useState<string | null>(null);
  const [highlightedDigitIdx, setHighlightedDigitIdx] = useState<number | null>(null);
  const [copiedResult, setCopiedResult] = useState(false);
  const [copiedChip, setCopiedChip] = useState<string | null>(null);

  // Negative integer two's complement bit width
  const [twosBits, setTwosBits] = useState<8 | 16 | 32>(8);

  // Steps animation
  const [stepsVisible, setStepsVisible] = useState(true);
  const [replayCount, setReplayCount] = useState(0);

  // Practice state
  const [practiceDifficulty, setPracticeDifficulty] = useState<'easy' | 'medium' | 'hard'>('easy');
  const [practiceQuestion, setPracticeQuestion] = useState(() => generatePracticeQuestion('easy'));
  const [practiceAnswer, setPracticeAnswer] = useState('');
  const [practiceStatus, setPracticeStatus] = useState<'unanswered' | 'correct' | 'incorrect'>('unanswered');
  const [showPracticeSteps, setShowPracticeSteps] = useState(false);
  const [practiceScore, setPracticeScore] = useState({ correct: 0, total: 0 });

  const inputRef = useRef<HTMLInputElement | null>(null);
  const hintTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const typingTimerRef = useRef<NodeJS.Timeout | null>(null);
  const fromPopoverRef = useRef<HTMLDivElement | null>(null);
  const toPopoverRef = useRef<HTMLDivElement | null>(null);
  const inputId = useId();

  // Close popovers on click outside or Esc
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      const target = e.target as Node;
      if (fromPopoverRef.current && !fromPopoverRef.current.contains(target)) {
        setOpenFromPopover(false);
      }
      if (toPopoverRef.current && !toPopoverRef.current.contains(target)) {
        setOpenToPopover(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpenFromPopover(false);
        setOpenToPopover(false);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Validation
  const validation = useMemo(() => {
    return validateNumber(inputValue, fromBase);
  }, [inputValue, fromBase]);

  // Conversion computation
  const conversionResult: ConversionOutput | null = useMemo(() => {
    if (!validation.isValid || validation.isEmpty) return null;
    return convertNumber(inputValue, fromBase, toBase);
  }, [inputValue, fromBase, toBase, validation]);

  // Step stagger reveal trigger (300ms after user stops typing)
  useEffect(() => {
    if (prefersReduced) {
      setStepsVisible(true);
      return;
    }
    setStepsVisible(false);
    if (typingTimerRef.current) clearTimeout(typingTimerRef.current);
    typingTimerRef.current = setTimeout(() => {
      setStepsVisible(true);
    }, 300);
    return () => {
      if (typingTimerRef.current) clearTimeout(typingTimerRef.current);
    };
  }, [inputValue, fromBase, toBase, replayCount, prefersReduced]);

  // Trigger hint with shake
  const triggerInvalidHint = (msg: string) => {
    setShake(true);
    setTimeout(() => setShake(false), 350);
    setHintMessage(msg);
    if (hintTimeoutRef.current) clearTimeout(hintTimeoutRef.current);
    hintTimeoutRef.current = setTimeout(() => {
      setHintMessage(null);
    }, 2400);
  };

  // Detected prefix base (if any)
  const detectedPrefixBase = useMemo(() => {
    const { base } = detectPrefix(inputValue);
    return base;
  }, [inputValue]);

  // Handle Input Changes with Prefix Detection (0b, 0o, 0x)
  const handleInputChange = (raw: string) => {
    setInputValue(raw);
    const { base } = detectPrefix(raw);
    if (base !== null && base !== fromBase) {
      setFromBase(base);
      if (toBase === base) {
        setToBase(base === 10 ? 2 : 10);
      }
    }
  };

  // Keyboard filter to disallow invalid characters
  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Allow control keys and navigation
    if (
      e.ctrlKey ||
      e.metaKey ||
      e.altKey ||
      e.key === 'Backspace' ||
      e.key === 'Delete' ||
      e.key === 'ArrowLeft' ||
      e.key === 'ArrowRight' ||
      e.key === 'ArrowUp' ||
      e.key === 'ArrowDown' ||
      e.key === 'Tab' ||
      e.key === 'Enter' ||
      e.key === 'Home' ||
      e.key === 'End'
    ) {
      return;
    }

    const key = e.key;
    const target = e.currentTarget;
    const selStart = target.selectionStart ?? inputValue.length;
    const textBefore = inputValue.slice(0, selStart);

    // Allow typing prefix characters 'b', 'B', 'o', 'O', 'x', 'X' after '0' (or '+0', '-0')
    if (['b', 'B', 'o', 'O', 'x', 'X'].includes(key)) {
      if (textBefore === '0' || textBefore === '+0' || textBefore === '-0') {
        return;
      }
    }

    // Allowed sign and decimal
    if (key === '-' || key === '+') {
      if (inputValue.includes('-') || inputValue.includes('+') || selStart > 0) {
        e.preventDefault();
        triggerInvalidHint('Sign can only be at the beginning');
      }
      return;
    }

    if (key === '.') {
      if (inputValue.includes('.')) {
        e.preventDefault();
        triggerInvalidHint('Only one decimal point is allowed');
      }
      return;
    }

    // Determine the active effective base
    const { base: prefixBase } = detectPrefix(inputValue);
    const activeBase = prefixBase !== null ? prefixBase : fromBase;

    // Check digit validity
    const upperKey = key.toUpperCase();
    const digitIdx = DIGITS.indexOf(upperKey);

    if (digitIdx === -1 || digitIdx >= activeBase) {
      e.preventDefault();
      triggerInvalidHint(getHintForBase(activeBase));
    }
  };

  // Swap Bases with 180° rotation
  const handleSwap = () => {
    setIsSwapping(true);
    setTimeout(() => setIsSwapping(false), 300);

    const oldFrom = fromBase;
    const oldTo = toBase;
    const oldResult = conversionResult ? conversionResult.fullOutput : inputValue;

    setFromBase(oldTo);
    setToBase(oldFrom);

    if (oldResult && oldResult !== '—') {
      setInputValue(oldResult);
    }
  };

  // Copy helper
  const handleCopy = (text: string, isMain = false, chipName = '') => {
    navigator.clipboard.writeText(text);
    if (isMain) {
      setCopiedResult(true);
      setTimeout(() => setCopiedResult(false), 1500);
    } else if (chipName) {
      setCopiedChip(chipName);
      setTimeout(() => setCopiedChip(null), 1500);
    }
  };

  // Try chip click handler
  const handleApplyTryChip = (val: string, from: number, to: number) => {
    setFromBase(from);
    setToBase(to);
    setInputValue(val);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  // Practice check
  const handleCheckPractice = () => {
    if (!practiceAnswer.trim()) return;
    const isCorrect = checkAnswer(practiceAnswer, practiceQuestion.correctAnswer);
    setPracticeStatus(isCorrect ? 'correct' : 'incorrect');
    setPracticeScore((prev) => ({
      correct: prev.correct + (isCorrect ? 1 : 0),
      total: prev.total + 1,
    }));
  };

  // Practice next question
  const handleNextPractice = (diff = practiceDifficulty) => {
    setPracticeDifficulty(diff);
    setPracticeQuestion(generatePracticeQuestion(diff));
    setPracticeAnswer('');
    setPracticeStatus('unanswered');
    setShowPracticeSteps(false);
  };

  // Touch device keyboard buttons for active fromBase
  const validTouchDigits = useMemo(() => {
    const list = DIGITS.slice(0, Math.min(fromBase, 16)).split('');
    return list;
  }, [fromBase]);

  const handleTouchDigitPress = (char: string) => {
    if (char === '⌫') {
      const nextVal = inputValue.slice(0, -1);
      handleInputChange(nextVal);
      return;
    }
    if (char === '.' && inputValue.includes('.')) return;
    if ((char === '-' || char === '+') && (inputValue.includes('-') || inputValue.includes('+'))) return;
    handleInputChange(inputValue + char);
  };

  return (
    <div className="w-full max-w-[880px] mx-auto rounded-[28px] bg-white border border-[rgba(13,13,13,0.1)] p-6 sm:p-10 shadow-sm space-y-8">
      {/* Top Switcher: Convert | Practice */}
      <div className="flex items-center justify-between border-b border-[rgba(13,13,13,0.08)] pb-4">
        <div className="flex items-center gap-6" role="tablist" aria-label="Converter Mode">
          <button
            type="button"
            role="tab"
            aria-selected={mode === 'convert'}
            onClick={() => setMode('convert')}
            className={`relative pb-2 text-sm font-semibold tracking-tight transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#0d0d0d] ${
              mode === 'convert' ? 'text-[#0d0d0d]' : 'text-[#77756f] hover:text-[#0d0d0d]'
            }`}
          >
            Convert
            {mode === 'convert' && (
              <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#0d0d0d] rounded-full" />
            )}
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={mode === 'practice'}
            onClick={() => setMode('practice')}
            className={`relative pb-2 text-sm font-semibold tracking-tight transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#0d0d0d] ${
              mode === 'practice' ? 'text-[#0d0d0d]' : 'text-[#77756f] hover:text-[#0d0d0d]'
            }`}
          >
            Practice
            {mode === 'practice' && (
              <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#0d0d0d] rounded-full" />
            )}
          </button>
        </div>

        {mode === 'practice' && (
          <div className="text-xs font-mono text-[#77756f]">
            Score: <span className="text-[#0d0d0d] font-bold">{practiceScore.correct}</span> / {practiceScore.total}
          </div>
        )}
      </div>

      {mode === 'convert' ? (
        <div className="space-y-8">
          {/* Top: From ⇄ To Pill Selects */}
          <div className="flex items-center justify-start gap-3 flex-wrap">
            {/* From Base Pill */}
            <div className="relative" ref={fromPopoverRef}>
              <button
                type="button"
                id="from-base-btn"
                aria-haspopup="listbox"
                aria-expanded={openFromPopover}
                onClick={() => {
                  setOpenFromPopover(!openFromPopover);
                  setOpenToPopover(false);
                }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[rgba(13,13,13,0.15)] bg-white text-xs font-medium text-[#0d0d0d] hover:border-[#0d0d0d] transition-all shadow-2xs focus-visible:ring-2 focus-visible:ring-[#0d0d0d]"
              >
                <span className="text-[#77756f]">From:</span>
                <span className="font-semibold">{getBaseName(fromBase)}</span>
                <span className="text-[10px] text-[#77756f] font-mono">▾</span>
              </button>

              {/* From Base Popover */}
              {openFromPopover && (
                <div
                  role="listbox"
                  aria-labelledby="from-base-btn"
                  className="absolute left-0 top-full mt-2 w-56 rounded-2xl bg-white border border-[rgba(13,13,13,0.12)] p-2 shadow-lg z-30 space-y-1 animate-in fade-in zoom-in-95 duration-150"
                >
                  {PRESET_BASES.map((b) => (
                    <button
                      key={b.value}
                      role="option"
                      aria-selected={fromBase === b.value}
                      onClick={() => {
                        setFromBase(b.value);
                        setOpenFromPopover(false);
                        setShowCustomFrom(false);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between transition-colors ${
                        fromBase === b.value
                          ? 'bg-[#0d0d0d] text-white font-medium'
                          : 'text-[#333] hover:bg-[#f4f2ee]'
                      }`}
                    >
                      <span>{b.label}</span>
                      <span className="font-mono text-[10px] opacity-70">{b.digitsRange}</span>
                    </button>
                  ))}

                  <div className="border-t border-[rgba(13,13,13,0.08)] pt-2 mt-1">
                    {!showCustomFrom ? (
                      <button
                        type="button"
                        onClick={() => setShowCustomFrom(true)}
                        className="w-full text-left px-3 py-1.5 rounded-xl text-xs text-[#77756f] hover:text-[#0d0d0d] hover:bg-[#f4f2ee] transition-colors"
                      >
                        Custom base (2–36)…
                      </button>
                    ) : (
                      <div className="px-3 py-2 space-y-2 bg-[#faf9f5] rounded-xl border border-[rgba(13,13,13,0.08)]">
                        <div className="flex items-center justify-between text-[11px] font-mono text-[#77756f]">
                          <span>Base (2–36):</span>
                          <span className="text-[#0d0d0d] font-bold">{customFromInput}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              const v = Math.max(2, parseInt(customFromInput, 10) - 1 || 2);
                              setCustomFromInput(String(v));
                              setFromBase(v);
                            }}
                            className="w-7 h-7 rounded-lg border border-[rgba(13,13,13,0.15)] flex items-center justify-center font-mono text-sm hover:bg-white"
                          >
                            −
                          </button>
                          <input
                            type="number"
                            min="2"
                            max="36"
                            value={customFromInput}
                            onChange={(e) => {
                              const v = Math.min(36, Math.max(2, parseInt(e.target.value, 10) || 2));
                              setCustomFromInput(String(v));
                              setFromBase(v);
                            }}
                            className="w-12 text-center text-xs font-mono border border-[rgba(13,13,13,0.15)] rounded-lg py-1 bg-white focus:outline-none"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const v = Math.min(36, parseInt(customFromInput, 10) + 1 || 36);
                              setCustomFromInput(String(v));
                              setFromBase(v);
                            }}
                            className="w-7 h-7 rounded-lg border border-[rgba(13,13,13,0.15)] flex items-center justify-center font-mono text-sm hover:bg-white"
                          >
                            +
                          </button>
                          <button
                            type="button"
                            onClick={() => setOpenFromPopover(false)}
                            className="ml-auto px-2 py-1 text-[11px] rounded-lg bg-[#0d0d0d] text-white font-medium"
                          >
                            Set
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Swap Button with 180° rotation */}
            <button
              type="button"
              onClick={handleSwap}
              aria-label="Swap from and to bases"
              className={`w-9 h-9 rounded-full border border-[rgba(13,13,13,0.15)] flex items-center justify-center text-sm font-mono text-[#0d0d0d] hover:bg-[#0d0d0d] hover:text-white hover:border-[#0d0d0d] transition-all duration-300 ${
                isSwapping ? 'rotate-180 scale-105' : ''
              }`}
            >
              ⇄
            </button>

            {/* To Base Pill */}
            <div className="relative" ref={toPopoverRef}>
              <button
                type="button"
                id="to-base-btn"
                aria-haspopup="listbox"
                aria-expanded={openToPopover}
                onClick={() => {
                  setOpenToPopover(!openToPopover);
                  setOpenFromPopover(false);
                }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[rgba(13,13,13,0.15)] bg-white text-xs font-medium text-[#0d0d0d] hover:border-[#0d0d0d] transition-all shadow-2xs focus-visible:ring-2 focus-visible:ring-[#0d0d0d]"
              >
                <span className="text-[#77756f]">To:</span>
                <span className="font-semibold">{getBaseName(toBase)}</span>
                <span className="text-[10px] text-[#77756f] font-mono">▾</span>
              </button>

              {/* To Base Popover */}
              {openToPopover && (
                <div
                  role="listbox"
                  aria-labelledby="to-base-btn"
                  className="absolute left-0 top-full mt-2 w-56 rounded-2xl bg-white border border-[rgba(13,13,13,0.12)] p-2 shadow-lg z-30 space-y-1 animate-in fade-in zoom-in-95 duration-150"
                >
                  {PRESET_BASES.map((b) => (
                    <button
                      key={b.value}
                      role="option"
                      aria-selected={toBase === b.value}
                      onClick={() => {
                        setToBase(b.value);
                        setOpenToPopover(false);
                        setShowCustomTo(false);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between transition-colors ${
                        toBase === b.value
                          ? 'bg-[#0d0d0d] text-white font-medium'
                          : 'text-[#333] hover:bg-[#f4f2ee]'
                      }`}
                    >
                      <span>{b.label}</span>
                      <span className="font-mono text-[10px] opacity-70">{b.digitsRange}</span>
                    </button>
                  ))}

                  <div className="border-t border-[rgba(13,13,13,0.08)] pt-2 mt-1">
                    {!showCustomTo ? (
                      <button
                        type="button"
                        onClick={() => setShowCustomTo(true)}
                        className="w-full text-left px-3 py-1.5 rounded-xl text-xs text-[#77756f] hover:text-[#0d0d0d] hover:bg-[#f4f2ee] transition-colors"
                      >
                        Custom base (2–36)…
                      </button>
                    ) : (
                      <div className="px-3 py-2 space-y-2 bg-[#faf9f5] rounded-xl border border-[rgba(13,13,13,0.08)]">
                        <div className="flex items-center justify-between text-[11px] font-mono text-[#77756f]">
                          <span>Base (2–36):</span>
                          <span className="text-[#0d0d0d] font-bold">{customToInput}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              const v = Math.max(2, parseInt(customToInput, 10) - 1 || 2);
                              setCustomToInput(String(v));
                              setToBase(v);
                            }}
                            className="w-7 h-7 rounded-lg border border-[rgba(13,13,13,0.15)] flex items-center justify-center font-mono text-sm hover:bg-white"
                          >
                            −
                          </button>
                          <input
                            type="number"
                            min="2"
                            max="36"
                            value={customToInput}
                            onChange={(e) => {
                              const v = Math.min(36, Math.max(2, parseInt(e.target.value, 10) || 2));
                              setCustomToInput(String(v));
                              setToBase(v);
                            }}
                            className="w-12 text-center text-xs font-mono border border-[rgba(13,13,13,0.15)] rounded-lg py-1 bg-white focus:outline-none"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const v = Math.min(36, parseInt(customToInput, 10) + 1 || 36);
                              setCustomToInput(String(v));
                              setToBase(v);
                            }}
                            className="w-7 h-7 rounded-lg border border-[rgba(13,13,13,0.15)] flex items-center justify-center font-mono text-sm hover:bg-white"
                          >
                            +
                          </button>
                          <button
                            type="button"
                            onClick={() => setOpenToPopover(false)}
                            className="ml-auto px-2 py-1 text-[11px] rounded-lg bg-[#0d0d0d] text-white font-medium"
                          >
                            Set
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Large Input with Soft Shake & Instant Feedback */}
          <div className="space-y-3">
            <div
              className={`relative border-b-2 transition-all duration-200 pb-2 ${
                shake ? 'animate-soft-shake border-[#0d0d0d]' : 'border-[rgba(13,13,13,0.2)] focus-within:border-[#0d0d0d]'
              }`}
            >
              <label htmlFor={inputId} className="sr-only">
                Number in base {fromBase}
              </label>
              <input
                id={inputId}
                ref={inputRef}
                type="text"
                value={inputValue}
                autoFocus
                inputMode="text"
                autoComplete="off"
                spellCheck="false"
                onChange={(e) => handleInputChange(e.target.value)}
                onKeyDown={handleInputKeyDown}
                placeholder={
                  fromBase === 2
                    ? 'Type a binary number (or 0x, 0o)…'
                    : fromBase === 8
                    ? 'Type an octal number (or 0b, 0x)…'
                    : fromBase === 10
                    ? 'Type a decimal number (or 0b, 0o, 0x)…'
                    : fromBase === 16
                    ? 'Type a hex number (or 0b, 0o)…'
                    : `Type a base-${fromBase} number…`
                }
                className="w-full bg-transparent font-mono text-3xl sm:text-4xl text-[#0d0d0d] placeholder-[rgba(13,13,13,0.3)] tracking-tight focus:outline-none"
              />

              {inputValue && (
                <button
                  type="button"
                  onClick={() => {
                    setInputValue('');
                    if (inputRef.current) inputRef.current.focus();
                  }}
                  className="absolute right-0 top-1/2 -translate-y-1/2 text-xs font-mono text-[#a9a6a0] hover:text-[#0d0d0d] p-1"
                  aria-label="Clear input"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Quiet Hint Line on Invalid Character (No red boxes) */}
            <div className="min-h-[20px]">
              {hintMessage ? (
                <p className="text-xs font-mono text-[#52504b] animate-in fade-in duration-150">
                  {hintMessage}
                </p>
              ) : detectedPrefixBase !== null ? (
                <p className="text-xs font-mono text-[#0d0d0d] font-medium animate-in fade-in duration-150 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#0d0d0d]" />
                  <span>Auto-detected:</span>
                  <span className="font-bold underline decoration-1 underline-offset-2">
                    {getBaseName(fromBase)}
                  </span>
                  <span className="text-[#77756f]">
                    ({fromBase === 2 ? '0b' : fromBase === 8 ? '0o' : '0x'} prefix active)
                  </span>
                </p>
              ) : (
                <p className="text-xs font-mono text-[#a9a6a0]">
                  Prefixes <span className="text-[#0d0d0d]">0b</span>, <span className="text-[#0d0d0d]">0o</span>, <span className="text-[#0d0d0d]">0x</span> auto-detect the base.
                </p>
              )}
            </div>

            {/* Custom Digit Row for Touch Devices */}
            <div className="sm:hidden flex flex-wrap gap-1.5 pt-1">
              {validTouchDigits.map((char) => (
                <button
                  key={char}
                  type="button"
                  onClick={() => handleTouchDigitPress(char)}
                  className="px-2.5 py-1.5 rounded-lg border border-[rgba(13,13,13,0.12)] bg-[#faf9f5] font-mono text-xs text-[#0d0d0d] active:scale-95 transition-all"
                >
                  {char}
                </button>
              ))}
              <button
                type="button"
                onClick={() => handleTouchDigitPress('.')}
                className="px-2.5 py-1.5 rounded-lg border border-[rgba(13,13,13,0.12)] bg-[#faf9f5] font-mono text-xs text-[#0d0d0d] active:scale-95"
              >
                .
              </button>
              <button
                type="button"
                onClick={() => handleTouchDigitPress('-')}
                className="px-2.5 py-1.5 rounded-lg border border-[rgba(13,13,13,0.12)] bg-[#faf9f5] font-mono text-xs text-[#0d0d0d] active:scale-95"
              >
                −
              </button>
              <button
                type="button"
                onClick={() => handleTouchDigitPress('⌫')}
                className="px-2.5 py-1.5 rounded-lg border border-[rgba(13,13,13,0.12)] bg-[#faf9f5] font-mono text-xs text-[#0d0d0d] active:scale-95"
              >
                ⌫
              </button>
            </div>

            {/* Small Quiet Try: chips */}
            <div className="flex items-center gap-2 flex-wrap pt-1">
              <span className="text-xs font-mono text-[#77756f]">Try:</span>
              {TRY_CHIPS.map((chip) => (
                <button
                  key={chip.label}
                  type="button"
                  onClick={() => handleApplyTryChip(chip.val, chip.from, chip.to)}
                  className="px-2.5 py-1 rounded-full text-xs font-mono bg-[#f4f2ee] text-[#0d0d0d] border border-[rgba(13,13,13,0.08)] hover:bg-[#0d0d0d] hover:text-white transition-all shadow-2xs"
                >
                  {chip.label}
                </button>
              ))}
            </div>
          </div>

          {/* Result Section */}
          <div className="space-y-4 pt-2 border-t border-[rgba(13,13,13,0.08)]">
            <div className="flex items-baseline justify-between gap-4 flex-wrap">
              <div className="flex items-baseline gap-2">
                <span className="text-xl sm:text-2xl font-mono text-[#77756f]">
                  {conversionResult?.isApproximate ? '≈' : '='}
                </span>
                <div
                  className="font-mono text-3xl sm:text-5xl text-[#0d0d0d] tracking-tight font-bold break-all transition-opacity duration-150"
                  aria-live="polite"
                >
                  {conversionResult ? conversionResult.fullOutput : '—'}
                </div>
              </div>

              {conversionResult && (
                <button
                  type="button"
                  onClick={() => handleCopy(conversionResult.fullOutput, true)}
                  aria-label="Copy result"
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-[rgba(13,13,13,0.12)] bg-white text-xs font-mono text-[#0d0d0d] hover:bg-[#0d0d0d] hover:text-white transition-all shadow-2xs"
                >
                  {copiedResult ? (
                    <>
                      <span>✓</span>
                      <span>Copied</span>
                    </>
                  ) : (
                    <>
                      <span>⧉</span>
                      <span>Copy</span>
                    </>
                  )}
                </button>
              )}
            </div>

            {/* Non-terminating fraction note */}
            {conversionResult?.isApproximate && (
              <p className="text-xs font-mono text-[#77756f]">
                Non-terminating fraction in base {toBase} (expanded to 10 fractional places).
              </p>
            )}

            {/* 4 Small Read-only Chips: Bin · Oct · Dec · Hex */}
            {conversionResult && (
              <div className="flex items-center gap-2 flex-wrap pt-2">
                {(
                  [
                    { key: 'bin', name: 'Bin', val: conversionResult.allBases.bin },
                    { key: 'oct', name: 'Oct', val: conversionResult.allBases.oct },
                    { key: 'dec', name: 'Dec', val: conversionResult.allBases.dec },
                    { key: 'hex', name: 'Hex', val: conversionResult.allBases.hex },
                  ] as const
                ).map((b) => (
                  <button
                    key={b.key}
                    type="button"
                    onClick={() => handleCopy(b.val, false, b.key)}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-mono bg-[#faf9f5] border border-[rgba(13,13,13,0.08)] hover:border-[#0d0d0d] transition-all"
                    title={`Click to copy ${b.name}`}
                  >
                    <span className="text-[#77756f] uppercase">{b.name}:</span>
                    <span className="text-[#0d0d0d] font-medium">{b.val}</span>
                    {copiedChip === b.key && <span className="text-[10px] text-[#0d0d0d]">✓</span>}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* "How we got there" Stepper */}
          {conversionResult && conversionResult.explanation && (
            <div className="pt-6 border-t border-[rgba(13,13,13,0.08)] space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="heading-primary text-xl sm:text-2xl text-[#0d0d0d]">
                  How we got there
                </h3>
                <button
                  type="button"
                  onClick={() => setReplayCount((c) => c + 1)}
                  aria-label="Replay explanation steps"
                  className="w-8 h-8 rounded-full border border-[rgba(13,13,13,0.12)] flex items-center justify-center font-mono text-xs text-[#77756f] hover:text-[#0d0d0d] hover:border-[#0d0d0d] transition-all"
                  title="Replay steps"
                >
                  ↻
                </button>
              </div>

              {/* Vertical Stepper Container */}
              <div className="relative pl-6 sm:pl-8 space-y-8 before:absolute before:left-3 sm:before:left-4 before:top-3 before:bottom-3 before:w-[1px] before:bg-[rgba(13,13,13,0.12)]">
                {/* Positional Notation to Decimal */}
                {conversionResult.explanation.positionalSteps && conversionResult.explanation.positionalSteps.length > 0 && (
                  <div
                    className={`relative space-y-3 transition-all duration-300 ${
                      stepsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                    }`}
                  >
                    <div className="absolute -left-6 sm:-left-8 top-0 w-6 sm:w-8 h-6 flex items-center justify-center">
                      <span className="w-5 h-5 rounded-full bg-[#0d0d0d] text-white font-mono text-[11px] flex items-center justify-center">
                        1
                      </span>
                    </div>

                    <p className="text-sm text-[#0d0d0d] font-sans">
                      Multiply each digit by base {fromBase} raised to its place value power, then sum the terms.
                    </p>

                    <div className="overflow-x-auto border border-[rgba(13,13,13,0.08)] rounded-xl bg-[#faf9f5]">
                      <table className="w-full text-left text-xs font-mono">
                        <thead>
                          <tr className="border-b border-[rgba(13,13,13,0.08)] text-[#77756f]">
                            <th className="py-2.5 px-3">Digit</th>
                            <th className="py-2.5 px-3">Position</th>
                            <th className="py-2.5 px-3">Weight ({fromBase}ⁿ)</th>
                            <th className="py-2.5 px-3">Product</th>
                          </tr>
                        </thead>
                        <tbody>
                          {conversionResult.explanation.positionalSteps.map((step, idx) => {
                            const isHighlighted = highlightedDigitIdx === idx;
                            return (
                              <tr
                                key={idx}
                                onMouseEnter={() => setHighlightedDigitIdx(idx)}
                                onMouseLeave={() => setHighlightedDigitIdx(null)}
                                className={`border-b border-[rgba(13,13,13,0.05)] transition-colors ${
                                  isHighlighted ? 'bg-[#f0ece1]' : 'hover:bg-white'
                                }`}
                              >
                                <td className="py-2 px-3 font-bold text-[#0d0d0d]">{step.digit}</td>
                                <td className="py-2 px-3 text-[#77756f]">{step.position}</td>
                                <td className="py-2 px-3 text-[#52504b]">{step.weightStr}</td>
                                <td className="py-2 px-3 font-semibold text-[#0d0d0d] underline decoration-1 underline-offset-3">
                                  {step.productStr}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>

                    <p className="text-sm font-mono font-bold text-[#0d0d0d] pt-1">
                      Total Decimal Sum: {conversionResult.explanation.decimalResult}
                    </p>
                  </div>
                )}

                {/* Repeated Division (Decimal -> Any) */}
                {conversionResult.explanation.divisionSteps && conversionResult.explanation.divisionSteps.length > 0 && (
                  <div
                    className={`relative space-y-3 transition-all duration-300 delay-75 ${
                      stepsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                    }`}
                  >
                    <div className="absolute -left-6 sm:-left-8 top-0 w-6 sm:w-8 h-6 flex items-center justify-center">
                      <span className="w-5 h-5 rounded-full bg-[#0d0d0d] text-white font-mono text-[11px] flex items-center justify-center">
                        {conversionResult.explanation.positionalSteps ? '2' : '1'}
                      </span>
                    </div>

                    <p className="text-sm text-[#0d0d0d] font-sans">
                      Repeatedly divide the integer part by base {toBase}, recording the remainder at each step.
                    </p>

                    <div className="overflow-x-auto border border-[rgba(13,13,13,0.08)] rounded-xl bg-[#faf9f5]">
                      <table className="w-full text-left text-xs font-mono">
                        <thead>
                          <tr className="border-b border-[rgba(13,13,13,0.08)] text-[#77756f]">
                            <th className="py-2.5 px-3">Dividend</th>
                            <th className="py-2.5 px-3">Divisor</th>
                            <th className="py-2.5 px-3">Quotient</th>
                            <th className="py-2.5 px-3">Remainder</th>
                          </tr>
                        </thead>
                        <tbody>
                          {conversionResult.explanation.divisionSteps.map((step, idx) => (
                            <tr key={idx} className="border-b border-[rgba(13,13,13,0.05)] hover:bg-white">
                              <td className="py-2 px-3 text-[#52504b]">{step.dividend}</td>
                              <td className="py-2 px-3 text-[#77756f]">{step.divisor}</td>
                              <td className="py-2 px-3 text-[#52504b]">{step.quotient}</td>
                              <td className="py-2 px-3 font-bold text-[#0d0d0d] underline decoration-1 underline-offset-3">
                                {step.remainderDigit}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    <p className="text-sm font-sans font-bold text-[#0d0d0d] pt-1">
                      Read the remainders from bottom to top: {conversionResult.integerOutput}
                    </p>
                  </div>
                )}

                {/* Repeated Multiplication (Fraction -> Any) */}
                {conversionResult.explanation.multiplicationSteps && conversionResult.explanation.multiplicationSteps.length > 0 && (
                  <div
                    className={`relative space-y-3 transition-all duration-300 delay-150 ${
                      stepsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                    }`}
                  >
                    <div className="absolute -left-6 sm:-left-8 top-0 w-6 sm:w-8 h-6 flex items-center justify-center">
                      <span className="w-5 h-5 rounded-full bg-[#0d0d0d] text-white font-mono text-[11px] flex items-center justify-center">
                        •
                      </span>
                    </div>

                    <p className="text-sm text-[#0d0d0d] font-sans">
                      Repeatedly multiply the fraction by base {toBase}, extracting the integer digit at each step.
                    </p>

                    <div className="overflow-x-auto border border-[rgba(13,13,13,0.08)] rounded-xl bg-[#faf9f5]">
                      <table className="w-full text-left text-xs font-mono">
                        <thead>
                          <tr className="border-b border-[rgba(13,13,13,0.08)] text-[#77756f]">
                            <th className="py-2.5 px-3">Operation</th>
                            <th className="py-2.5 px-3">Product</th>
                            <th className="py-2.5 px-3">Extracted Digit</th>
                            <th className="py-2.5 px-3">Remaining Fraction</th>
                          </tr>
                        </thead>
                        <tbody>
                          {conversionResult.explanation.multiplicationSteps.map((step, idx) => (
                            <tr key={idx} className="border-b border-[rgba(13,13,13,0.05)] hover:bg-white">
                              <td className="py-2 px-3 text-[#52504b]">{step.multiplicationStr}</td>
                              <td className="py-2 px-3 text-[#52504b]">{step.productStr}</td>
                              <td className="py-2 px-3 font-bold text-[#0d0d0d] underline decoration-1 underline-offset-3">
                                {step.digitChar}
                              </td>
                              <td className="py-2 px-3 text-[#77756f]">{step.remainderFractionStr}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    <p className="text-sm font-sans font-bold text-[#0d0d0d] pt-1">
                      Read extracted digits from top to bottom: 0.{conversionResult.fractionOutput}
                    </p>
                  </div>
                )}

                {/* 3-bit / 4-bit Grouping Shortcut */}
                {conversionResult.explanation.grouping && (
                  <div
                    className={`relative space-y-3 transition-all duration-300 ${
                      stepsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                    }`}
                  >
                    <div className="absolute -left-6 sm:-left-8 top-0 w-6 sm:w-8 h-6 flex items-center justify-center">
                      <span className="w-5 h-5 rounded-full bg-[#0d0d0d] text-white font-mono text-[11px] flex items-center justify-center">
                        1
                      </span>
                    </div>

                    <p className="text-sm text-[#0d0d0d] font-sans">
                      Power-of-two direct mapping: group binary bits into {conversionResult.explanation.grouping.groupSize}-bit clusters from the radix point.
                    </p>

                    <div className="p-4 rounded-xl bg-[#faf9f5] border border-[rgba(13,13,13,0.08)] space-y-3">
                      <div className="flex flex-wrap items-center gap-2">
                        {conversionResult.explanation.grouping.integerGroups.map((grp, gIdx) => (
                          <div key={gIdx} className="flex flex-col items-center">
                            <span className="px-2 py-0.5 rounded bg-white border border-[rgba(13,13,13,0.1)] font-mono text-xs text-[#0d0d0d]">
                              {grp.bits}
                            </span>
                            <span className="text-[10px] text-[#77756f] font-mono mt-0.5">↓</span>
                            <span className="font-mono text-sm font-bold text-[#0d0d0d] underline underline-offset-2">
                              {grp.digit}
                            </span>
                          </div>
                        ))}

                        {conversionResult.explanation.grouping.fractionGroups.length > 0 && (
                          <span className="font-mono text-lg font-bold text-[#77756f] px-1">.</span>
                        )}

                        {conversionResult.explanation.grouping.fractionGroups.map((grp, gIdx) => (
                          <div key={`frac-${gIdx}`} className="flex flex-col items-center">
                            <span className="px-2 py-0.5 rounded bg-white border border-[rgba(13,13,13,0.1)] font-mono text-xs text-[#0d0d0d]">
                              {grp.bits}
                            </span>
                            <span className="text-[10px] text-[#77756f] font-mono mt-0.5">↓</span>
                            <span className="font-mono text-sm font-bold text-[#0d0d0d] underline underline-offset-2">
                              {grp.digit}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <p className="text-sm font-sans font-bold text-[#0d0d0d] pt-1">
                      Direct mapped output: {conversionResult.fullOutput}
                    </p>
                  </div>
                )}

                {/* Two's Complement Step (Visible only for Negative Integers) */}
                {conversionResult.isNegative && conversionResult.twosComplement && (
                  <div className="relative space-y-3 pt-2">
                    <div className="absolute -left-6 sm:-left-8 top-2 w-6 sm:w-8 h-6 flex items-center justify-center">
                      <span className="w-5 h-5 rounded-full bg-[#0d0d0d] text-white font-mono text-[11px] flex items-center justify-center">
                        ±
                      </span>
                    </div>

                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <p className="text-sm text-[#0d0d0d] font-sans font-medium">
                        Two&apos;s Complement Representation:
                      </p>

                      {/* Tiny Segmented Control for Bit Width */}
                      <div className="inline-flex items-center p-0.5 rounded-full bg-[#f4f2ee] border border-[rgba(13,13,13,0.1)]">
                        {([8, 16, 32] as const).map((bits) => (
                          <button
                            key={bits}
                            type="button"
                            onClick={() => setTwosBits(bits)}
                            className={`px-2.5 py-0.5 rounded-full text-[11px] font-mono transition-all ${
                              twosBits === bits
                                ? 'bg-[#0d0d0d] text-white shadow-2xs font-bold'
                                : 'text-[#77756f] hover:text-[#0d0d0d]'
                            }`}
                          >
                            {bits}-bit
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="p-4 rounded-xl bg-[#faf9f5] border border-[rgba(13,13,13,0.08)] space-y-2 text-xs font-mono">
                      <div className="flex justify-between border-b border-[rgba(13,13,13,0.06)] pb-1.5">
                        <span className="text-[#77756f]">Magnitude Binary:</span>
                        <span className="text-[#0d0d0d] font-bold">
                          {conversionResult.twosComplement[twosBits].magnitudeBinary}
                        </span>
                      </div>
                      <div className="flex justify-between border-b border-[rgba(13,13,13,0.06)] pb-1.5">
                        <span className="text-[#77756f]">One&apos;s Complement (Invert):</span>
                        <span className="text-[#0d0d0d]">
                          {conversionResult.twosComplement[twosBits].onesComplement}
                        </span>
                      </div>
                      <div className="flex justify-between pt-1 font-bold text-sm">
                        <span className="text-[#0d0d0d]">Two&apos;s Complement (+1):</span>
                        <span className="text-[#0d0d0d] underline decoration-2 underline-offset-4">
                          {conversionResult.twosComplement[twosBits].formattedTwosComplement}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Practice Mode View */
        <div className="space-y-6">
          {/* Difficulty Selector */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-[#77756f]">Difficulty:</span>
            {(['easy', 'medium', 'hard'] as const).map((d) => (
              <button
                key={d}
                type="button"
                onClick={() => handleNextPractice(d)}
                className={`px-3 py-1 rounded-full text-xs font-mono capitalize transition-all ${
                  practiceDifficulty === d
                    ? 'bg-[#0d0d0d] text-white shadow-2xs'
                    : 'bg-[#f4f2ee] text-[#52504b] hover:text-[#0d0d0d] border border-[rgba(13,13,13,0.08)]'
                }`}
              >
                {d}
              </button>
            ))}
          </div>

          {/* Question Card */}
          <div className="p-6 rounded-2xl bg-[#faf9f5] border border-[rgba(13,13,13,0.08)] space-y-4">
            <span className="text-xs font-mono uppercase tracking-wider text-[#77756f]">
              Question
            </span>
            <h4 className="heading-primary text-xl sm:text-2xl text-[#0d0d0d]">
              {practiceQuestion.prompt}
            </h4>

            {/* Answer Input + Check */}
            <div className="flex items-center gap-3 pt-2">
              <input
                type="text"
                value={practiceAnswer}
                onChange={(e) => setPracticeAnswer(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleCheckPractice();
                }}
                placeholder="Type your answer…"
                className="flex-1 px-4 py-2.5 rounded-full border border-[rgba(13,13,13,0.2)] bg-white font-mono text-base text-[#0d0d0d] focus:outline-none focus:border-[#0d0d0d]"
              />

              <button
                type="button"
                onClick={handleCheckPractice}
                className="btn-pill-primary text-xs py-2.5 px-6"
              >
                Check
              </button>
            </div>

            {/* Feedback message */}
            {practiceStatus === 'correct' && (
              <div className="flex items-center gap-2 text-sm font-mono text-[#10b981] pt-2">
                <span>✓</span>
                <span>Correct! Well done.</span>
              </div>
            )}

            {practiceStatus === 'incorrect' && (
              <div className="space-y-2 pt-2">
                <div className="flex items-center gap-2 text-sm font-mono text-[#0d0d0d]">
                  <span>✕</span>
                  <span>Not quite. Correct answer: <strong className="underline">{practiceQuestion.correctAnswer}</strong></span>
                </div>
                <button
                  type="button"
                  onClick={() => setShowPracticeSteps(!showPracticeSteps)}
                  className="text-xs font-mono text-[#77756f] underline hover:text-[#0d0d0d]"
                >
                  {showPracticeSteps ? 'Hide steps' : 'Show steps'}
                </button>
              </div>
            )}
          </div>

          {/* Next Button */}
          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => handleNextPractice(practiceDifficulty)}
              className="px-5 py-2 rounded-full border border-[rgba(13,13,13,0.2)] text-xs font-mono text-[#0d0d0d] hover:bg-[#0d0d0d] hover:text-white transition-all shadow-2xs"
            >
              Next Question →
            </button>
          </div>

          {/* Practice Stepper Solution */}
          {showPracticeSteps && practiceQuestion.explanation && (
            <div className="pt-4 border-t border-[rgba(13,13,13,0.08)] space-y-4">
              <h5 className="font-mono text-xs uppercase tracking-wider text-[#77756f]">
                Solution Derivation:
              </h5>
              <p className="text-xs text-[#0d0d0d] font-mono">
                {practiceQuestion.explanation.explanation.summarySentence}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
