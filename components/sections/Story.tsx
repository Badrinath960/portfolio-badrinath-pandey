"use client";
import { useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { storySteps, checkedRecords, regionCounts } from "@/lib/demo";
import { storyProgress } from "@/lib/motion";
import { features } from "@/lib/config";
import { useMotion } from "../motion/Preferences";
import { StoryChart } from "../charts/StoryChart";
import { StoryMorph } from "../charts/StoryMorph";
import { Workflow } from "./Workflow";
gsap.registerPlugin(useGSAP, ScrollTrigger);
export function Story() {
  const scope = useRef<HTMLElement>(null);
  const { reduced, paused } = useMotion();
  const [active, setActive] = useState(0);
  useGSAP(
    () => {
      if (reduced || paused) return;
      const mm = gsap.matchMedia();
      mm.add("(min-width:1024px) and (min-height:700px)", () => {
        const region = scope.current?.querySelector(".story-body");
        if (!region) return;
        const graphic = region.querySelector(".story-graphic");
        const stages = gsap.utils.toArray<HTMLElement>(".story-step", region);
        const timeline = gsap.timeline({
          scrollTrigger: {
            trigger: region,
            start: "top 110px",
            end: "bottom bottom",
            scrub: 0.4,
            onUpdate: (self) => {
              storyProgress.current = self.progress;
              setActive(Math.min(3, Math.floor(self.progress * 4)));
            },
          },
        });
        timeline.to(".story-progress-fill", {
          scaleX: 1,
          ease: "none",
          duration: 4,
        });
        const cells = gsap.utils.toArray<SVGRectElement>(
          ".morph-record",
          region,
        );
        const groups = { North: 0, South: 0, West: 0 };
        let flagged = 0;
        cells.forEach((cell, i) => {
          const record = checkedRecords[i];
          timeline.to(
            cell,
            {
              attr: { x: 38 + (i % 6) * 57, y: 28 + Math.floor(i / 6) * 56 },
              duration: 0.8,
              ease: "power2.inOut",
            },
            0,
          );
          if (record.issue) {
            timeline.to(
              cell,
              {
                attr: { x: 390, y: 35 + flagged++ * 50, fill: "#f3c77b" },
                duration: 0.7,
              },
              1,
            );
            timeline.to(cell, { opacity: 0, duration: 0.3 }, 2);
          } else {
            const regionName = record.region as keyof typeof groups;
            const row = ["North", "South", "West"].indexOf(regionName);
            const col = groups[regionName]++;
            timeline.to(
              cell,
              {
                attr: {
                  x: 90 + col * 35,
                  y: 45 + row * 70,
                  width: 34,
                  height: 38,
                  rx: 1,
                },
                duration: 0.8,
                ease: "power2.inOut",
              },
              2,
            );
            timeline.to(cell, { opacity: 0, duration: 0.4 }, 3);
          }
        });
        timeline
          .to(".morph-review", { opacity: 1, duration: 0.3 }, 1)
          .to(".morph-review", { opacity: 0, duration: 0.3 }, 2)
          .to(".morph-chart-labels", { opacity: 1, duration: 0.3 }, 2.5)
          .to(".morph-chart-labels", { opacity: 0, duration: 0.3 }, 3)
          .to(".morph-workflow", { opacity: 1, duration: 0.5 }, 3.4);
        if (graphic)
          ScrollTrigger.create({
            trigger: region,
            start: "top 110px",
            end: "bottom bottom",
            pin: graphic,
            pinSpacing: false,
          });
        stages.forEach((el) =>
          gsap.from(el.querySelector(".step-number"), {
            y: 12,
            duration: 0.45,
            scrollTrigger: { trigger: el, start: "top 85%", once: true },
          }),
        );
      });
      return () => mm.revert();
    },
    { scope, dependencies: [reduced, paused], revertOnUpdate: true },
  );
  return (
    <section
      id="approach"
      className={`section approach ${!reduced && !paused ? "motion-enabled" : ""}`}
      ref={scope}
    >
      <div className="section-heading">
        <div>
          <p className="eyebrow">03 / THE APPROACH</p>
          <h2>
            From data.
            <br />
            <span className="muted">To a decision.</span>
          </h2>
        </div>
        <div className="section-intro">
          <p>
            A little structure changes what data can do.
            <br />
            Follow one sample through four deliberate steps.
          </p>
          <a
            className="text-link"
            href="#capabilities"
            onClick={() => document.getElementById("capabilities")?.focus()}
          >
            Skip story ↓
          </a>
        </div>
      </div>
      <p className="sample-label mono">
        ILLUSTRATIVE METHOD · SYNTHETIC DATA · NOT EMPLOYER RESULTS
      </p>
      <div className="story-body">
        <div className="story-steps">
          {storySteps.map((step, i) => (
            <article
              className="story-step"
              id={`step-${step.id}`}
              key={step.id}
            >
              <span className="step-number mono">0{i + 1}</span>
              <h3>
                {step.title}
                <span aria-hidden="true">{["↘", "✓", "↗", "→"][i]}</span>
              </h3>
              <h4>{step.subtitle}</h4>
              <p>{step.body}</p>
              <p className="mono small step-note">{step.note}</p>
              <div className="inline-story-chart">
                <StoryChart stage={i} />
              </div>
            </article>
          ))}
        </div>
        <div className="story-graphic">
          <div className="graphic-top mono">
            <span>DATA / TRANSFORMATION</span>
            <span>0{active + 1} — 04</span>
          </div>
          <div className="story-progress">
            <div className="story-progress-fill" />
          </div>
          <div className="graphic-views">
            <StoryMorph />
            <p className="chart-caption">{storySteps[active].note}</p>
          </div>
          <div className="graphic-stages">
            {storySteps.map((s, i) => (
              <a
                key={s.id}
                aria-current={active === i ? "step" : undefined}
                href={`#step-${s.id}`}
                onClick={() => setActive(i)}
              >
                {s.title}
              </a>
            ))}
          </div>
          <a
            className="text-link small"
            href="#sample-data"
            onClick={() =>
              scope.current
                ?.querySelector<HTMLDetailsElement>("#sample-data")
                ?.setAttribute("open", "")
            }
          >
            View data table ↗
          </a>
        </div>
      </div>
      <div className="data-note">
        <div>
          <span className="eyebrow">THE DENOMINATOR MATTERS</span>
          <h3>
            24 inputs. 20 valid.
            <br />4 worth a closer look.
          </h3>
        </div>
        <p>
          This is a demonstration, not a performance claim. A record passes when
          its ID is unique, its value is present and non-negative, and its
          region is North, South or West. Duplicate IDs are flagged after their
          first occurrence.
        </p>
      </div>
      <details id="sample-data" className="data-table">
        <summary>
          View sample data and validation results <span>24 records ＋</span>
        </summary>
        <div
          className="table-scroll"
          role="region"
          aria-label="Synthetic validation data"
          tabIndex={0}
        >
          <table>
            <caption>
              Synthetic records · 4 of 24 flagged · valid region counts:{" "}
              {regionCounts.map((r) => `${r.region} ${r.count}`).join(", ")}
            </caption>
            <thead>
              <tr>
                <th scope="col">Row</th>
                <th scope="col">ID</th>
                <th scope="col">Region</th>
                <th scope="col">Value</th>
                <th scope="col">Validation</th>
              </tr>
            </thead>
            <tbody>
              {checkedRecords.map((r, i) => (
                <tr key={i}>
                  <td>{i + 1}</td>
                  <td>{r.id}</td>
                  <td>{r.region}</td>
                  <td>{r.value ?? "Missing"}</td>
                  <td>{r.issue ?? "Valid"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>
      {features.aiWorkflowDemo && <Workflow />}
    </section>
  );
}
