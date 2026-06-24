# Contributing to soroban-IDVerifier-It

Thank you for your interest in contributing to soroban-IDVerifier-It! This document outlines guidelines and instructions for contributing to the project.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Making Changes](#making-changes)
- [Testing](#testing)
- [Submitting Changes](#submitting-changes)
- [Reporting Issues](#reporting-issues)
- [Project Structure](#project-structure)
- [Questions or Need Help?](#questions-or-need-help)

## Code of Conduct

We are committed to providing a welcoming and inclusive environment for all contributors. Please:

- Be respectful and constructive in all interactions
- Be inclusive and considerate of different perspectives and experience levels
- Report inappropriate behavior to project maintainers
- Focus on what's best for the community

## Getting Started

### Fork and Clone

1. Fork the repository on GitHub
2. Clone your fork locally:

```bash
git clone https://github.com/YOUR_USERNAME/soroban-IDVerifier-It.git
cd soroban-IDVerifier-It
```

3. Add upstream remote to stay in sync:

```bash
git remote add upstream https://github.com/original-owner/soroban-IDVerifier-It.git
```

### Create a Branch

Create a descriptive branch for your work:

```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/your-bug-fix
```

Branch naming conventions:
- `feature/` for new features
- `fix/` for bug fixes
- `docs/` for documentation changes
- `test/` for test improvements
- `chore/` for maintenance tasks

## Development Setup

### Prerequisites

- Node.js 22+ (recommended)
- npm or pnpm
- Rust toolchain (for Soroban contract development)
- Stellar Freighter wallet browser extension (for testing frontend)

### Frontend Setup

```bash
# Install dependencies
npm install

# Create environment file
cp .env.example .env.local

# Add your Soroban contract ID (if testing with an existing contract)
# NEXT_PUBLIC_SOROBAN_CONTRACT_ID=YOUR_DEPLOYED_CONTRACT_ID

# Start development server
npm run dev
```

Visit `http://localhost:3000` to view the app.

### Soroban Contract Setup

```bash
# Navigate to contract directory
cd contracts/idverifier

# Install Soroban CLI if not already installed
cargo install soroban-cli

# Build the contract
cargo build --target wasm32-unknown-unknown --release

# Run tests
cargo test
```

## Making Changes

### Frontend Changes

- Use TypeScript for type safety
- Follow the existing component structure in `app/components/`
- Maintain Tailwind CSS utility-first approach for styling
- Keep components focused and modular

### Smart Contract Changes

- Add or modify Soroban contract code in `contracts/idverifier/src/lib.rs`
- Update `Cargo.toml` if adding dependencies
- Add corresponding tests in `contracts/idverifier/tests/`
- Ensure backward compatibility when possible

### Code Style

- Use ESLint for frontend code
- Follow Rust community conventions (enforced by rustfmt)
- Keep commits atomic and descriptive
- Write clear commit messages

## Testing

### Frontend Tests

```bash
# Build the project (validates TypeScript)
npm run build

# Lint the code
npm run lint
```

### Smart Contract Tests

```bash
cd contracts/idverifier

# Run Rust tests
cargo test

# Build for deployment
cargo build --target wasm32-unknown-unknown --release
```

### Manual Testing

1. **Wallet Connection**: Test connecting/disconnecting Freighter
2. **Hash Submission**: Test submitting identity hashes with various input formats
3. **Read Operations**: Test fetching stored hashes for different addresses
4. **Error Handling**: Verify error messages display correctly

## Submitting Changes

### Before Submitting a PR

1. Sync your branch with upstream:

```bash
git fetch upstream
git rebase upstream/main
```

2. Test your changes locally:
   - Frontend: `npm run build` and `npm run dev`
   - Contract: `cargo test`

3. Commit with clear messages:

```bash
git commit -m "feat: add new wallet connection feature

- Implement Freighter auto-detection
- Add connection status indicator
- Update error handling"
```

### Pull Request Process

1. Push to your fork:

```bash
git push origin feature/your-feature-name
```

2. Open a PR on GitHub with:
   - Clear title describing the change
   - Detailed description of what and why
   - Reference any related issues: `Fixes #123`
   - Mention any breaking changes

3. PR Template (suggested):

```markdown
## Description
Brief description of the change.

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Documentation update
- [ ] Contract improvement

## Testing
How to test this change:
1. Step 1
2. Step 2

## Checklist
- [ ] Code follows project style
- [ ] Tests pass locally
- [ ] No new warnings introduced
- [ ] Documentation updated if needed
```

4. Engage with reviewers:
   - Respond to feedback promptly
   - Request changes if needed
   - Thank reviewers for their time

## Reporting Issues

### Before Creating an Issue

- Search existing issues to avoid duplicates
- Check the README for common questions
- Review the CONTRIBUTING guide

### Issue Template (suggested)

```markdown
## Description
Clear description of the issue.

## Environment
- OS: [e.g., macOS, Linux, Windows]
- Node version: [e.g., 22.0.0]
- Browser: [if frontend-related]
- Freighter version: [if wallet-related]

## Steps to Reproduce
1. Step 1
2. Step 2

## Expected Behavior
What should happen.

## Actual Behavior
What actually happens.

## Screenshots
If applicable, add screenshots.
```

### Issue Categories

- **Bug Report**: Something is broken
- **Feature Request**: New functionality
- **Documentation**: Unclear or missing docs
- **Question**: General inquiries (use Discussions if available)

## Project Structure

```
soroban-IDVerifier-It/
├── app/                          # Next.js frontend
│   ├── components/               # React components
│   ├── layout.tsx               # Root layout
│   ├── page.tsx                 # Main page
│   └── globals.css              # Global styles
├── lib/                          # Shared utilities
│   └── stellar.ts               # Stellar/Freighter integration
├── contracts/idverifier/        # Soroban smart contract
│   ├── src/lib.rs              # Contract implementation
│   ├── tests/basic.rs          # Contract tests
│   └── Cargo.toml              # Rust dependencies
├── .env.example                 # Environment template
├── package.json                 # Node dependencies
├── tsconfig.json                # TypeScript config
├── next.config.mjs              # Next.js config
├── tailwind.config.ts           # Tailwind CSS config
└── README.md                    # This file
```

### Key Files

- **Frontend entry**: `app/page.tsx`
- **Wallet integration**: `lib/stellar.ts`
- **UI Components**: `app/components/WalletButton.tsx`, `VerificationForm.tsx`
- **Contract logic**: `contracts/idverifier/src/lib.rs`

## Areas for Contribution

We welcome contributions in these areas:

- **Frontend enhancements**: Better UX, accessibility improvements, additional features
- **Smart contract improvements**: Optimization, additional functions, better error handling
- **Documentation**: Clearer guides, API documentation, architecture diagrams
- **Testing**: Unit tests, integration tests, test coverage
- **Bug fixes**: Issues marked with `good first issue` or `help wanted`
- **CI/CD**: GitHub Actions workflows, deployment automation

## Questions or Need Help?

- **GitHub Issues**: For bugs and feature requests
- **Discussions**: For general questions (if enabled)
- **Email**: Contact project maintainers for sensitive matters
- **Documentation**: Check README.md and inline code comments first

## Recognition

Contributors will be recognized in:
- GitHub contributor graph
- Project README (for significant contributions)
- Release notes

Thank you for making soroban-IDVerifier-It better! 🎉
