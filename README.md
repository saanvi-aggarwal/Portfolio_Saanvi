# Saanvi Aggarwal — Multi-Page Personal Portfolio

A production-ready, multi-page personal portfolio engineered for **Saanvi Aggarwal**, Computer Science & Engineering (AI) student at Chandigarh University.

Updated according to the latest résumé (`resume.docx`).

Designed with quiet Awwwards "Site of the Day" aesthetics: white, black, and gray palette only, generous whitespace, confident typography, and micro-interactions.

Built with **Next.js 15 (App Router)**, **React 19**, **Tailwind CSS 4**, and **Lenis** smooth scrolling.

---

## ✦ Routes Table

| Route | Page | Component Source | Key Interactions & Layout |
|---|---|---|---|
| `/` | **Home** | `src/app/page.tsx` | **Deliberately minimal (100svh)**: Perfectly centered, zero scrolling. Masked first name ("SAANVI") in bold Inter Tight reacting to cursor proximity, thin hairline divider, and quote: *&ldquo;Building with curiosity, solving with logic, growing with every challenge.&rdquo;* in Instrument Serif italic. |
| `/about` | **About** | `src/app/about/page.tsx` | 3-column layout, verbatim resume career objective, realistic swinging lanyard ID card with damped pendulum physics and 3D card flip (hover, touch tap, keyboard `Space`/`Enter`), quick facts. |
| `/skills` | **Skills** | `src/app/skills/page.tsx` | Periodic table of stack with 8 columns, 22 element tiles (including **Java**, **C++**, **Computer Architecture**, **Python**, **SQL**), family filter chips, diagonal entrance wave, sticky 340px inspector panel with pop-in brand logos. |
| `/work` | **Work** | `src/app/work/page.tsx` | Expanding horizontal accordion gallery (`min(78svh, 600px)`), project kickers & 2-column feature specs, interactive CSS/JSX illustrative UI simulations (**Instruction Set Simulator**, **AI Email Classifier**, and **Library Management System**), GitHub links. |
| `/education` | **Education** | `src/app/education/page.tsx` | Chronological academic timeline connecting secondary schooling, senior secondary honors, and B.E. Computer Science & Engineering (AI), scroll-drawn spine, illuminated milestone nodes, and dashed *"Next — Your team?"* card linking to `/contact`. |
| `/achievements` | **Achievements** | `src/app/achievements/page.tsx` | **Part 1**: Horizontal achievements gallery with interactive prev/next arrow buttons, wheel translation, dynamic progress bar, and 1.4s `easeOutQuart` metric count-ups for all competition awards.<br>**Part 2**: Certifications index with sticky heading and left-to-right ink-flood hover rows for Microsoft Azure AZ-900 & AI-900. |
| `/coa` | **COA Hub** | `src/app/coa/page.tsx`, `src/components/coa/CoaHubClient.tsx` | **Computer Organization & Architecture Hub**: 3 large equal cards (`01 Number System Converter`, `02 Instruction Set Simulator`, `03 Assignments`) visible in the first viewport at 1440×900 with live looping previews, responsive stacking, and automatic legacy `?tab=` redirection. |
| `/coa/converter` | **Number System Converter** | `src/app/coa/converter/page.tsx`, `src/components/coa/NumberConverter.tsx` | Zero-explanation single centered card (max-w 880px): From ⇄ To popover selection, custom base stepper (bases 2–36), automatic prefix detection (`0b`, `0o`, `0x`), soft invalid shake, touch digit bar, Try chips, live BigInt calculation with read-only radix chips, vertical teacher stepper with interactive digit highlighting, and self-assessment Practice Mode. |
| `/coa/simulator` | **Instruction Set Simulator** | `src/app/coa/simulator/page.tsx`, `src/components/coa/InstructionSimulator.tsx` | C++17 CLI project specifications, README-verified feature specs, 0/1/2/3-address architecture instruction format comparison, interactive terminal animation with runnable commands, and direct GitHub action. |
| `/coa/assignments` | **COA Assignments** | `src/app/coa/assignments/page.tsx`, `src/components/coa/AssignmentsList.tsx` | Verified curriculum assignment viewer, syllabus topics badges, and direct PDF view/download action. |
| `/contact` | **Contact** | `src/app/contact/page.tsx` | Interactive hopping letter bounce on main heading, one-click email copy with `aria-live` chip, direct telephone link, social profiles, rotating "say hello" badge. |

---

## ✦ Projects from Updated Résumé

1. **Instruction Set Simulator** (`C++`, `STL Stack`, `Computer Architecture`, `Assembly`, `Git`)
   - Converts arithmetic expressions from infix to postfix notation using stack-based processing.
   - Generates equivalent 3-address, 2-address, 1-address (accumulator), and 0-address (stack) CPU instructions.
   - Compares instruction counts and operand-handling mechanisms across architectures.
   - GitHub: [`https://github.com/saanvi-aggarwal/Instruction-Set-Simulator.git`](https://github.com/saanvi-aggarwal/Instruction-Set-Simulator.git)

2. **AI Email Classifier** (`Python`, `Machine Learning`, `NLP`, `Git`, `GitHub`)
   - Automated machine learning system to classify and organize emails based on content semantics.
   - Applied NLP preprocessing and feature extraction vectors.
   - GitHub: [`https://github.com/saanvi-aggarwal/AI-Email-Classifier.git`](https://github.com/saanvi-aggarwal/AI-Email-Classifier.git)

3. **Library Management System** (`C`, `Structures`, `Arrays`, `File Handling`, `Git`)
   - Console-based system managing book cataloguing, issue/return transactions, and user records.
   - Menu-driven operations with persistent file I/O.
   - GitHub: [`https://github.com/saanvi-aggarwal/25BAI10045-library-management.git`](https://github.com/saanvi-aggarwal/25BAI10045-library-management.git)

---

## ✦ How to Run Locally

### Prerequisites
- Node.js 18.18+ (tested on Node v24.14.0)
- npm 9+

### 1. Installation
```bash
npm install
```

### 2. Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Running Unit Tests (Number Systems Logic)
```bash
npm test
```
Executes the Vitest unit test suite covering:
- Base conversions (e.g. `1010₍₂₎ → 10₍₁₀₎`, `255₍₁₀₎ → FF₍₁₆₎`, `FF₍₁₆₎ → 11111111₍₂₎`, `777₍₈₎ → 511₍₁₀₎`, `7F₍₁₆₎ → 177₍₈₎`)
- Arbitrary radix math (Bases 2 through 36, e.g. `Z₍₃₆₎ → 35₍₁₀₎`)
- Fractional representations & non-terminating approximation indicators (`0.1₍₁₀₎ → 0.000110011001...₍₂₎`)
- Signed two's complement synthesis (`-45₍₁₀₎ → 8-bit: 11010011`)
- Error boundaries & invalid radix digit assertions

### 4. Production Build
```bash
npm run build
npm run start
```

---

## ✦ How to Add COA Assignments

1. **Place the PDF file** in the assignments directory:
   ```
   public/assignments/coa-assignment-<number>.pdf
   ```

2. **Register the assignment in `src/lib/data.ts`**:
   Add an entry to the `ASSIGNMENTS` array:
   ```typescript
   {
     id: 'coa-assignment-2',
     title: 'COA Assignment 2',
     subject: 'Computer Organization & Architecture',
     description: '1–2 sentence factual summary strictly from the document content.',
     file: '/assignments/coa-assignment-2.pdf',
     topics: ['Pipelining Hazards', 'Cache Associativity', 'RTL Micro-operations'],
   }
   ```
   The COA page will automatically render the new card in the assignments grid with direct PDF opening, downloading, and inline preview.

---

## ✦ License

This project is open-source under the MIT License.
