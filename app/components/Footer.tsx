export default function Footer() {
  return (
    <footer className="border-t border-slate-800/80">
      <div className="mx-auto flex max-w-4xl flex-col gap-2 px-6 py-8 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
        <p>IdVerifier &middot; Soroban proof-of-concept, Testnet only. Do not submit real identity data.</p>
        <p>Powered by Stellar &amp; Freighter</p>
      </div>
    </footer>
  );
}
