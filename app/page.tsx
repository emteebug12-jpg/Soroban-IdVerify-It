"use client";

import { useState } from "react";
import WalletButton from "./components/WalletButton";
import VerificationForm from "./components/VerificationForm";

export default function Page() {
  const [publicKey, setPublicKey] = useState("");

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto max-w-4xl px-6 py-10">
        <div className="mb-10 rounded-3xl border border-slate-800 bg-slate-900/90 p-8 shadow-xl shadow-slate-900/30">
          <h1 className="text-4xl font-semibold text-white">IdVerifier</h1>
          <p className="mt-4 max-w-2xl text-slate-400">
            Link your Freighter wallet, hash a document payload locally, and store a 32-byte identity hash on Soroban Testnet.
          </p>
        </div>

        <WalletButton publicKey={publicKey} setPublicKey={setPublicKey} />
        <VerificationForm publicKey={publicKey} />
      </div>
    </main>
  );
}
