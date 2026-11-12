import { CheckIcon, CopyIcon } from "@phosphor-icons/react";
import { useState } from "react";

/** A shell command with a copy button. */
export function CopyCommand({ command }: { command: string }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    await navigator.clipboard.writeText(command);
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };
  return (
    <div className="flex max-w-full items-center gap-3 rounded-xl border border-border bg-card py-1.5 pl-4 pr-1.5">
      <code className="min-w-0 flex-1 overflow-x-auto text-left whitespace-nowrap font-mono text-[12.5px] text-foreground/90 [scrollbar-width:none]">
        <span aria-hidden className="select-none text-muted-foreground">
          ${" "}
        </span>
        {command}
      </code>
      <button
        type="button"
        onClick={copy}
        aria-label={copied ? "Copied" : "Copy command"}
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
      >
        {copied ? (
          <CheckIcon size={15} className="text-success" />
        ) : (
          <CopyIcon size={15} />
        )}
      </button>
    </div>
  );
}
