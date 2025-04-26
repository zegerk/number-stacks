
import React, { useState } from "react";

/**
 * Number Stacks Visualizer – prime chips & prime-column colouring (prime shows number only)
 * ------------------------------------------------------------------
 * • Prime factors in labels get colour-coded circles (distinct colour per prime).
 * • Rectangle hue = prime colour only when **column count is prime**; otherwise neutral grey.
 * • For a prime input we display the coloured number chip and its single-row grid—no extra text.
 */
export default function NumberStacksVisualizer() {
  const [number, setNumber] = useState(16);

  const isPrime = (n) => {
    if (n < 2) return false;
    for (let d = 2; d * d <= n; d++) if (n % d === 0) return false;
    return true;
  };

  const getFactorPairs = (n) => {
    const pairs = [];
    for (let d = 2; d <= Math.sqrt(n); d++) {
      if (n % d === 0) {
        pairs.push([d, n / d]);
        if (d !== n / d) pairs.push([n / d, d]);
      }
    }
    return pairs.sort((a, b) => a[0] - b[0]);
  };

  const COMPOSITE_COLOUR = "#9CA3AF";
  const PRIME_HEX = {
    2: "#10B981",
    3: "#FBBF24",
    5: "#8B5CF6",
    7: "#0EA5E9",
    11: "#EF4444",
    13: "#22D3EE",
    17: "#EC4899",
    19: "#84CC16",
  };
  const DEFAULT_PRIME = "#6366F1";
  const colourForPrime = (p) => PRIME_HEX[p] || DEFAULT_PRIME;

  const baseSize = 26;
  const sizeForStacks = (stacks) =>
    stacks <= 8
      ? baseSize
      : stacks <= 12
      ? baseSize * 0.75
      : stacks <= 20
      ? baseSize * 0.55
      : baseSize * 0.4;

  const SquaresGrid = ({ columns, rows, cell, colour }) => (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${columns}, ${cell}px)`,
        gridTemplateRows: `repeat(${rows}, ${cell}px)`,
      }}
      className="shadow-sm"
    >
      {Array.from({ length: columns * rows }).map((_, i) => (
        <div
          key={i}
          style={{
            width: cell,
            height: cell,
            backgroundColor: colour,
            border: "1px solid #f1f5f9",
          }}
        />
      ))}
    </div>
  );

  const PrimeChip = ({ value }) => (
    <span
      className="inline-flex items-center justify-center rounded-full px-3 py-0.5 leading-none font-bold"
      style={{ border: `4px solid ${colourForPrime(value)}`, color: colourForPrime(value) }}
    >
      {value}
    </span>
  );

  const FactorLabel = ({ a, b }) => (
    <p className="mb-3 font-medium text-center flex items-center gap-1">
      {isPrime(a) ? <PrimeChip value={a} /> : <span>{a}</span>}
      <span className="mx-1">×</span>
      {isPrime(b) ? <PrimeChip value={b} /> : <span>{b}</span>}
    </p>
  );

  const pairs = getFactorPairs(number);
  const primeNumber = isPrime(number);

  return (
    <div className="flex flex-col items-center gap-12">
      <div className="w-full sm:max-w-md">
        <input
          id="numberInput"
          type="number"
          min={2}
          max={200}
          value={number}
          onChange={(e) => setNumber(Number(e.target.value))}
          className="w-full px-3 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 mb-6"
        />
      </div>

      {primeNumber ? (
        <div className="flex flex-col items-center gap-3">
          <PrimeChip value={number} />
          <SquaresGrid
            columns={number}
            rows={1}
            cell={sizeForStacks(number)}
            colour={colourForPrime(number)}
          />
        </div>
      ) : (
        pairs.map(([stacks, size], idx) => {
          const cell = sizeForStacks(stacks);
          const tight = stacks >= 10;
          const rectColour = isPrime(stacks) ? colourForPrime(stacks) : COMPOSITE_COLOUR;

          return (
            <div key={idx} className="flex flex-col items-center w-full">
              <FactorLabel a={stacks} b={size} />
              <div
                className={`${tight ? "overflow-x-auto" : ""} flex justify-center`}
                style={{ maxWidth: "100%" }}
              >
                <SquaresGrid columns={stacks} rows={size} cell={cell} colour={rectColour} />
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}
