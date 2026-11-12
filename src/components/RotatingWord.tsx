import { useEffect, useRef, useState } from "react";

// The headline's changing word, as rolling text: the word slides up and out
// through a soft edge while the next rises from below, and the width follows
// it. With reduced motion it stays on the first word.

const INTERVAL = 2600;
const EASE = "700ms cubic-bezier(0.22, 1, 0.36, 1)";
/** The window's height. The air around a word is what the mask fades through. */
const LINE = 1.7;
/** Half of what LINE adds over the headline's own line height (1.22). */
const OVERHANG = (LINE - 1.22) / 2;
/** Past the word, so the tight tracking doesn't clip its last letter. */
const PADDING = "pr-[0.04em]";

// Eased rather than a straight ramp, which reads as a hard edge. A resting word
// sits between the stops, so it stays solid.
const FADE = `linear-gradient(to bottom,
  rgba(0,0,0,0) 0%,
  rgba(0,0,0,0.06) 4.5%,
  rgba(0,0,0,0.5) 9%,
  rgba(0,0,0,0.94) 13.5%,
  #000 18%,
  #000 82%,
  rgba(0,0,0,0.94) 86.5%,
  rgba(0,0,0,0.5) 91%,
  rgba(0,0,0,0.06) 95.5%,
  rgba(0,0,0,0) 100%)`;

/** One hue, the brand blue, lit from the top: depth rather than a colour effect. */
const GRADIENT =
  "bg-gradient-to-b from-[hsl(222_100%_56%)] to-[hsl(222_100%_40%)] bg-clip-text text-transparent dark:from-[hsl(222_100%_78%)] dark:to-[hsl(222_100%_57%)]";

export function RotatingWord({ words }: { words: string[] }) {
  const [index, setIndex] = useState(0);
  /** Each word's width in em, so it holds at every font size. */
  const [widths, setWidths] = useState<number[]>();
  const ruler = useRef<HTMLSpanElement>(null);
  /** The ruler is browser-only, to keep its words out of the static page. */
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!mounted) return;
    let live = true;
    void document.fonts.ready.then(() => {
      const el = ruler.current;
      if (!live || !el) return;
      const size = parseFloat(getComputedStyle(el).fontSize);
      setWidths(
        [...el.children].map((c) => c.getBoundingClientRect().width / size),
      );
    });
    return () => {
      live = false;
    };
  }, [mounted]);

  useEffect(() => {
    if (!widths) return;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = setInterval(
      () => setIndex((i) => (i + 1) % words.length),
      INTERVAL,
    );
    return () => clearInterval(timer);
  }, [widths, words.length]);

  return (
    <span
      data-word={words[index]}
      className="relative inline-flex items-center whitespace-nowrap align-bottom"
      style={{
        height: `${LINE}em`,
        marginBlock: `-${OVERHANG}em`,
        width: widths ? `${widths[index]}em` : undefined,
        transition: `width ${EASE}`,
        maskImage: FADE,
        WebkitMaskImage: FADE,
      }}
    >
      {widths ? (
        words.map((word, i) => {
          const away = (i - index + words.length) % words.length;
          const place =
            away === 0 ? "0" : away === words.length - 1 ? "-100%" : "100%";
          return (
            <span
              key={word}
              className="absolute inset-0 flex items-center justify-center"
              style={{
                translate: `0 ${place}`,
                // Only the two on show move; the rest wait below out of sight.
                transition:
                  away === 0 || away === words.length - 1
                    ? `translate ${EASE}`
                    : undefined,
              }}
            >
              <span className={`${GRADIENT} ${PADDING}`}>{word}</span>
            </span>
          );
        })
      ) : (
        // The static page: the plain word, without the others in its text.
        <span className={`${GRADIENT} ${PADDING}`}>{words[0]}</span>
      )}

      {mounted && !widths ? (
        <span
          ref={ruler}
          className="invisible absolute left-0 top-0 h-0 overflow-hidden"
        >
          {words.map((word) => (
            <span key={word} className={`inline-block ${PADDING}`}>
              {word}
            </span>
          ))}
        </span>
      ) : null}
    </span>
  );
}
