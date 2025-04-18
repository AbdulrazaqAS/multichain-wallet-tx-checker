export const CHAINS = [
  {
    id: 1,
    name: "Ethereum",
    getTxUrl: (hash) => `https://etherscan.io/tx/${hash}`
  },
  {
    id: 56,
    name: "BNB Chain",
    getTxUrl: (hash) => `https://bscscan.com/tx/${hash}`
  },
  {
    id: 137,
    name: "Polygon",
    getTxUrl: (hash) => `https://polygonscan.com/tx/${hash}`
  },
  {
    id: 43114,
    name: "Avalanche",
    getTxUrl: (hash) => `https://snowtrace.io/tx/${hash}`
  },
  {
    id: 10,
    name: "Optimism",
    getTxUrl: (hash) => `https://optimistic.etherscan.io/tx/${hash}`
  },
  {
    id: 42161,
    name: "Arbitrum",
    getTxUrl: (hash) => `https://arbiscan.io/tx/${hash}`
  },
  {
    id: 11155111,
    name: "Eth Sepolia",
    getTxUrl: (hash) => `https://sepolia.etherscan.io/tx/${hash}`
  },
  {
    id: -1,
    name: "Invalid",
  }
];
