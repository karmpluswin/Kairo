'use client';

import { useTheme } from 'next-themes';
import { LineShadowText } from '@/components/ui/line-shadow-text';
import { AuroraText } from '@/components/ui/aurora-text';
import { useEffect, useState, useRef, useCallback } from 'react';

const MAX_SCALE = 1.5;
const SPREAD = 80;

function gaussian(dist: number, sigma: number) {
  return Math.exp(-(dist * dist) / (2 * sigma * sigma));
}

// Only used for plain words — Your, Seasonal, Anime
function LetterGroup({
  text,
  letterRefs,
  refOffset,
  scales,
}: {
  text: string;
  letterRefs: React.MutableRefObject<(HTMLSpanElement | null)[]>;
  refOffset: number;
  scales: number[];
}) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'baseline' }}>
      {text.split('').map((char, i) => {
        const globalIdx = refOffset + i;
        const scale = scales[globalIdx] ?? 1;
        return (
          <span
            key={i}
            ref={(el) => { letterRefs.current[globalIdx] = el; }}
            style={{
              display: 'inline-block',
              transform: `scale(${scale.toFixed(3)})`,
              transformOrigin: 'bottom center',
              transition: 'transform 0.15s cubic-bezier(0.34, 1.56, 0.64, 1)',
              willChange: 'transform',
            }}
          >
            {char}
          </span>
        );
      })}
    </span>
  );
}

// Plain words that get magnification: Your, Seasonal, Anime
// Total animatable letters = 4 + 8 + 5 = 17
const ANIMATED = [
  { text: 'Your',     offset: 0  },
  { text: 'Seasonal', offset: 4  },
  { text: 'Anime',    offset: 12 },
] as const;

const TOTAL_LETTERS = 17; // Your(4) + Seasonal(8) + Anime(5)

export function HeroLine() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);


  // const [mounted, setMounted] = useState(false);
  const [scales, setScales] = useState<number[]>(Array(TOTAL_LETTERS).fill(1));
  const letterRefs = useRef<(HTMLSpanElement | null)[]>(Array(TOTAL_LETTERS).fill(null));

  useEffect(() => { setMounted(true); }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const mouseX = e.clientX;
    const newScales = letterRefs.current.map((el) => {
      if (!el) return 1;
      const rect = el.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const dist = Math.abs(mouseX - centerX);
      return 1 + (MAX_SCALE - 1) * gaussian(dist, SPREAD);
    });
    setScales(newScales);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setScales(Array(TOTAL_LETTERS).fill(1));
  }, []);

  if (!mounted) {
    return null;
  }

   const shadowColor = resolvedTheme === 'dark' ? 'white' : 'black';

  return (
    <h2
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="text-center font-semibold leading-none text-4xl max-w-sm xs:text-6xl xs:max-w-xl lg:text-7xl w-full lg:max-w-5xl p-4 pt-0 my-4 cursor-default select-none"
      style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'baseline', gap: '0.25em' }}
    >
      {/* Your — magnified */}
      <LetterGroup text="Your" letterRefs={letterRefs} refOffset={0} scales={scales} />

      {/* Favourite — static AuroraText, untouched */}
      <AuroraText>Favourite</AuroraText>

      {/* Seasonal — magnified */}
      <LetterGroup text="Seasonal" letterRefs={letterRefs} refOffset={4} scales={scales} />

      {/* Anime — magnified */}
      <LetterGroup text="Anime" letterRefs={letterRefs} refOffset={12} scales={scales} />

      {/* Tracker — static LineShadowText, untouched */}
      <LineShadowText className="italic" shadowColor={shadowColor}>Tracker</LineShadowText>
    </h2>
  );
}