"use client";

import { useEffect, useState } from "react";
import { connectFreighter, getFreighterPublicKey, isFreighterConnected } from "../../lib/stellar";

interface WalletButtonProps {
  publicKey: string;
  setPublicKey: (key: string) => void;
}

export default function WalletButton({ publicKey, setPublicKey }: WalletButtonProps) {
  const [status, setStatus] = useState("Checking Freighter...");

  useEffect(() => {
    async function load() {
      if (typeof window === "undefined") return;
      if (!(window as any).freighter) {
        setStatus("Freighter not detected. Please install the browser extension.");
        return;
      }

      try {
        const connected = await isFreighterConnected();
        if (connected) {
          const key = await getFreighterPublicKey();
          setPublicKey(key);
          setStatus("Freighter wallet connected.");
        } else {
          setStatus("Freighter is available. Connect to continue.");
        }
      } catch (error) {
        console.error(error);
        setStatus("Unable to check Freighter status.");
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
