# Multi-Chain Wallet TX Checker

A web-based tool to **track wallet transactions and balances across multiple blockchains**. Built with **Next.js**, **Tailwind CSS**, and serverless API routes powered by **Etherscan v2 API**, this app provides an easy way to check incoming and outgoing transactions for a given wallet address across several supported chains.

---

## Features

- ✅ Track **incoming** and **outgoing** transactions
- 🌐 Supports multiple chains (Ethereum, BNB Chain, Polygon, Arbitrum, etc.)
- 📅 Optional date filtering via block range estimation
- 🔁 Fetches data from **Etherscan v2 unified API**
- 🧠 Detects native token (ETH/BNB/MATIC/etc.)
- 🌐 Auto-detects the block explorer per chain
- 💡 Clean and responsive UI built with Tailwind CSS
- 🔒 Serverless backend to protect API keys (Vercel-compatible)

---

## Demo
[Visit](https://wallet-tx-checker.vercel.app/) the app deployed on Vercel.

---

## Tech Stack

- **Frontend**: React + Next.js + Tailwind CSS
- **Backend**: Next.js API routes (Serverless)
- **API**: Etherscan v2 (multi-chain endpoint)
- **Deployment**: Vercel

---

## Installation

```bash
# Clone the repo
git clone https://github.com/AbdulrazaqAS/multichain-wallet-tx-checker.git
cd multichain-wallet-tx-checker

# Install dependencies
npm install

# Set up environment variables
touch .env.local
# Add your ETHERSCAN_API_KEY to .env.local

# Run development server
npm run dev
```
Then visit [http://localhost:3000](http://localhost:3000)

## Project Structure
src/
├── api/              # Client-side API utility functions
├── components/       # Reusable React components
├── pages/            # Next.js pages and API routes
├── utils/            # Chain definitions, helpers, etc.
