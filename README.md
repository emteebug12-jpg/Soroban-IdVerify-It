# soroban-IDVerifier-It

Minimal proof-of-concept to link a Stellar Freighter wallet and store an identity document hash on Soroban Testnet.

> **Help wanted!** This project is open to contributions. See [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines on how to get involved.

## Table of Contents

- [Quick Start](#quick-start)
- [Architecture](#architecture)
- [Soroban Contract](#soroban-contract)
- [Development](#development)
- [Contributing](#contributing)
- [License](#license)

## Quick Start

### Prerequisites

- Node.js 22+ (recommended)
- Stellar Freighter wallet browser extension
- A deployed Soroban contract (or contract ID to test with)

### Setup

1. **Install dependencies:**

```bash
npm install
```

2. **Configure environment:**

```bash
cp .env.example .env.local
```

Edit `.env.local` and add your deployed contract ID:

```env
NEXT_PUBLIC_SOROBAN_CONTRACT_ID=YOUR_DEPLOYED_CONTRACT_ID
```

3. **Run the frontend:**

```bash
npm run dev
```

4. **Open and test:**

Open `http://localhost:3000` in your browser and connect your Freighter wallet to test the app.

## Architecture

- `app/`
  - `layout.tsx` — global page layout and metadata
  - `page.tsx` — main client page showing wallet status and verification form
  - `globals.css` — Tailwind base styles and dark theme
  - `components/`
    - `WalletButton.tsx` — connect/disconnect Freighter and display public key
    - `VerificationForm.tsx` — input to hash a document and submit to contract
- `lib/stellar.ts` — Stellar + Freighter service layer for Soroban transactions
- `contracts/idverifier/` — Rust Soroban smart contract
  - `Cargo.toml` — contract metadata and Soroban SDK
  - `src/lib.rs` — `register_id` / `get_id` contract functions
  - `tests/basic.rs` — basic contract tests

## Soroban Contract

The smart contract exposes two functions:

- **`register_id(user: Address, id_hash: BytesN<32>)`** — Stores a 32-byte identity hash linked to a user's wallet address
- **`get_id(user: Address) -> Option<BytesN<32>>`** — Retrieves the stored hash for a given address

### How It Works

1. User enters identity information in the frontend
2. Frontend hashes the input locally using SHA-256
3. Transaction is built with the contract call and hashed value
4. User signs the transaction with Freighter
5. Signed transaction is submitted to Soroban Testnet
6. Hash is permanently stored on-chain

### Deploying the Contract

To deploy the contract to Soroban Testnet:

```bash
cd contracts/idverifier

# Build the contract
cargo build --target wasm32-unknown-unknown --release

# Deploy using Soroban CLI
soroban contract deploy \
  --wasm target/wasm32-unknown-unknown/release/idverifier.wasm \
  --network testnet
```

This will output a contract ID. Copy it to `.env.local` as `NEXT_PUBLIC_SOROBAN_CONTRACT_ID`.

## Development

### Building

```bash
# Build frontend for production
npm run build

# Start production server
npm start
```

### Testing

```bash
# Frontend validation
npm run build  # Catches TypeScript errors

# Smart contract tests
cd contracts/idverifier
cargo test
```

### Project Structure

```
soroban-IDVerifier-It/
├── app/                 # Next.js frontend (App Router)
├── lib/                 # Shared utilities
├── contracts/           # Soroban smart contract
├── .env.example         # Environment template
├── package.json         # Node dependencies
└── tsconfig.json        # TypeScript configuration
```

## Contributing

We welcome contributions from the community! Whether it's bug fixes, new features, documentation improvements, or even just asking questions—we appreciate it all.

### Getting Started with Contributing

1. Read our [CONTRIBUTING.md](./CONTRIBUTING.md) for detailed guidelines
2. Check for [open issues](https://github.com/emteebug/soroban-IDVerifier-It/issues) or create a new one
3. Fork the repository and create a feature branch
4. Make your changes and test thoroughly
5. Submit a Pull Request with a clear description

### Ways to Contribute

- **Code**: New features, bug fixes, performance improvements
- **Documentation**: Clearer guides, API docs, inline code comments
- **Testing**: Unit tests, integration tests, test coverage
- **Feedback**: Issues, feature requests, discussions

### Quick Contribution Tips

- Start with issues labeled `good first issue` or `help wanted`
- Keep PRs focused on a single concern
- Write clear commit messages
- Test your changes locally before submitting
- Be respectful and constructive in discussions

## Notes

- This is a minimal PoC designed as a starting point for external contributors
- Ensure you have a deployed contract ID before running the frontend
- Both frontend and contract follow their respective community best practices
- Review the [CONTRIBUTING.md](./CONTRIBUTING.md) guide for development practices

## License

This project is open source and available under the [Apache License 2.0](LICENSE).

---

**Questions?** Open an issue or check [CONTRIBUTING.md](./CONTRIBUTING.md) for more guidance.