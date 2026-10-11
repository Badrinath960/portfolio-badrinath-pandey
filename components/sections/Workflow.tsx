"use client";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { useMotion } from "../motion/Preferences";
export function Workflow() {
  const { reduced, paused } = useMotion();
  const [issue, setIssue] = useState("missing"),
    [step, setStep] = useState(-1),
    [running, setRunning] = useState(false);
  const box = useRef<HTMLDivElement>(null),
    timeline = useRef<gsap.core.Timeline | null>(null);
  useEffect(
    () => () => {
      timeline.current?.kill();
    },
    [],
  );
  useEffect(() => {
    if (reduced && timeline.current) {
      timeline.current.kill();
      queueMicrotask(() => {
        setStep(3);
        setRunning(false);
      });
    }
  }, [reduced]);
  useEffect(() => {
    let visible = false;
    const sync = () => {
      if (!visible || document.hidden || paused) timeline.current?.pause();
      else timeline.current?.resume();
    };
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      sync();
    });
    if (box.current) observer.observe(box.current);
    document.addEventListener("visibilitychange", sync);
    sync();
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", sync);
    };
  }, [paused]);
  function run() {
    timeline.current?.kill();
    if (reduced) {
      setStep(3);
      setRunning(false);
      return;
    }
    setRunning(true);
    setStep(0);
    const t = gsap.timeline({ onComplete: () => setRunning(false) });
    [1, 2, 3].forEach((s, i) => t.call(() => setStep(s), [], (i + 1) * 0.8));
    timeline.current = t;
    if (paused) t.pause();
  }
  return (
    <div className="workflow" ref={box}>
      <div className="workflow-heading">
        <div>
          <p className="eyebrow">AUTOMATION IN ACTION</p>
          <h3>A workflow, made visible.</h3>
        </div>
        <span className="workflow-label">
          Illustrative workflow · sample data
        </span>
      </div>
      <p className="workflow-intro">
        An AI-inspired interaction showing fixed validation rules and a human
        review step. No live AI service or employer data.
      </p>
      <div className="workflow-nodes">
        {["Input", "Check", "Review", "Report"].map((s, i) => (
          <div
            key={s}
            className={step >= i ? "workflow-node complete" : "workflow-node"}
          >
            <span className="mono">{step >= i ? "✓" : `0${i + 1}`}</span>
            <strong>{s}</strong>
            <small>
              {
                ["Sample record", "Apply rule", "Flag exception", "Summarize"][
                  i
                ]
              }
            </small>
          </div>
        ))}
      </div>
      <div className="workflow-controls">
        <label>
          Sample issue
          <select
            value={issue}
            onChange={(e) => {
              timeline.current?.kill();
              setIssue(e.target.value);
              setStep(-1);
              setRunning(false);
            }}
          >
            <option value="missing">Missing value</option>
            <option value="duplicate">Duplicate record</option>
          </select>
        </label>
        <button className="button" onClick={run} disabled={running}>
          {running
            ? paused
              ? "Paused"
              : "Running…"
            : step === 3
              ? "Replay demo ↻"
              : "Run demo →"}
        </button>
        <p role="status">
          {step === 3
            ? issue === "missing"
              ? "Record D07 has no value. Flagged for review and excluded from the valid-record report."
              : "The second D12 repeats an ID. Flagged for review; the first occurrence is retained."
            : "Choose an issue and follow the record from input to report."}
        </p>
      </div>
    </div>
  );
}
