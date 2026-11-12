import { CaretRightIcon } from "@phosphor-icons/react";
import {
  Children,
  type ComponentProps,
  type ReactNode,
  useId,
  useRef,
  useState,
} from "react";

/**
 * Bold text in the docs. A path through the dashboard is written
 * "**Settings → General**", which stays readable as plain Markdown; here each
 * arrow becomes a caret icon.
 */
export function Strong({ children, ...props }: ComponentProps<"strong">) {
  return <strong {...props}>{Children.map(children, withCarets)}</strong>;
}

function withCarets(child: ReactNode): ReactNode {
  if (typeof child !== "string" || !child.includes("→")) return child;
  return child.split(/\s*→\s*/).flatMap((part, i) =>
    i === 0
      ? [part]
      : [
          <CaretRightIcon
            key={i}
            size={12}
            weight="bold"
            role="img"
            aria-label="then"
            className="mx-1 inline-block -translate-y-px align-middle text-fd-muted-foreground"
          />,
          part,
        ],
  );
}

/** How close a tip may come to the edge of the screen. */
const EDGE = 12;

/**
 * A word worth explaining, without leaving the sentence: a dashed underline,
 * and the explanation on hover or focus.
 *
 *   <Term tip="It keeps no data of its own between requests.">stateless</Term>
 */
export function Term({ tip, children }: { tip: string; children: ReactNode }) {
  const id = useId();
  const termRef = useRef<HTMLSpanElement>(null);
  const tipRef = useRef<HTMLSpanElement>(null);
  // Centred on the word unless that would run off the screen; then nudged
  // sideways, and shown below the word when there's no room above it.
  const [shift, setShift] = useState(0);
  const [below, setBelow] = useState(false);

  const place = () => {
    const term = termRef.current;
    const box = tipRef.current;
    if (!term || !box) return;
    const width = document.documentElement.clientWidth;
    const t = term.getBoundingClientRect();
    const w = box.offsetWidth;
    const left = t.left + t.width / 2 - w / 2;
    const max = width - EDGE - w;
    setShift(left < EDGE ? EDGE - left : left > max ? max - left : 0);
    setBelow(t.top - box.offsetHeight - 8 < EDGE);
  };

  return (
    <span
      ref={termRef}
      className="group relative inline-block"
      onPointerEnter={place}
      onFocus={() => {
        place();
        // Focusing can scroll the word into view, so measure again after.
        requestAnimationFrame(place);
      }}
    >
      <span
        tabIndex={0}
        aria-describedby={id}
        className="cursor-help underline decoration-dashed decoration-fd-muted-foreground decoration-[1.5px] underline-offset-[3.5px] outline-none focus-visible:rounded-sm focus-visible:ring-2 focus-visible:ring-fd-ring"
      >
        {children}
      </span>
      <span
        ref={tipRef}
        id={id}
        role="tooltip"
        style={shift ? { left: `calc(50% + ${shift}px)` } : undefined}
        className={`pointer-events-none invisible absolute left-1/2 z-50 w-max max-w-[min(260px,calc(100vw-2rem))] -translate-x-1/2 rounded-lg border border-fd-border bg-fd-popover px-3 py-2 text-[13px] font-normal leading-snug text-fd-popover-foreground opacity-0 shadow-lg transition duration-150 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100 ${below ? "top-full mt-2 -translate-y-1" : "bottom-full mb-2 translate-y-1"}`}
      >
        {tip}
      </span>
    </span>
  );
}
