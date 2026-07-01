"use client";

import { useState } from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import WalletButton from "./components/WalletButton";
import VerificationForm from "./components/VerificationForm";

export default function Page() {
  const [publicKey, setPublicKey] = useState("");

  return (
    <div className="flex min-h-screen flex-col bg-slate-950 text-slate-100">
      <Header />

      <main className="flex-1">
        <div className="mx-auto max-w-4xl px-6 py-10">
          <div className="mb-10 rounded-3xl border border-slate-800 bg-slate-900/90 p-8 shadow-xl shadow-slate-900/30">
            <h1 className="text-4xl font-semibold tracking-tight text-white">Identity hash verification</h1>
            <p className="mt-4 max-w-2xl leading-relaxed text-slate-400">
              Link your Freighter wallet, hash a document payload locally, and store a 32-byte identity hash on the Soroban blockchain &mdash; nothing but the hash ever leaves your browser.
            </p>

            <ol className="mt-6 flex flex-col gap-3 text-sm text-slate-400 sm:flex-row sm:gap-6">
              <li className="flex items-center gap-2">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-slate-800 text-xs font-semibold text-slate-300">1</span>
                Connect Freighter
              </li>
              <li className="flex items-center gap-2">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-slate-800 text-xs font-semibold text-slate-300">2</span>
                Hash your payload
              </li>
              <li className="flex items-center gap-2">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-slate-800 text-xs font-semibold text-slate-300">3</span>
                Record on-chain
              </li>
            </ol>
          </div>

          <WalletButton publicKey={publicKey} setPublicKey={setPublicKey} />
          <VerificationForm publicKey={publicKey} />
        </div>
      </main>

      <Footer />
    </div>
  );
}
