/**
 * Number Systems Conversion Engine
 * Pure logic for base conversion (bases 2-36), precision math, fractional parts,
 * step-by-step mathematical explanations, power-of-2 grouping, and two's complement.
 */

export const DIGITS = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';

export interface ValidationResult {
  isValid: boolean;
  isEmpty: boolean;
  error: string | null;
  offendingChar?: string;
  offendingIndex?: number;
  isNegative?: boolean;
  integerStr?: string;
  fractionStr?: string;
}

export interface PositionalStep {
  digit: string;
  digitValue: number;
  position: number;
  weightStr: string;
  weightNum: number;
  productStr: string;
  productNum: number;
}

export interface DivisionStep {
  dividend: string;
  divisor: number;
  quotient: string;
  remainder: number;
  remainderDigit: string;
}

export interface MultiplicationStep {
  multiplicationStr: string;
  productStr: string;
  integerPart: number;
  digitChar: string;
  remainderFractionStr: string;
}

export interface BitGroup {
  bits: string;
  digit: string;
  paddedCount: number; // how many zeros were padded
  side: 'integer' | 'fraction';
}

export interface GroupingExplanation {
  type: 'bin-to-oct' | 'bin-to-hex' | 'oct-to-bin' | 'hex-to-bin' | 'oct-to-hex' | 'hex-to-oct';
  groupSize: number;
  integerGroups: BitGroup[];
  fractionGroups: BitGroup[];
  intermediateBinary?: string;
}

export interface TwosComplementResult {
  bits: number;
  magnitudeBinary: string;
  onesComplement: string;
  twosComplement: string;
  formattedTwosComplement: string;
  inRange: boolean;
}

export interface ConversionExplanation {
  method: 'positional' | 'repeated-division' | 'power-of-2' | 'two-stage';
  sourceBase: number;
  targetBase: number;
  isNegative: boolean;
  summarySentence: string;
  whyItWorks: string;

  // For positional (Any -> Decimal)
  positionalSteps?: PositionalStep[];
  positionalEquation?: string;
  decimalResult?: string;

  // For repeated division & multiplication (Decimal -> Any)
  divisionSteps?: DivisionStep[];
  multiplicationSteps?: MultiplicationStep[];

  // For direct grouping (Binary <-> Octal <-> Hex)
  grouping?: GroupingExplanation;

  // Two-stage intermediate decimal steps
  firstStage?: ConversionExplanation;
  secondStage?: ConversionExplanation;
}

export interface ConversionOutput {
  input: string;
  fromBase: number;
  toBase: number;
  isNegative: boolean;
  integerOutput: string;
  fractionOutput: string;
  fullOutput: string;
  isApproximate: boolean;
  allBases: {
    bin: string;
    oct: string;
    dec: string;
    hex: string;
  };
  explanation: ConversionExplanation;
  twosComplement?: {
    8: TwosComplementResult;
    16: TwosComplementResult;
    32: TwosComplementResult;
  };
}

/**
 * Validates whether an input string is a valid representation in a given base.
 */
export function validateNumber(rawInput: string, base: number): ValidationResult {
  const trimmed = rawInput.trim();
  if (!trimmed) {
    return { isValid: true, isEmpty: true, error: null };
  }

  // Detect prefix (0b, 0o, 0x) if present
  const { cleanInput, base: detectedBase } = detectPrefix(trimmed);
  const effectiveBase = detectedBase !== null ? detectedBase : base;

  // If input is only the prefix (e.g. "0b", "0o", "0x", "+0x", "-0b"):
  // Treat as valid but empty so user isn't shown an error while still typing prefix
  if (detectedBase !== null) {
    const rawNoSign = trimmed.startsWith('-') || trimmed.startsWith('+') ? trimmed.slice(1) : trimmed;
    if (rawNoSign.length <= 2) {
      return { isValid: true, isEmpty: true, error: null };
    }
  }

  let str = cleanInput;
  let isNegative = false;

  if (str.startsWith('-')) {
    isNegative = true;
    str = str.slice(1);
  } else if (str.startsWith('+')) {
    str = str.slice(1);
  }

  if (!str) {
    return { isValid: false, isEmpty: false, error: 'Enter at least one digit after the sign.' };
  }

  const parts = str.split('.');
  if (parts.length > 2) {
    return {
      isValid: false,
      isEmpty: false,
      error: 'A number can contain at most one decimal point.',
      offendingChar: '.',
      offendingIndex: trimmed.indexOf('.', trimmed.indexOf('.') + 1),
    };
  }

  const integerPart = parts[0] || '0';
  const fractionPart = parts[1] || '';

  // Validate all characters in integer and fraction parts
  const validCharset = DIGITS.slice(0, effectiveBase);

  for (let i = 0; i < str.length; i++) {
    const char = str[i];
    if (char === '.') continue;
    const upperChar = char.toUpperCase();
    const digitVal = DIGITS.indexOf(upperChar);

    if (digitVal === -1 || digitVal >= effectiveBase) {
      const baseName =
        effectiveBase === 2 ? 'binary' : effectiveBase === 8 ? 'octal' : effectiveBase === 10 ? 'decimal' : effectiveBase === 16 ? 'hexadecimal' : `base-${effectiveBase}`;
      const actualIdx = (isNegative ? 1 : 0) + i;
      return {
        isValid: false,
        isEmpty: false,
        error: `'${char}' is not a valid ${baseName} digit (allowed: ${validCharset[0]}–${validCharset[validCharset.length - 1]}).`,
        offendingChar: char,
        offendingIndex: actualIdx,
      };
    }
  }

  return {
    isValid: true,
    isEmpty: false,
    error: null,
    isNegative,
    integerStr: integerPart,
    fractionStr: fractionPart,
  };
}

/**
 * Converts a non-negative integer string in `fromBase` to BigInt decimal.
 */
export function integerToDecimal(intStr: string, fromBase: number): { value: bigint; steps: PositionalStep[] } {
  let result = BigInt(0);
  const baseBig = BigInt(fromBase);
  const steps: PositionalStep[] = [];
  const upper = intStr.toUpperCase();
  const len = upper.length;

  for (let i = 0; i < len; i++) {
    const char = upper[i];
    const digitVal = DIGITS.indexOf(char);
    const pos = len - 1 - i;
    const weight = baseBig ** BigInt(pos);
    const term = BigInt(digitVal) * weight;
    result += term;

    steps.push({
      digit: char,
      digitValue: digitVal,
      position: pos,
      weightStr: `${fromBase}^${pos}`,
      weightNum: Number(weight),
      productStr: `${digitVal} × ${weight}`,
      productNum: Number(term),
    });
  }

  return { value: result, steps };
}

/**
 * Converts a fractional string in `fromBase` to a decimal floating-point number.
 */
export function fractionToDecimal(fracStr: string, fromBase: number): { value: number; steps: PositionalStep[] } {
  let result = 0;
  const steps: PositionalStep[] = [];
  const upper = fracStr.toUpperCase();

  for (let i = 0; i < upper.length; i++) {
    const char = upper[i];
    const digitVal = DIGITS.indexOf(char);
    const pos = -(i + 1);
    const weight = Math.pow(fromBase, pos);
    const term = digitVal * weight;
    result += term;

    steps.push({
      digit: char,
      digitValue: digitVal,
      position: pos,
      weightStr: `${fromBase}^(${pos})`,
      weightNum: weight,
      productStr: `${digitVal} × ${weight.toFixed(6)}`,
      productNum: term,
    });
  }

  return { value: result, steps };
}

/**
 * Converts a BigInt decimal to a string in `toBase` via repeated integer division.
 */
export function decimalToIntegerBase(dec: bigint, toBase: number): { result: string; steps: DivisionStep[] } {
  if (dec === BigInt(0)) {
    return {
      result: '0',
      steps: [
        {
          dividend: '0',
          divisor: toBase,
          quotient: '0',
          remainder: 0,
          remainderDigit: '0',
        },
      ],
    };
  }

  const baseBig = BigInt(toBase);
  let current = dec;
  const steps: DivisionStep[] = [];
  const remainderDigits: string[] = [];

  while (current > BigInt(0)) {
    const rem = Number(current % baseBig);
    const nextQuotient = current / baseBig;
    const digitChar = DIGITS[rem];
    steps.push({
      dividend: current.toString(),
      divisor: toBase,
      quotient: nextQuotient.toString(),
      remainder: rem,
      remainderDigit: digitChar,
    });
    remainderDigits.push(digitChar);
    current = nextQuotient;
  }

  return {
    result: remainderDigits.reverse().join(''),
    steps,
  };
}

/**
 * Converts a decimal fraction (0 <= frac < 1) to a fractional string in `toBase` via repeated multiplication.
 */
export function decimalToFractionBase(
  frac: number,
  toBase: number,
  maxDigits: number = 12
): { result: string; isApproximate: boolean; steps: MultiplicationStep[] } {
  if (frac === 0) {
    return { result: '', isApproximate: false, steps: [] };
  }

  let current = frac;
  const digits: string[] = [];
  const steps: MultiplicationStep[] = [];
  let isApproximate = false;

  for (let i = 0; i < maxDigits; i++) {
    if (Math.abs(current) < 1e-12) {
      break;
    }

    const mult = current * toBase;
    const intPart = Math.floor(mult);
    const newFrac = mult - intPart;
    const digitChar = DIGITS[intPart];

    steps.push({
      multiplicationStr: `${current.toFixed(6)} × ${toBase}`,
      productStr: mult.toFixed(6),
      integerPart: intPart,
      digitChar,
      remainderFractionStr: newFrac.toFixed(6),
    });

    digits.push(digitChar);
    current = newFrac;

    if (i === maxDigits - 1 && Math.abs(current) > 1e-12) {
      isApproximate = true;
    }
  }

  return {
    result: digits.join(''),
    isApproximate,
    steps,
  };
}

/**
 * Two's complement calculation for negative integers.
 */
export function calculateTwosComplement(decVal: bigint, bits: number): TwosComplementResult {
  const minVal = -(BigInt(2) ** BigInt(bits - 1));
  const maxVal = BigInt(2) ** BigInt(bits - 1) - BigInt(1);
  const inRange = decVal >= minVal && decVal <= maxVal;

  const magnitude = decVal < BigInt(0) ? -decVal : decVal;
  const magBinRaw = magnitude.toString(2);
  const magPadded = magBinRaw.padStart(bits, '0');

  // Invert bits for 1's complement
  let onesComp = '';
  for (let i = 0; i < bits; i++) {
    onesComp += magPadded[i] === '0' ? '1' : '0';
  }

  // Add 1 for 2's complement
  const carry = BigInt(1);
  const onesBig = BigInt('0b' + onesComp);
  const twosBig = (onesBig + carry) & ((BigInt(1) << BigInt(bits)) - BigInt(1));
  const twosComp = twosBig.toString(2).padStart(bits, '0');

  // Format into 4-bit nibbles for clean presentation
  const formatted = twosComp.match(/.{1,4}/g)?.join(' ') || twosComp;

  return {
    bits,
    magnitudeBinary: magPadded,
    onesComplement: onesComp,
    twosComplement: twosComp,
    formattedTwosComplement: formatted,
    inRange,
  };
}

export const computeTwosComplement = calculateTwosComplement;

/**
 * Check if base is a power of 2 (2, 8, 16)
 */
export function isPowerOf2Base(base: number): boolean {
  return base === 2 || base === 8 || base === 16;
}

/**
 * Shortcut grouping between binary, octal, and hexadecimal.
 */
export function convertByGrouping(
  intStr: string,
  fracStr: string,
  fromBase: number,
  toBase: number
): { integerResult: string; fractionResult: string; grouping: GroupingExplanation } | null {
  if (!isPowerOf2Base(fromBase) || !isPowerOf2Base(toBase) || fromBase === toBase) {
    return null;
  }

  // Case 1: Octal or Hexadecimal to Binary (Digit expansion)
  if (toBase === 2) {
    const groupSize = fromBase === 8 ? 3 : 4;
    const type: GroupingExplanation['type'] = fromBase === 8 ? 'oct-to-bin' : 'hex-to-bin';
    const intGroups: BitGroup[] = [];
    const fracGroups: BitGroup[] = [];

    const upperInt = intStr.toUpperCase();
    for (const char of upperInt) {
      const dVal = DIGITS.indexOf(char);
      intGroups.push({
        bits: dVal.toString(2).padStart(groupSize, '0'),
        digit: char,
        paddedCount: 0,
        side: 'integer',
      });
    }

    const upperFrac = fracStr.toUpperCase();
    for (const char of upperFrac) {
      const dVal = DIGITS.indexOf(char);
      fracGroups.push({
        bits: dVal.toString(2).padStart(groupSize, '0'),
        digit: char,
        paddedCount: 0,
        side: 'fraction',
      });
    }

    let rawIntBin = intGroups.map((g) => g.bits).join('');
    // Remove leading zeros for clean display, but keep at least '0' if all were zeros
    const cleanIntBin = rawIntBin.replace(/^0+(?=\d)/, '') || '0';
    const cleanFracBin = fracGroups.map((g) => g.bits).join('');

    return {
      integerResult: cleanIntBin,
      fractionResult: cleanFracBin,
      grouping: {
        type,
        groupSize,
        integerGroups: intGroups,
        fractionGroups: fracGroups,
      },
    };
  }

  // Case 2: Binary to Octal or Hexadecimal (Bit grouping)
  // Or Case 3: Octal <-> Hex (Via intermediate binary)
  let binaryInt = '';
  let binaryFrac = '';

  if (fromBase === 2) {
    binaryInt = intStr;
    binaryFrac = fracStr;
  } else {
    const sourceBitsPerDigit = fromBase === 8 ? 3 : 4;
    binaryInt = intStr
      .split('')
      .map((d) => DIGITS.indexOf(d.toUpperCase()).toString(2).padStart(sourceBitsPerDigit, '0'))
      .join('');
    binaryFrac = fracStr
      .split('')
      .map((d) => DIGITS.indexOf(d.toUpperCase()).toString(2).padStart(sourceBitsPerDigit, '0'))
      .join('');
  }

  const targetGroupSize = toBase === 8 ? 3 : 4;
  const intGroups: BitGroup[] = [];
  const fracGroups: BitGroup[] = [];

  // Group integer from right to left
  const cleanInt = binaryInt.replace(/^0+(?=\d)/, '') || '0';
  let padLeft = 0;
  if (cleanInt.length % targetGroupSize !== 0) {
    padLeft = targetGroupSize - (cleanInt.length % targetGroupSize);
  }
  const paddedInt = '0'.repeat(padLeft) + cleanInt;

  for (let i = 0; i < paddedInt.length; i += targetGroupSize) {
    const groupBits = paddedInt.slice(i, i + targetGroupSize);
    const digitVal = parseInt(groupBits, 2);
    intGroups.push({
      bits: groupBits,
      digit: DIGITS[digitVal],
      paddedCount: i === 0 ? padLeft : 0,
      side: 'integer',
    });
  }

  // Group fraction from left to right
  let padRight = 0;
  if (binaryFrac.length > 0) {
    if (binaryFrac.length % targetGroupSize !== 0) {
      padRight = targetGroupSize - (binaryFrac.length % targetGroupSize);
    }
    const paddedFrac = binaryFrac + '0'.repeat(padRight);

    for (let i = 0; i < paddedFrac.length; i += targetGroupSize) {
      const groupBits = paddedFrac.slice(i, i + targetGroupSize);
      const digitVal = parseInt(groupBits, 2);
      fracGroups.push({
        bits: groupBits,
        digit: DIGITS[digitVal],
        paddedCount: i + targetGroupSize >= paddedFrac.length ? padRight : 0,
        side: 'fraction',
      });
    }
  }

  const integerResult = intGroups.map((g) => g.digit).join('') || '0';
  const fractionResult = fracGroups.map((g) => g.digit).join('');

  let type: GroupingExplanation['type'] = 'bin-to-oct';
  if (fromBase === 2 && toBase === 8) type = 'bin-to-oct';
  else if (fromBase === 2 && toBase === 16) type = 'bin-to-hex';
  else if (fromBase === 8 && toBase === 16) type = 'oct-to-hex';
  else if (fromBase === 16 && toBase === 8) type = 'hex-to-oct';

  return {
    integerResult,
    fractionResult,
    grouping: {
      type,
      groupSize: targetGroupSize,
      integerGroups: intGroups,
      fractionGroups: fracGroups,
      intermediateBinary: fromBase !== 2 ? binaryInt + (binaryFrac ? '.' + binaryFrac : '') : undefined,
    },
  };
}

/**
 * Main conversion function. Takes input string, fromBase, toBase, and produces complete result and explanation.
 */
export function convertNumber(rawInput: string, fromBase: number, toBase: number): ConversionOutput | null {
  const { base: detectedBase } = detectPrefix(rawInput);
  const effectiveFromBase = detectedBase !== null ? detectedBase : fromBase;

  const validation = validateNumber(rawInput, effectiveFromBase);
  if (!validation.isValid || validation.isEmpty || !validation.integerStr) {
    return null;
  }

  const isNeg = validation.isNegative || false;
  const intStr = validation.integerStr;
  const fracStr = validation.fractionStr || '';

  // 1. Convert to decimal representation
  const decIntObj = integerToDecimal(intStr, effectiveFromBase);
  const decFracObj = fracStr ? fractionToDecimal(fracStr, effectiveFromBase) : { value: 0, steps: [] };
  const decTotalNum = Number(decIntObj.value) + decFracObj.value;

  // 2. Compute read-only representations in all 4 standard bases
  const allBases = {
    bin: (isNeg ? '-' : '') + decimalToIntegerBase(decIntObj.value, 2).result + (decFracObj.value ? '.' + decimalToFractionBase(decFracObj.value, 2, 8).result : ''),
    oct: (isNeg ? '-' : '') + decimalToIntegerBase(decIntObj.value, 8).result + (decFracObj.value ? '.' + decimalToFractionBase(decFracObj.value, 8, 6).result : ''),
    dec: (isNeg ? '-' : '') + decIntObj.value.toString() + (decFracObj.value ? '.' + decFracObj.value.toString().slice(2) : ''),
    hex: (isNeg ? '-' : '') + decimalToIntegerBase(decIntObj.value, 16).result + (decFracObj.value ? '.' + decimalToFractionBase(decFracObj.value, 16, 6).result : ''),
  };

  // 3. Two's complement for negative numbers
  const twosComplement = isNeg
    ? {
        8: calculateTwosComplement(-decIntObj.value, 8),
        16: calculateTwosComplement(-decIntObj.value, 16),
        32: calculateTwosComplement(-decIntObj.value, 32),
      }
    : undefined;

  // 4. Check for direct power-of-2 grouping shortcut
  const groupingResult = convertByGrouping(intStr, fracStr, effectiveFromBase, toBase);

  if (groupingResult) {
    const fullOut = (isNeg ? '-' : '') + groupingResult.integerResult + (groupingResult.fractionResult ? '.' + groupingResult.fractionResult : '');
    return {
      input: rawInput.trim(),
      fromBase: effectiveFromBase,
      toBase,
      isNegative: isNeg,
      integerOutput: groupingResult.integerResult,
      fractionOutput: groupingResult.fractionResult,
      fullOutput: fullOut,
      isApproximate: false,
      allBases,
      twosComplement,
      explanation: {
        method: 'power-of-2',
        sourceBase: effectiveFromBase,
        targetBase: toBase,
        isNegative: isNeg,
        summarySentence: `Because both ${effectiveFromBase} and ${toBase} are integer powers of 2, we directly map bits in groups of ${groupingResult.grouping.groupSize} without computing full division.`,
        whyItWorks: `Since 2^k = Base, each base-${toBase} digit corresponds exactly to a unique k-bit binary pattern.`,
        grouping: groupingResult.grouping,
      },
    };
  }

  // 5. Method: Any Base -> Decimal (Positional notation)
  if (toBase === 10) {
    const allPositionalSteps = [...decIntObj.steps, ...decFracObj.steps];
    const equationTerms = allPositionalSteps.map((s) => `${s.digit}×${effectiveFromBase}^${s.position}`).join(' + ');
    const decResStr = decIntObj.value.toString() + (decFracObj.value ? (decFracObj.value.toString().slice(1)) : '');

    return {
      input: rawInput.trim(),
      fromBase: effectiveFromBase,
      toBase,
      isNegative: isNeg,
      integerOutput: decIntObj.value.toString(),
      fractionOutput: decFracObj.value ? decFracObj.value.toString().slice(2) : '',
      fullOutput: (isNeg ? '-' : '') + decResStr,
      isApproximate: false,
      allBases,
      twosComplement,
      explanation: {
        method: 'positional',
        sourceBase: effectiveFromBase,
        targetBase: 10,
        isNegative: isNeg,
        summarySentence: `Expand each digit using positional weights: multiply each digit by ${effectiveFromBase}^position and calculate the total sum.`,
        whyItWorks: 'Positional notation represents numbers where each column represents a successive integer power of the radix.',
        positionalSteps: allPositionalSteps,
        positionalEquation: equationTerms,
        decimalResult: decResStr,
      },
    };
  }

  // 6. Method: Decimal -> Target Base (Repeated division & multiplication)
  if (effectiveFromBase === 10) {
    const targetIntObj = decimalToIntegerBase(decIntObj.value, toBase);
    const targetFracObj = decimalToFractionBase(decFracObj.value, toBase, 12);
    const fullOut = (isNeg ? '-' : '') + targetIntObj.result + (targetFracObj.result ? '.' + targetFracObj.result : '');

    return {
      input: rawInput.trim(),
      fromBase: 10,
      toBase,
      isNegative: isNeg,
      integerOutput: targetIntObj.result,
      fractionOutput: targetFracObj.result,
      fullOutput: fullOut,
      isApproximate: targetFracObj.isApproximate,
      allBases,
      twosComplement,
      explanation: {
        method: 'repeated-division',
        sourceBase: 10,
        targetBase: toBase,
        isNegative: isNeg,
        summarySentence: `Divide the integer part repeatedly by ${toBase} to collect remainders (bottom-to-top), and multiply the fractional part by ${toBase} to extract digits (top-to-bottom).`,
        whyItWorks: 'Repeated integer division isolates the least significant digit at each step; repeated multiplication extracts the most significant fractional digit.',
        divisionSteps: targetIntObj.steps,
        multiplicationSteps: targetFracObj.steps,
      },
    };
  }

  // 7. General Base -> General Base (Two-stage: Source -> Decimal -> Target)
  const stage1 = convertNumber(intStr + (fracStr ? '.' + fracStr : ''), effectiveFromBase, 10);
  const stage2 = convertNumber(decTotalNum.toString(), 10, toBase);

  const targetIntObj = decimalToIntegerBase(decIntObj.value, toBase);
  const targetFracObj = decimalToFractionBase(decFracObj.value, toBase, 12);
  const fullOut = (isNeg ? '-' : '') + targetIntObj.result + (targetFracObj.result ? '.' + targetFracObj.result : '');

  return {
    input: rawInput.trim(),
    fromBase: effectiveFromBase,
    toBase,
    isNegative: isNeg,
    integerOutput: targetIntObj.result,
    fractionOutput: targetFracObj.result,
    fullOutput: fullOut,
    isApproximate: targetFracObj.isApproximate,
    allBases,
    twosComplement,
    explanation: {
      method: 'two-stage',
      sourceBase: effectiveFromBase,
      targetBase: toBase,
      isNegative: isNeg,
      summarySentence: `Convert from Base ${effectiveFromBase} to Base 10 using positional expansion, then convert Decimal to Base ${toBase} using repeated division/multiplication.`,
      whyItWorks: 'Decimal acts as a universal intermediate bridge between any two arbitrary arbitrary-radix positional systems.',
      firstStage: stage1?.explanation,
      secondStage: stage2?.explanation,
      divisionSteps: targetIntObj.steps,
      multiplicationSteps: targetFracObj.steps,
      positionalSteps: [...decIntObj.steps, ...decFracObj.steps],
    },
  };
}

/**
 * Practice mode question generator.
 */
export interface PracticeQuestion {
  id: string;
  difficulty: 'easy' | 'medium' | 'hard';
  prompt: string;
  sourceValue: string;
  fromBase: number;
  toBase: number;
  correctAnswer: string;
  explanation: ConversionOutput;
}

export function generatePracticeQuestion(difficulty: 'easy' | 'medium' | 'hard'): PracticeQuestion {
  const id = Math.random().toString(36).substring(2, 9);

  if (difficulty === 'easy') {
    // 0 to 63, binary <-> decimal or hex <-> decimal
    const val = Math.floor(Math.random() * 60) + 4;
    const isBinToDec = Math.random() > 0.5;
    const fromBase = isBinToDec ? 2 : 10;
    const toBase = isBinToDec ? 10 : 16;
    const sourceValue = fromBase === 2 ? val.toString(2) : val.toString(10);
    const converted = convertNumber(sourceValue, fromBase, toBase)!;

    return {
      id,
      difficulty,
      prompt: `Convert ${sourceValue}₍${fromBase}₎ to base ${toBase}`,
      sourceValue,
      fromBase,
      toBase,
      correctAnswer: converted.fullOutput,
      explanation: converted,
    };
  }

  if (difficulty === 'medium') {
    // 64 to 1024, octal <-> hex or binary grouping
    const val = Math.floor(Math.random() * 900) + 64;
    const pairs: [number, number][] = [
      [8, 16],
      [16, 8],
      [2, 16],
      [16, 2],
      [10, 8],
    ];
    const pair = pairs[Math.floor(Math.random() * pairs.length)];
    const [fromBase, toBase] = pair;
    const sourceValue = val.toString(fromBase).toUpperCase();
    const converted = convertNumber(sourceValue, fromBase, toBase)!;

    return {
      id,
      difficulty,
      prompt: `Convert ${sourceValue}₍${fromBase}₎ to base ${toBase}`,
      sourceValue,
      fromBase,
      toBase,
      correctAnswer: converted.fullOutput,
      explanation: converted,
    };
  }

  // Hard: fractional parts (e.g. 1011.101 <-> decimal, or hex fractions)
  const intVal = Math.floor(Math.random() * 30) + 2;
  const fracOptions = ['0.5', '0.25', '0.75', '0.625', '0.125', '0.375'];
  const fracStr = fracOptions[Math.floor(Math.random() * fracOptions.length)];
  const totalDec = intVal + parseFloat(fracStr);

  const isBin = Math.random() > 0.5;
  const fromBase = isBin ? 2 : 10;
  const toBase = isBin ? 10 : 2;

  const convertedDecToBin = convertNumber(totalDec.toString(), 10, 2)!;
  const sourceValue = fromBase === 2 ? convertedDecToBin.fullOutput : totalDec.toString();
  const converted = convertNumber(sourceValue, fromBase, toBase)!;

  return {
    id,
    difficulty,
    prompt: `Convert ${sourceValue}₍${fromBase}₎ to base ${toBase}`,
    sourceValue,
    fromBase,
    toBase,
    correctAnswer: converted.fullOutput,
    explanation: converted,
  };
}

/**
 * Checks if a user's answer matches the correct answer, tolerating case and leading/trailing zeros.
 */
export function checkAnswer(userAnswer: string, expected: string): boolean {
  const normUser = userAnswer.trim().toUpperCase().replace(/^[0]+(?=[1-9A-Z])/, '');
  const normExp = expected.trim().toUpperCase().replace(/^[0]+(?=[1-9A-Z])/, '');
  if (normUser === normExp) return true;

  // For fractions, compare numerical values if float
  const pUser = parseFloat(normUser);
  const pExp = parseFloat(normExp);
  if (!isNaN(pUser) && !isNaN(pExp) && Math.abs(pUser - pExp) < 1e-4) {
    return true;
  }

  return false;
}

/**
 * Detects common programming radix prefixes (0b for binary, 0o for octal, 0x for hex),
 * returning the cleaned numeric string and the corresponding base if detected.
 */
export function detectPrefix(rawInput: string): { cleanInput: string; base: number | null } {
  const trimmed = rawInput.trim();
  const isNegative = trimmed.startsWith('-');
  const isPositive = trimmed.startsWith('+');
  const sign = isNegative ? '-' : isPositive ? '+' : '';
  const core = (isNegative || isPositive) ? trimmed.slice(1) : trimmed;

  if (core.startsWith('0b') || core.startsWith('0B')) {
    return { cleanInput: sign + core.slice(2), base: 2 };
  }
  if (core.startsWith('0o') || core.startsWith('0O')) {
    return { cleanInput: sign + core.slice(2), base: 8 };
  }
  if (core.startsWith('0x') || core.startsWith('0X')) {
    return { cleanInput: sign + core.slice(2), base: 16 };
  }

  return { cleanInput: rawInput, base: null };
}
