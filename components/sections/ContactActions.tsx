"use client";
import { useState } from "react";
export function CopyEmail({ email }: { email: string }) {
  const [status, setStatus] = useState("");
  return (
    <div className="copy-wrap">
      <button
        className="text-button"
        onClick={async () => {
          try {
            await navigator.clipboard.writeText(email);
            setStatus("Email copied.");
          } catch {
            setStatus(
              "Copy unavailable. Select the email address above and copy it manually.",
            );
          }
        }}
      >
        Copy email <span aria-hidden="true">⧉</span>
      </button>
      <span role="status" className="small">
        {status}
      </span>
    </div>
  );
}
