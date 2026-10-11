"use client";
export function ResumePrint() {
  return (
    <button
      type="button"
      className="button primary"
      onClick={() => window.print()}
    >
      Print / save as PDF <span aria-hidden="true">↗</span>
    </button>
  );
}
