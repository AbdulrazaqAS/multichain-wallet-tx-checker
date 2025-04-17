import { useState } from "react";
import ChainSelector from "@/components/ChainSelector";

async function fetchTransactionsFromServer(address, chains) {
  const query = new URLSearchParams({
    address,
    chains: chains.join(',')
  });

  const isDev = process.env.NODE_ENV === 'development';
  const endpoint = isDev
        ? "http://localhost:5000/api/fetchTransactions"
        : "/api/fetchTransactions";
  const url = `${endpoint}?${query.toString()}`;

  try {
    const res = await fetch(url, {method: "POST"});
    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Fetch error:", error.message);
    return [];
  }
}

export default function Home() {
  const [address, setAddress] = useState("0xE09b13f723f586bc2D98aa4B0F2C27A0320D20AB");
  const [selectedChains, setSelectedChains] = useState([]);
  const [incoming, setIncoming] = useState([]);
  const [outgoing, setOutgoing] = useState([]);
  const [isFetching, setIsFetching] = useState(false);

  async function fetchTxs() {
    setIsFetching(true);
    let allIncoming = [];
    let allOutgoing = [];
    
    const txs = await fetchTransactionsFromServer(address, selectedChains);
    for (let i=0; i<selectedChains.length; i++) {
      const chainTxs = txs[i];
      const incomingTxs = chainTxs.filter(tx => tx.to?.toLowerCase() === address.toLowerCase());
      const outgoingTxs = chainTxs.filter(tx => tx.from?.toLowerCase() === address.toLowerCase());
      allIncoming.push(...incomingTxs.map(tx => ({ ...tx, chainId: selectedChains[i] })));
      allOutgoing.push(...outgoingTxs.map(tx => ({ ...tx, chainId: selectedChains[i] })));
    }

    setIncoming(allIncoming);
    setOutgoing(allOutgoing);
    setIsFetching(false);
  }

  return (
    <main className="min-h-screen bg-gray-100 p-10">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold mb-4">Wallet TX Checker</h1>

        <input
          placeholder="Wallet address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className="w-full border px-3 py-2 mb-4 rounded"
        />

        <ChainSelector selectedChains={selectedChains} onSelectedChainsChange={setSelectedChains} />

        <button
          onClick={fetchTxs}
          disabled={isFetching}
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {isFetching ? "Fetching..." : "Fetch"}
        </button>

        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-2">Incoming Transactions</h2>
          <table className="w-full text-left border mb-8">
            <thead className="bg-gray-200">
              <tr>
                <th className="p-2">Hash</th>
                <th className="p-2">From</th>
                <th className="p-2">Value</th>
                <th className="p-2">Chain</th>
              </tr>
            </thead>
            <tbody>
              {incoming.map((tx, i) => (
                <tr key={i} className="border-t">
                  <td className="p-2 truncate max-w-[200px]">{tx.hash}</td>
                  <td className="p-2 truncate max-w-[150px]">{tx.from}</td>
                  <td className="p-2">{(parseFloat(tx.value) / 1e18).toFixed(4)}</td>
                  <td className="p-2">{tx.chainId}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <h2 className="text-xl font-semibold mb-2">Outgoing Transactions</h2>
          <table className="w-full text-left border">
            <thead className="bg-gray-200">
              <tr>
                <th className="p-2">Hash</th>
                <th className="p-2">To</th>
                <th className="p-2">Value</th>
                <th className="p-2">Chain</th>
              </tr>
            </thead>
            <tbody>
              {outgoing.map((tx, i) => (
                <tr key={i} className="border-t">
                  <td className="p-2 truncate max-w-[200px]">{tx.hash}</td>
                  <td className="p-2 truncate max-w-[150px]">{tx.to}</td>
                  <td className="p-2">{(parseFloat(tx.value) / 1e18).toFixed(4)}</td>
                  <td className="p-2">{tx.chainId}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}