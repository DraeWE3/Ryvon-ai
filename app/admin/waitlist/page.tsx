"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
// import { addToWaitlist } from "@/lib/db/queries";
// import { toast } from "@/components/toast";

// ── Inline styles ──────────────────────────────────────────────────────────────
const css = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&display=swap');
  @import url('https://fonts.cdnfonts.com/css/gate');

  .wl-root {
    --bg: #0a0a0b;
    --surface: #111113;
    --border: rgba(255,255,255,0.07);
    --border-active: rgba(255,255,255,0.18);
    --text: #f0ede8;
    --muted: #6b6865;
    --accent-start: rgb(140, 223, 244);
    --accent-end: rgb(48, 113, 225);
    --accent: rgb(140, 223, 244);
    --accent-gradient: linear-gradient(135deg, rgb(140, 223, 244) 0%, rgb(48, 113, 225) 100%);
    --danger: #ff4747;
    --success: #47ff9c;
    --radius: 12px;
    --font-display: 'Gate', sans-serif;
    --font-mono: 'DM Mono', monospace;

    min-height: 100vh;
    background: var(--bg);
    color: var(--text);
    font-family: var(--font-mono);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 2rem;
  }

  .wl-card {
    width: 100%;
    max-width: 640px;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 20px;
    padding: 3rem;
    position: relative;
    overflow: hidden;
    animation: cardIn 0.5s cubic-bezier(0.22,1,0.36,1) both;
  }

  .wl-card::before {
    content: '';
    position: absolute;
    top: -120px;
    right: -80px;
    width: 300px;
    height: 300px;
    background: radial-gradient(circle, rgba(140,223,244,0.1) 0%, rgba(48,113,225,0.05) 50%, transparent 70%);
    pointer-events: none;
  }

  @keyframes cardIn {
    from { opacity: 0; transform: translateY(24px) scale(0.98); }
    to   { opacity: 1; transform: translateY(0)    scale(1); }
  }

  .wl-badge {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-size: 11px;
    font-weight: 500;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: rgb(140, 223, 244);
    background: rgba(140,223,244,0.07);
    border: 1px solid rgba(140,223,244,0.2);
    padding: 4px 12px;
    border-radius: 99px;
    margin-bottom: 1.5rem;
    animation: fadeUp 0.4s 0.1s both;
  }

  .wl-badge-dot {
    width: 6px;
    height: 6px;
    background: var(--accent-gradient);
    border-radius: 50%;
    animation: pulse 2s infinite;
  }

  @keyframes pulse {
    0%,100% { opacity: 1; }
    50% { opacity: 0.3; }
  }

  .wl-title {
    font-family: var(--font-display);
    font-size: 2.2rem;
    font-weight: 800;
    line-height: 1.1;
    letter-spacing: -0.03em;
    margin: 0 0 0.5rem;
    animation: fadeUp 0.4s 0.15s both;
  }

  .wl-title span {
    background: linear-gradient(135deg, rgb(140, 223, 244) 0%, rgb(48, 113, 225) 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .wl-desc {
    font-size: 13px;
    color: var(--muted);
    margin: 0 0 2rem;
    line-height: 1.6;
    animation: fadeUp 0.4s 0.2s both;
  }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(12px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .wl-label {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 11px;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--muted);
    margin-bottom: 10px;
    animation: fadeUp 0.4s 0.25s both;
  }

  .wl-count {
    background: linear-gradient(135deg, rgb(140, 223, 244) 0%, rgb(48, 113, 225) 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    font-weight: 500;
    transition: all 0.2s;
  }

  .wl-textarea-wrap {
    position: relative;
    animation: fadeUp 0.4s 0.3s both;
  }

  .wl-textarea {
    width: 100%;
    height: 200px;
    padding: 1.2rem 1.4rem;
    background: var(--bg);
    color: var(--text);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    font-family: var(--font-mono);
    font-size: 13px;
    line-height: 1.7;
    resize: none;
    outline: none;
    transition: border-color 0.2s, box-shadow 0.2s;
    box-sizing: border-box;
    caret-color: var(--accent);
  }

  .wl-textarea:focus {
    border-color: var(--border-active);
    box-shadow: 0 0 0 3px rgba(140,223,244,0.08), inset 0 1px 0 rgba(255,255,255,0.03);
  }

  .wl-textarea:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }

  .wl-textarea::placeholder {
    color: #3a3936;
  }

  .wl-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 1.2rem;
    gap: 1rem;
    animation: fadeUp 0.4s 0.35s both;
  }

  .wl-hint {
    font-size: 11px;
    color: var(--muted);
  }

  .wl-btn {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 0.75rem 1.75rem;
    background: linear-gradient(135deg, rgb(140, 223, 244) 0%, rgb(48, 113, 225) 100%);
    color: #fff;
    border: none;
    border-radius: var(--radius);
    font-family: var(--font-display);
    font-size: 14px;
    font-weight: 700;
    letter-spacing: 0.01em;
    cursor: pointer;
    transition: opacity 0.15s, transform 0.15s, box-shadow 0.15s;
    white-space: nowrap;
    flex-shrink: 0;
  }

  .wl-btn:hover:not(:disabled) {
    opacity: 0.9;
    transform: translateY(-1px);
    box-shadow: 0 8px 24px rgba(48,113,225,0.35);
  }

  .wl-btn:active:not(:disabled) {
    transform: translateY(0);
    box-shadow: none;
  }

  .wl-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .wl-spinner {
    width: 14px;
    height: 14px;
    border: 2px solid rgba(255,255,255,0.3);
    border-top-color: #fff;
    border-radius: 50%;
    animation: spin 0.7s linear infinite;
    flex-shrink: 0;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  .wl-toast {
    position: fixed;
    bottom: 2rem;
    left: 50%;
    transform: translateX(-50%) translateY(8px);
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 0.8rem 1.4rem;
    border-radius: var(--radius);
    font-size: 13px;
    font-family: var(--font-mono);
    animation: toastIn 0.3s cubic-bezier(0.22,1,0.36,1) forwards;
    pointer-events: none;
    white-space: nowrap;
    z-index: 999;
  }

  .wl-toast.success {
    background: #0f1f16;
    color: var(--success);
    border: 1px solid rgba(71,255,156,0.2);
  }

  .wl-toast.error {
    background: #1f0f0f;
    color: var(--danger);
    border: 1px solid rgba(255,71,71,0.2);
  }

  @keyframes toastIn {
    from { opacity: 0; transform: translateX(-50%) translateY(16px); }
    to   { opacity: 1; transform: translateX(-50%) translateY(0); }
  }

  .wl-divider {
    height: 1px;
    background: var(--border);
    margin: 2rem 0;
    animation: fadeUp 0.4s 0.28s both;
  }

  .wl-stats {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
    animation: fadeUp 0.4s 0.32s both;
  }

  .wl-stat {
    background: var(--bg);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    padding: 1rem 1.2rem;
  }

  .wl-stat-label {
    font-size: 10px;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--muted);
    margin-bottom: 4px;
  }

  .wl-stat-value {
    font-family: var(--font-display);
    font-size: 1.5rem;
    font-weight: 800;
    color: var(--text);
    transition: color 0.3s;
  }

  .wl-stat-value.highlighted {
    background: linear-gradient(135deg, rgb(140, 223, 244) 0%, rgb(48, 113, 225) 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
`;

// ── Toast component ────────────────────────────────────────────────────────────
type ToastState = { type: "success" | "error"; message: string } | null;

export default function WaitlistPage() {
  const [emails, setEmails] = useState("");
  const [isPending, setIsPending] = useState(false);
  const [toast, setToast] = useState<ToastState>(null);
  const [totalAdded, setTotalAdded] = useState(0);
  const [lastBatch, setLastBatch] = useState(0);
  const [waitlistEntries, setWaitlistEntries] = useState<any[]>([]);

  const emailCount = emails
    .split(/[\n,]+/)
    .map((e) => e.trim())
    .filter((e) => e.length > 0).length;

  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    const ADMIN_EMAIL = "draewe3@gmail.com"; // Hardcoded for client-side check if NOT using NEXT_PUBLIC_
    if (status === "unauthenticated" || (status === "authenticated" && session?.user?.email !== ADMIN_EMAIL)) {
      router.push("/");
    }
  }, [session, status, router]);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const fetchEntries = async () => {
    try {
      const response = await fetch("/api/admin/waitlist");
      if (response.ok) {
        const data = await response.json();
        setWaitlistEntries(data);
      }
    } catch (error) {
      console.error("Failed to fetch waitlist:", error);
    }
  };

  useEffect(() => {
    if (status === "authenticated" && session?.user?.email === "draewe3@gmail.com") {
      fetchEntries();
    }
  }, [status, session]);

  if (status === "loading" || (session?.user?.email !== "draewe3@gmail.com")) {
    return null; // Or a loading spinner
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsPending(true);

    const emailList = emails
      .split(/[\n,]+/)
      .map((e) => e.trim())
      .filter((e) => e.length > 0);

    if (emailList.length === 0) {
      setToast({ type: "error", message: "No emails found" });
      setIsPending(false);
      return;
    }

    try {
      const response = await fetch("/api/admin/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ emails: emailList }),
      });

      if (response.ok) {
        setLastBatch(emailList.length);
        setTotalAdded((prev) => prev + emailList.length);
        setToast({ type: "success", message: `${emailList.length} emails added successfully` });
        setEmails("");
        fetchEntries(); // Refresh list
      } else {
        setToast({ type: "error", message: "Failed to add emails" });
      }
    } catch {
      setToast({ type: "error", message: "An error occurred" });
    } finally {
      setIsPending(false);
    }
  }

  return (
    <>
      <style>{css}</style>
      <style>{`
        .wl-list-con {
          margin-top: 3rem;
          max-height: 400px;
          overflow-y: auto;
          scrollbar-width: thin;
          scrollbar-color: var(--accent) transparent;
        }
        .wl-list-con::-webkit-scrollbar {
          width: 4px;
        }
        .wl-list-con::-webkit-scrollbar-thumb {
          background: var(--accent);
          border-radius: 4px;
        }
        .wl-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 12px;
        }
        .wl-th {
          text-align: left;
          color: var(--muted);
          text-transform: uppercase;
          letter-spacing: 0.1em;
          padding: 10px;
          border-bottom: 1px solid var(--border);
        }
        .wl-td {
          padding: 12px 10px;
          border-bottom: 1px solid var(--border);
        }
        .wl-no-data {
          text-align: center;
          color: var(--muted);
          padding: 2rem;
          font-size: 13px;
        }
      `}</style>
      <div className="wl-root">
        <div className="wl-card">
          {/* Badge */}
          <div className="wl-badge">
            <div className="wl-badge-dot" />
            Admin Console
          </div>

          {/* Title */}
          <h1 className="wl-title">
            Waitlist <span>Management</span>
          </h1>
          <p className="wl-desc">
            Paste emails below — comma or newline separated. All entries are validated before ingestion.
          </p>

          {/* Stats */}
          <div className="wl-stats">
            <div className="wl-stat">
              <div className="wl-stat-label">Session total</div>
              <div className={`wl-stat-value ${totalAdded > 0 ? "highlighted" : ""}`}>
                {totalAdded.toLocaleString()}
              </div>
            </div>
            <div className="wl-stat">
              <div className="wl-stat-label">Total in base</div>
              <div className="wl-stat-value highlighted">
                {waitlistEntries.length.toLocaleString()}
              </div>
            </div>
          </div>

          <div className="wl-divider" />

          {/* Form */}
          <form onSubmit={handleSubmit}>
            <div className="wl-label">
              <span>Email list</span>
              {emailCount > 0 && (
                <span className="wl-count">{emailCount} detected</span>
              )}
            </div>

            <div className="wl-textarea-wrap">
              <textarea
                className="wl-textarea"
                placeholder={"alice@example.com\nbob@example.com, carol@example.com"}
                value={emails}
                onChange={(e) => setEmails(e.target.value)}
                disabled={isPending}
              />
            </div>

            <div className="wl-footer">
              <p className="wl-hint">
                Supports commas &amp; newlines
              </p>
              <button
                type="submit"
                className="wl-btn"
                disabled={isPending || emailCount === 0}
              >
                {isPending && <span className="wl-spinner" />}
                {isPending ? "Adding…" : `Add ${emailCount > 0 ? emailCount : ""} to Waitlist`}
              </button>
            </div>
          </form>

          {/* Waitlist List */}
          <div className="wl-list-con">
            <h3 style={{ fontSize: '14px', marginBottom: '1rem', color: 'var(--text)' }}>Current Waitlist</h3>
            {waitlistEntries.length === 0 ? (
              <div className="wl-no-data">No entries found in database</div>
            ) : (
              <table className="wl-table">
                <thead>
                  <tr>
                    <th className="wl-th">Email</th>
                    <th className="wl-th" style={{ textAlign: 'right' }}>ID</th>
                  </tr>
                </thead>
                <tbody>
                  {waitlistEntries.map((entry: any) => (
                    <tr key={entry.id}>
                      <td className="wl-td">{entry.email}</td>
                      <td className="wl-td" style={{ textAlign: 'right', color: 'var(--muted)', fontSize: '10px' }}>
                        {entry.id.substring(0, 8)}...
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div className={`wl-toast ${toast.type}`}>
          {toast.type === "success" ? "✓" : "✕"} {toast.message}
        </div>
      )}
    </>
  );
}