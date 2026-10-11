import { describe, it, expect } from 'vitest';
import {
  validateNumber,
  convertNumber,
  computeTwosComplement,
  generatePracticeQuestion,
  checkAnswer,
  detectPrefix,
} from '../numberSystems';

describe('Number Systems Converter Engine', () => {
  describe('Validation', () => {
    it('handles empty input cleanly without crashing', () => {
      const res = validateNumber('', 2);
      expect(res.isValid).toBe(true);
      expect(res.isEmpty).toBe(true);
      expect(res.error).toBeNull();
    });

    it('rejects invalid digits for binary', () => {
      const res = validateNumber('10201', 2);
      expect(res.isValid).toBe(false);
      expect(res.offendingChar).toBe('2');
      expect(res.error).toContain("'2' is not a valid binary digit");
    });

    it('rejects invalid digits for octal', () => {
      const res = validateNumber('780', 8);
      expect(res.isValid).toBe(false);
      expect(res.offendingChar).toBe('8');
      expect(res.error).toContain("'8' is not a valid octal digit");
    });

    it('rejects multiple decimal points', () => {
      const res = validateNumber('10.10.1', 2);
      expect(res.isValid).toBe(false);
      expect(res.error).toContain('at most one decimal point');
    });

    it('accepts valid hex digits case-insensitively', () => {
      const res = validateNumber('2F.a9', 16);
      expect(res.isValid).toBe(true);
      expect(res.error).toBeNull();
    });
  });

  describe('Conversions required by specification', () => {
    it('converts 1010 (bin) -> 10 (dec)', () => {
      const res = convertNumber('1010', 2, 10);
      expect(res).not.toBeNull();
      expect(res?.fullOutput).toBe('10');
      expect(res?.explanation.method).toBe('positional');
      expect(res?.explanation.positionalSteps?.length).toBe(4);
    });

    it('converts 255 (dec) -> FF (hex)', () => {
      const res = convertNumber('255', 10, 16);
      expect(res).not.toBeNull();
      expect(res?.fullOutput).toBe('FF');
      expect(res?.explanation.method).toBe('repeated-division');
      expect(res?.explanation.divisionSteps?.length).toBeGreaterThan(0);
    });

    it('converts FF (hex) -> 11111111 (bin) using grouping', () => {
      const res = convertNumber('FF', 16, 2);
      expect(res).not.toBeNull();
      expect(res?.fullOutput).toBe('11111111');
      expect(res?.explanation.method).toBe('power-of-2');
      expect(res?.explanation.grouping).toBeDefined();
      expect(res?.explanation.grouping?.groupSize).toBe(4);
    });

    it('converts 1011.101 (bin) -> 11.625 (dec)', () => {
      const res = convertNumber('1011.101', 2, 10);
      expect(res).not.toBeNull();
      expect(res?.fullOutput).toBe('11.625');
      expect(res?.integerOutput).toBe('11');
      expect(res?.fractionOutput).toBe('625');
      expect(res?.isApproximate).toBe(false);
    });

    it('converts 0.1 (dec) -> binary approx with non-terminating note', () => {
      const res = convertNumber('0.1', 10, 2);
      expect(res).not.toBeNull();
      expect(res?.isApproximate).toBe(true);
      expect(res?.fractionOutput.length).toBeLessThanOrEqual(12);
      expect(res?.fullOutput.startsWith('0.000110011001')).toBe(true);
    });

    it('calculates two\'s complement for -45 (dec): 8-bit = 11010011', () => {
      const twos = computeTwosComplement(BigInt(45), 8);
      expect(twos.twosComplement).toBe('11010011');
      expect(twos.inRange).toBe(true);

      const conv = convertNumber('-45', 10, 2);
      expect(conv?.twosComplement?.[8].twosComplement).toBe('11010011');
    });

    it('converts 777 (oct) -> 511 (dec)', () => {
      const res = convertNumber('777', 8, 10);
      expect(res).not.toBeNull();
      expect(res?.fullOutput).toBe('511');
    });

    it('converts 7F (hex) -> 177 (oct) using power-of-2 intermediate binary grouping', () => {
      const res = convertNumber('7F', 16, 8);
      expect(res).not.toBeNull();
      expect(res?.fullOutput).toBe('177');
      expect(res?.explanation.method).toBe('power-of-2');
    });

    it('supports custom base 36 (e.g. Z -> 35 in decimal and 35 in base 36 -> Z)', () => {
      const resToDec = convertNumber('Z', 36, 10);
      expect(resToDec?.fullOutput).toBe('35');

      const resFromDec = convertNumber('35', 10, 36);
      expect(resFromDec?.fullOutput).toBe('Z');

      const resBase36 = convertNumber('10', 36, 10);
      expect(resBase36?.fullOutput).toBe('36');
    });

    it('handles negative numbers across conversions', () => {
      const res = convertNumber('-15', 10, 16);
      expect(res?.isNegative).toBe(true);
      expect(res?.fullOutput).toBe('-F');
    });
  });

  describe('Practice mode and answer checker', () => {
    it('generates valid practice questions for all difficulties', () => {
      const easy = generatePracticeQuestion('easy');
      expect(easy.prompt).toBeDefined();
      expect(easy.correctAnswer).toBeDefined();

      const med = generatePracticeQuestion('medium');
      expect(med.prompt).toBeDefined();
      expect(med.correctAnswer).toBeDefined();

      const hard = generatePracticeQuestion('hard');
      expect(hard.prompt).toBeDefined();
      expect(hard.correctAnswer).toBeDefined();
    });

    it('checks answers flexibly with case and leading zeros', () => {
      expect(checkAnswer('0011', '11')).toBe(true);
      expect(checkAnswer('ff', 'FF')).toBe(true);
      expect(checkAnswer('11.625', '11.625')).toBe(true);
      expect(checkAnswer('10', '11')).toBe(false);
    });
  });

  describe('Prefix Detection (0b, 0o, 0x)', () => {
    it('detects binary prefix 0b and 0B and strips it', () => {
      expect(detectPrefix('0b1011.101')).toEqual({ cleanInput: '1011.101', base: 2 });
      expect(detectPrefix('0B1100')).toEqual({ cleanInput: '1100', base: 2 });
      expect(detectPrefix('-0b101')).toEqual({ cleanInput: '-101', base: 2 });
    });

    it('detects octal prefix 0o and 0O and strips it', () => {
      expect(detectPrefix('0o755')).toEqual({ cleanInput: '755', base: 8 });
      expect(detectPrefix('0O77')).toEqual({ cleanInput: '77', base: 8 });
      expect(detectPrefix('+0o123')).toEqual({ cleanInput: '+123', base: 8 });
    });

    it('detects hexadecimal prefix 0x and 0X and strips it', () => {
      expect(detectPrefix('0xFF.8')).toEqual({ cleanInput: 'FF.8', base: 16 });
      expect(detectPrefix('0x255')).toEqual({ cleanInput: '255', base: 16 });
      expect(detectPrefix('-0x1A3')).toEqual({ cleanInput: '-1A3', base: 16 });
      expect(detectPrefix('0XABC')).toEqual({ cleanInput: 'ABC', base: 16 });
    });

    it('returns original input when no valid radix prefix is present', () => {
      expect(detectPrefix('1011.101')).toEqual({ cleanInput: '1011.101', base: null });
      expect(detectPrefix('255')).toEqual({ cleanInput: '255', base: null });
      expect(detectPrefix('0')).toEqual({ cleanInput: '0', base: null });
      expect(detectPrefix('')).toEqual({ cleanInput: '', base: null });
    });

    it('validates prefixed numbers seamlessly', () => {
      expect(validateNumber('0b1011', 2).isValid).toBe(true);
      expect(validateNumber('0B1100', 10).isValid).toBe(true);
      expect(validateNumber('0b', 2).isEmpty).toBe(true);
      expect(validateNumber('0x1A3', 10).isValid).toBe(true);
      expect(validateNumber('0x', 16).isEmpty).toBe(true);
      expect(validateNumber('0o755', 10).isValid).toBe(true);
      expect(validateNumber('0o', 8).isEmpty).toBe(true);
      expect(validateNumber('-0x2A', 10).isValid).toBe(true);
    });

    it('converts prefixed numbers by auto-detecting base', () => {
      const binRes = convertNumber('0b1011', 10, 10);
      expect(binRes?.fromBase).toBe(2);
      expect(binRes?.fullOutput).toBe('11');

      const hexRes = convertNumber('0x1A', 10, 10);
      expect(hexRes?.fromBase).toBe(16);
      expect(hexRes?.fullOutput).toBe('26');

      const hexToBin = convertNumber('0xFF', 10, 2);
      expect(hexToBin?.fromBase).toBe(16);
      expect(hexToBin?.fullOutput).toBe('11111111');

      const octRes = convertNumber('0o77', 10, 10);
      expect(octRes?.fromBase).toBe(8);
      expect(octRes?.fullOutput).toBe('63');
    });
  });
});


