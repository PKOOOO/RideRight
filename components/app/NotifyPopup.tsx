"use client";

import { useState, useEffect } from "react";
import { Bell, X, Check } from "lucide-react";

export function NotifyPopup() {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [subscribedEmail, setSubscribedEmail] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  useEffect(() => {
    const saved = localStorage.getItem("notify-subscribed-email");
    if (saved) {
      setSubscribedEmail(saved);
      return; // don't auto-open if already subscribed
    }

    const dismissed = localStorage.getItem("notify-popup-dismissed");
    if (dismissed) return;

    const timer = setTimeout(() => setOpen(true), 5000);
    return () => clearTimeout(timer);
  }, []);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");

    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) throw new Error();

      localStorage.setItem("notify-subscribed-email", email);
      localStorage.setItem("notify-popup-dismissed", "true");
      setSubscribedEmail(email);
      setStatus("success");
    } catch {
      setStatus("error");
    }
  };

  const handleUnsubscribe = async () => {
    if (!subscribedEmail) return;
    setStatus("loading");

    try {
      await fetch("/api/unsubscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: subscribedEmail }),
      });

      localStorage.removeItem("notify-subscribed-email");
      localStorage.removeItem("notify-popup-dismissed");
      setSubscribedEmail(null);
      setEmail("");
      setStatus("idle");
    } catch {
      setStatus("error");
    }
  };

  const handleClose = () => {
    setOpen(false);
    if (!subscribedEmail) {
      localStorage.setItem("notify-popup-dismissed", "true");
    }
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-red-500 text-white shadow-lg transition hover:bg-red-600"
        aria-label="Notification settings"
      >
        <Bell className="h-6 w-6" />
      </button>

      {open && (
        <div className="fixed bottom-24 right-6 z-50 w-80 overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-xl dark:border-zinc-800 dark:bg-zinc-900">
          <div className="flex items-center gap-2.5 bg-red-500 px-4 py-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white">
              <Bell className="h-4 w-4 text-red-500" />
            </div>
            <p className="flex-1 text-sm font-medium text-white">RideRight Autos</p>
            <button onClick={handleClose} aria-label="Close">
              <X className="h-4 w-4 text-white/80" />
            </button>
          </div>

          <div className="p-4">
            {subscribedEmail ? (
              <div className="text-center">
                <div className="mx-auto mb-2 flex h-9 w-9 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
                  <Check className="h-4 w-4 text-green-600 dark:text-green-400" />
                </div>
                <p className="text-sm font-medium">You're subscribed</p>
                <p className="mt-0.5 mb-3 text-xs text-zinc-500">{subscribedEmail}</p>
                <button
                  onClick={handleUnsubscribe}
                  disabled={status === "loading"}
                  className="w-full rounded-md border border-zinc-300 py-2 text-xs font-medium text-zinc-600 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-800"
                >
                  {status === "loading" ? "Removing..." : "Unsubscribe"}
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubscribe}>
                <p className="mb-3 text-sm text-zinc-600 dark:text-zinc-400">
                  Want to know the moment we add new cars? Drop your email and we'll let you know.
                </p>
                <input
                  type="email"
                  required
                  placeholder="name@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mb-2 w-full rounded-md border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-800"
                />
                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="mb-1.5 w-full rounded-md bg-red-500 py-2 text-sm font-medium text-white hover:bg-red-600 disabled:opacity-60"
                >
                  {status === "loading" ? "Subscribing..." : "Notify me"}
                </button>
                {status === "error" && (
                  <p className="mb-1 text-center text-xs text-red-500">Something went wrong. Try again.</p>
                )}
                <button
                  type="button"
                  onClick={handleClose}
                  className="w-full py-1 text-center text-xs text-zinc-400 hover:text-zinc-600"
                >
                  Not now
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}