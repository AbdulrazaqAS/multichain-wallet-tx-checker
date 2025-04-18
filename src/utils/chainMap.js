export const CHAINS = [
  {
    id: 1,
    name: "Ethereum",
    currency: "ETH",
    getTxUrl: (hash) => `https://etherscan.io/tx/${hash}`
  },
  {
    id: 11155111,
    name: "Eth Sepolia",
    currency: "ETH",
    getTxUrl: (hash) => `https://sepolia.etherscan.io/tx/${hash}`
  },
  {
    id: 56,
    name: "BNB Chain",
    currency: "BNB",
    getTxUrl: (hash) => `https://bscscan.com/tx/${hash}`
  },
  {
    id: 137,
    name: "Polygon",
    currency: "MATIC",
    getTxUrl: (hash) => `https://polygonscan.com/tx/${hash}`
  },
  {
    id: 43114,
    name: "Avalanche",
    currency: "AVAX",
    getTxUrl: (hash) => `https://snowtrace.io/tx/${hash}`
  },
  {
    id: 10,
    name: "Optimism",
    currency: "ETH",
    getTxUrl: (hash) => `https://optimistic.etherscan.io/tx/${hash}`
  },
  {
    id: 42161,
    name: "Arbitrum",
    currency: "ETH",
    getTxUrl: (hash) => `https://arbiscan.io/tx/${hash}`
  },
  {
    id: 8453,
    name: "Base",
    currency: "ETH",
    getTxUrl: (hash) => `https://basescan.org/tx/${hash}`
  },
  {
    id: 1101,
    name: "Polygon zkEVM",
    currency: "ETH",
    getTxUrl: (hash) => `https://zkevm.polygonscan.com/tx/${hash}`
  },
  {
    id: 534352,
    name: "Scroll",
    currency: "ETH",
    getTxUrl: (hash) => `https://scrollscan.com/tx/${hash}`
  },
  {
    id: 59144,
    name: "Linea",
    currency: "ETH",
    getTxUrl: (hash) => `https://lineascan.build/tx/${hash}`
  },
  {
    id: 5000,
    name: "Mantle",
    currency: "MNT",
    getTxUrl: (hash) => `https://explorer.mantle.xyz/tx/${hash}`
  },
  {
    id: 1284,
    name: "Moonbeam",
    currency: "GLMR",
    getTxUrl: (hash) => `https://moonscan.io/tx/${hash}`
  },
  {
    id: 1285,
    name: "Moonriver",
    currency: "MOVR",
    getTxUrl: (hash) => `https://moonriver.moonscan.io/tx/${hash}`
  },
  {
    id: 100,
    name: "Gnosis",
    currency: "xDAI",
    getTxUrl: (hash) => `https://gnosisscan.io/tx/${hash}`
  },
  {
    id: 42220,
    name: "Celo",
    currency: "CELO",
    getTxUrl: (hash) => `https://celoscan.io/tx/${hash}`
  },
  {
    id: 25,
    name: "Cronos",
    currency: "CRO",
    getTxUrl: (hash) => `https://cronoscan.com/tx/${hash}`
  },
  {
    id: 199,
    name: "BitTorrent Chain",
    currency: "BTT",
    getTxUrl: (hash) => `https://bttcscan.com/tx/${hash}`
  },
  {
    id: 1111,
    name: "WEMIX3.0",
    currency: "WEMIX",
    getTxUrl: (hash) => `https://wemixscan.com/tx/${hash}`
  },
  {
    id: 324,
    name: "zkSync",
    currency: "ETH",
    getTxUrl: (hash) => `https://explorer.zksync.io/tx/${hash}`
  }
];
