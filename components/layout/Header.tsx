"use client";
import { useRef, useState } from "react";
import { SiteLink as Link } from "@/components/layout/SiteLink";
import { sitePath } from "@/lib/config";
import { MotionControls } from "../motion/Preferences";
export function Header() {
  const [open, setOpen] = useState(false);
  const trigger = useRef<HTMLButtonElement>(null);
  function close() {
    setOpen(false);
    trigger.current?.focus();
  }
  return (
    <header className="header">
      <div className="header-inner">
        <Link href="/" className="wordmark" aria-label="Badrinath Pandey home">
          bp<span>.</span>
        </Link>
        <span className="header-note">DATA, WITH PURPOSE.</span>
        <button
          className="menu-trigger"
          ref={trigger}
          aria-expanded={open}
          aria-controls="main-navigation"
          onClick={() => setOpen(!open)}
        >
          Menu {open ? "−" : "+"}
        </button>
        <nav
          id="main-navigation"
          className={open ? "nav open" : "nav"}
          aria-label="Main navigation"
          onKeyDown={(e) => {
            if (e.key === "Escape") close();
          }}
        >
          {[
            "Projects",
            "Work",
            "Approach",
            "Experience",
            "About",
            "Contact",
          ].map((n) => (
            <a
              key={n}
              href={sitePath(`/#${n.toLowerCase()}`)}
              onClick={() => {
                if (open) close();
              }}
            >
              {n}
            </a>
          ))}
          <Link href="/resume" className="resume-link">
            Résumé <span aria-hidden="true">↗</span>
          </Link>
        </nav>
        <MotionControls />
      </div>
    </header>
  );
}
