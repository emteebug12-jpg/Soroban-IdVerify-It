"use client";

import { useEffect, useState } from "react";
import { connectFreighter, getFreighterPublicKey, isFreighterConnected, truncateAddress } from "../../lib/stellar";
import CopyButton from "./CopyButton";

interface WalletButtonProps {
  publicKey: string;
  setPublicKey: (key: string) => void;
}

type StatusTone = "info" | "success" | "error";

const TONE_CLASSES: Record<StatusTone, string> = {
  info: "text-slate-500",
  success: "text-emerald-400",
  error: "text-rose-400",
};

const DOT_CLASSES: Record<StatusTone, string> = {
  info: "bg-slate-500",
  success: "bg-emerald-400",
  error: "bg-rose-400",
};

function Spinner() {
  return (
    <svg className="h-3.5 w-3.5 animate-spin text-slate-500" viewBox="0 0 24 24" fill="none">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 0 1 8-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
  );
}

export default function WalletButton({ publicKey, setPublicKey }: WalletButtonProps) {
  const [status, setStatus] = useState("Checking Freighter...");
  const [tone, setTone] = useState<StatusTone>("info");
  const [isConnecting, setIsConnecting] = useState(true);

  useEffect(() => {
    async function load() {
      if (typeof window === "undefined") return;
      if (!(window as any).freighter) {
        setTone("error");
        setStatus("Freighter not detected. Please install the browser extension.");
        setIsConnecting(false);
        return;
      }

      try {
        const connected = await isFreighterConnected();
        if (connected) {
          const key = await getFreighterPublicKey();
          setPublicKey(key);
          setTone("success");
          setStatus("Freighter wallet connected.");
        } else {
          setTone("info");
          setStatus("Freighter is available. Connect to continue.");
        }
      } catch (error) {
        console.error(error);
        setTone("error");
        setStatus("Unable to check Freighter status.");
      } finally {
        setIsConnecting(false);
      }
    }

    load();
  }, [setPublicKey]);

  const handleConnect = async () => {
    setStatus("Connecting to Freighter...");
    try {
      const key = await connectFreighter();
      setPublicKey(key);
      setStatus("Connected to Freighter.");
    } catch (error) {
      console.error(error);
      setStatus(error instanceof Error ? error.message : String(error));
    }
  };

  const handleDisconnect = () => {
    setPublicKey("");
    setStatus("Disconnected from Freighter.");
  };

  return (
    <section className="mb-8 rounded-3xl border border-slate-800 bg-slate-900/80 p-6 shadow-md shadow-slate-900/30">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Wallet Connection</p>
          <p className="mt-2 text-lg text-slate-200">{publicKey || "No wallet connected."}</p>
          <p className="mt-1 text-sm text-slate-500">{status}</p>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={handleConnect}
            className="rounded-2xl bg-cyan-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400"
          >
            Connect Freighter
          </button>
          <button
            type="button"
            onClick={handleDisconnect}
            className="rounded-2xl border border-slate-700 bg-slate-950/80 px-5 py-3 text-sm text-slate-300 transition hover:border-slate-500"
          >
            Disconnect
          </button>
        </div>
      </div>
    </section>
  );
}
