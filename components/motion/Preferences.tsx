"use client";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
type Mode = "system" | "reduced" | "full";
const MotionContext = createContext<{
  mode: Mode;
  reduced: boolean;
  paused: boolean;
  setMode: (mode: Mode) => void;
  setPaused: (paused: boolean) => void;
}>({
  mode: "system",
  reduced: true,
  paused: false,
  setMode: () => {},
  setPaused: () => {},
});
export const useMotion = () => useContext(MotionContext);
export function MotionProvider({ children }: { children: ReactNode }) {
  const [mode, setModeState] = useState<Mode>("system"),
    [osReduced, setOsReduced] = useState(true),
    [paused, setPaused] = useState(false);
  useEffect(() => {
    const mq = matchMedia("(prefers-reduced-motion: reduce)");
    let cancelled = false;
    const sync = () => setOsReduced(mq.matches);
    queueMicrotask(() => {
      if (cancelled) return;
      sync();
      try {
        const stored = localStorage.getItem("portfolio-motion");
        if (stored === "reduced" || stored === "full" || stored === "system")
          setModeState(stored);
      } catch {}
    });
    mq.addEventListener("change", sync);
    return () => {
      cancelled = true;
      mq.removeEventListener("change", sync);
    };
  }, []);
  const reduced = mode === "reduced" || (mode === "system" && osReduced);
  const setMode = (next: Mode) => {
    setModeState(next);
    try {
      localStorage.setItem("portfolio-motion", next);
    } catch {}
  };
  useEffect(() => {
    document.documentElement.dataset.motion = reduced ? "reduced" : "full";
    return () => {
      delete document.documentElement.dataset.motion;
    };
  }, [reduced]);
  return (
    <MotionContext.Provider
      value={{ mode, reduced, paused, setMode, setPaused }}
    >
      {children}
    </MotionContext.Provider>
  );
}
export function MotionControls() {
  const { mode, setMode, paused, setPaused } = useMotion();
  return (
    <details className="motion-menu">
      <summary>
        Motion <span aria-hidden="true">◒</span>
      </summary>
      <div className="motion-popover">
        <p className="eyebrow">Your viewing preference</p>
        <fieldset>
          <legend className="sr-only">Motion preference</legend>
          {(["system", "reduced", "full"] as Mode[]).map((m) => (
            <label key={m}>
              <input
                type="radio"
                name="motion"
                checked={mode === m}
                onChange={() => setMode(m)}
              />
              {m[0].toUpperCase() + m.slice(1)}
            </label>
          ))}
        </fieldset>
        <button
          type="button"
          onClick={() => setPaused(!paused)}
          aria-pressed={paused}
        >
          {paused ? "Resume animation" : "Pause animation"}
        </button>
        <p className="small">System follows your device settings.</p>
      </div>
    </details>
  );
}
