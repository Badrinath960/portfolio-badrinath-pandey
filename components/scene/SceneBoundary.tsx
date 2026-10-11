"use client";
import {
  Component,
  useEffect,
  useRef,
  useState,
  type ReactNode,
  type ComponentType,
} from "react";
import { SculpturePoster } from "../charts/SculpturePoster";
import { useMotion } from "../motion/Preferences";
import { features } from "@/lib/config";
export type SceneProps = { active: boolean; onFailure: () => void };
class SceneError extends Component<
  { children: ReactNode; onFailure: () => void },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch() {
    this.props.onFailure();
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}
export function SceneBoundary() {
  const { reduced, paused } = useMotion();
  const box = useRef<HTMLDivElement>(null);
  const [Scene, setScene] = useState<ComponentType<SceneProps> | null>(null),
    [visible, setVisible] = useState(false),
    [hidden, setHidden] = useState(false),
    [failed, setFailed] = useState(false),
    [constrained, setConstrained] = useState(false),
    [enabled, setEnabled] = useState(false);
  useEffect(() => {
    let alive = true;
    queueMicrotask(() => {
      if (alive)
        setConstrained(
          Boolean(
            (navigator as Navigator & { connection?: { saveData?: boolean } })
              .connection?.saveData,
          ),
        );
    });
    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { threshold: 0.05 },
    );
    if (box.current) observer.observe(box.current);
    const onVisibility = () => setHidden(document.hidden);
    document.addEventListener("visibilitychange", onVisibility);
    onVisibility();
    return () => {
      alive = false;
      observer.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);
  useEffect(() => {
    if (reduced || failed || !features.scene3d) return;
    const connection = (
      navigator as Navigator & { connection?: { saveData?: boolean } }
    ).connection;
    if (connection?.saveData) return;
    const auto = matchMedia("(min-width:1024px) and (pointer:fine)").matches;
    if (!auto && !enabled) return;
    let cancelled = false;
    const id = setTimeout(() => {
      import("./Sculpture")
        .then((m) => {
          if (!cancelled) setScene(() => m.Sculpture);
        })
        .catch(() => {
          if (!cancelled) setFailed(true);
        });
    }, 700);
    return () => {
      cancelled = true;
      clearTimeout(id);
    };
  }, [reduced, failed, enabled]);
  const mounted = Scene && !reduced && !failed;
  return (
    <div className="scene-shell" ref={box}>
      <div className="scene-coordinate mono" aria-hidden="true">
        FIG. 01 / STRUCTURE FROM COMPLEXITY
      </div>
      <div className="scene-visual">
        <SculpturePoster />
        {mounted && (
          <div className="canvas-layer" aria-hidden="true">
            <SceneError onFailure={() => setFailed(true)}>
              <Scene
                active={visible && !hidden && !paused}
                onFailure={() => setFailed(true)}
              />
            </SceneError>
          </div>
        )}
      </div>
      <div className="scene-caption">
        <span className="tiny-cross" aria-hidden="true">
          +
        </span>
        <span>
          Collect <i>→</i> Validate <i>→</i> Analyze <i>→</i> Automate
        </span>
      </div>
      {!mounted && !reduced && !failed && !constrained && (
        <button
          className="scene-explore text-button"
          onClick={() => setEnabled(true)}
        >
          Explore visualization ↗
        </button>
      )}
      {mounted && (
        <button
          className="scene-explore text-button"
          onClick={() => setFailed(true)}
        >
          Use static visual
        </button>
      )}
    </div>
  );
}
