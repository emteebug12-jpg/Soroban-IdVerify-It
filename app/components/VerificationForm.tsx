"use client";

import { useState } from "react";
import { buildRegisterIdTransaction, fetchStoredIdHash, signAndSubmitTransaction } from "../../lib/stellar";
import CopyButton from "./CopyButton";

interface VerificationFormProps {
  publicKey: string;
}

type StatusTone = "info" | "success" | "error";

const TONE_CLASSES: Record<StatusTone, string> = {
  info: "border-slate-800 text-slate-300",
  success: "border-emerald-500/40 text-emerald-300",
  error: "border-rose-500/40 text-rose-300",
};

function Spinner() {
  return (
    <svg className="h-3.5 w-3.5 animate-spin" viewBox="0 0 24 24" fill="none">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 0 1 8-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
  );
}

export default function VerificationForm({ publicKey }: VerificationFormProps) {
  const [documentValue, setDocumentValue] = useState("");
  const [message, setMessage] = useState("Enter a sample identity payload to hash and store.");
  const [tone, setTone] = useState<StatusTone>("info");
  const [transactionHash, setTransactionHash] = useState("");
  const [storedHash, setStoredHash] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!publicKey) {
      setTone("error");
      setMessage("Connect a wallet first.");
      return;
    }
    if (!documentValue.trim()) {
      setTone("error");
      setMessage("Provide a string to hash before submitting.");
      return;
    }

    setIsSubmitting(true);
    setTone("info");
    setMessage("Preparing Soroban transaction...");
    setTransactionHash("");

    try {
      const transaction = await buildRegisterIdTransaction(publicKey, documentValue);
      setMessage("Signing transaction with Freighter...");
      const result = await signAndSubmitTransaction(transaction, publicKey);
      setTransactionHash(result.hash ?? "");
      setTone("success");
      setMessage("Identity hash recorded successfully.");
    } catch (error) {
      console.error(error);
      setTone("error");
      setMessage(error instanceof Error ? error.message : String(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFetch = async () => {
    if (!publicKey) {
      setTone("error");
      setMessage("Connect a wallet first.");
      return;
    }

    setIsSubmitting(true);
    setTone("info");
    setMessage("Querying stored value from Soroban...");

    try {
      const result = await fetchStoredIdHash(publicKey);
      setStoredHash(result);
      setTone(result ? "success" : "error");
      setMessage(result ? "Stored hash retrieved." : "No stored hash found for this address.");
    } catch (error) {
      console.error(error);
      setTone("error");
      setMessage(error instanceof Error ? error.message : String(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 shadow-md shadow-slate-900/30">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold tracking-tight text-white">Verify & Record Identity Hash</h2>
        <p className="mt-2 text-slate-400">
          Type a sample document string. It will be hashed locally and submitted to the Soroban contract.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <label className="block text-sm font-medium text-slate-300">
          <div className="flex items-center justify-between">
            <span>Identity payload</span>
            <span className="text-xs font-normal text-slate-500">{documentValue.length} characters</span>
          </div>
          <textarea
            value={documentValue}
            onChange={(event) => setDocumentValue(event.target.value)}
            rows={4}
            className="mt-2 w-full rounded-3xl border border-slate-700 bg-slate-950/70 px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20"
            placeholder="Any string that represents the identity document hash source..."
          />
        </label>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center justify-center rounded-2xl bg-cyan-500 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? "Processing…" : "Verify & Record on Stellar"}
          </button>
          <button
            type="button"
            onClick={handleFetch}
            disabled={isSubmitting}
            className="inline-flex items-center justify-center rounded-2xl border border-slate-700 bg-slate-950/80 px-6 py-3 text-sm text-slate-200 transition hover:border-slate-500 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? "Working…" : "Fetch Stored ID Hash"}
          </button>
        </div>
      </form>

      <div className="mt-6 rounded-3xl bg-slate-950/70 p-5 text-sm text-slate-300">
        <p>{message}</p>
        {transactionHash ? (
          <p className="mt-3 break-all">Transaction hash: <span className="font-mono text-slate-100">{transactionHash}</span></p>
        ) : null}
        {storedHash ? (
          <p className="mt-3 break-all">Stored hash: <span className="font-mono text-slate-100">{storedHash}</span></p>
        ) : null}
      </div>
    </section>
  );
}
