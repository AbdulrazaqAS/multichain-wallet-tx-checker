import { useState } from "react";
import { CHAINS } from "@/utils/chainMap";

import ChainSelector from "@/components/ChainSelector";
import ErrorMessage from "@/components/ErrorMessage";

function getExplorerLink(chainId, hash) {
  const chain = CHAINS.find(c => c.id === parseInt(chainId));
  return chain?.getTxUrl(hash) || "#";
}

function getChainName(chainId) {
  const chain = CHAINS.find(c => c.id === parseInt(chainId));
  return chain?.name || "Unknown";
}

function getCurrency(chainId) {
  return CHAINS.find(c => c.id === parseInt(chainId))?.currency || "Unknown";
}

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
    throw error;
  }
}

async function fetchBalancesFromServer(address, chains) {
  const query = new URLSearchParams({
    address,
    chains: chains.join(',')
  });

  const isDev = process.env.NODE_ENV === 'development';
  const endpoint = isDev
        ? "http://localhost:5000/api/fetchBalances"
        : "/api/fetchBalances";
  const url = `${endpoint}?${query.toString()}`;

  try {
    const res = await fetch(url, {method: "POST"});
    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Fetch error:", error.message);
    throw error;
  }
}

export default function Home() {
  const [address, setAddress] = useState("0xE09b13f723f586bc2D98aa4B0F2C27A0320D20AB");
  const [selectedChains, setSelectedChains] = useState([]);
  const [incoming, setIncoming] = useState([]);
  const [outgoing, setOutgoing] = useState([]);
  const [balances, setBalances] = useState([]);
  const [isFetchingTxs, setIsFetchingTxs] = useState(false);
  const [isFetchingBals, setIsFetchingBals] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const NoChainSelectedError = new Error("Please select at least one chain");
  async function fetchTxs() {
    try {
      if (selectedChains.length === 0) throw NoChainSelectedError;
      
      setErrorMsg("");  // clear prev error
      setIsFetchingTxs(true);
      let allIncoming = [];
      let allOutgoing = [];
      
      const txs = await fetchTransactionsFromServer(address, selectedChains);
      for (let i=0; i<selectedChains.length; i++) {
        const chainTxs = txs[i];

        if (chainTxs[0]?.error){
          console.error(new Error(chainTxs[0].error));
          continue;
        }

        const incomingTxs = chainTxs.filter(tx => tx.to?.toLowerCase() === address.toLowerCase());
        const outgoingTxs = chainTxs.filter(tx => tx.from?.toLowerCase() === address.toLowerCase());
        allIncoming.push(...incomingTxs.map(tx => ({ ...tx, chainId: selectedChains[i] })));
        allOutgoing.push(...outgoingTxs.map(tx => ({ ...tx, chainId: selectedChains[i] })));
      }

      setIncoming(allIncoming);
      setOutgoing(allOutgoing);
      setIsFetchingTxs(false);
    } catch(error){
      setErrorMsg(error.message);
    } finally {
      setIsFetchingTxs(false);
    }
  }
  
  async function fetchBals() {
    try {
      if (selectedChains.length === 0) throw NoChainSelectedError;

        setErrorMsg("");  // clear prev error
        setIsFetchingBals(true);
        
        let bals = await fetchBalancesFromServer(address, selectedChains);
        bals = bals.map((bal, i) => ({ bal, chainId: selectedChains[i] }));
        setBalances(bals);
    } catch(error){
      setErrorMsg(error.message);
    } finally {
      setIsFetchingBals(false);
    }
  }

  return (
    <main className="min-h-screen bg-gray-100 p-10">
      <div className="max-w-max mx-auto bg-white rounded-lg shadow-md p-6">
        {errorMsg && <ErrorMessage message={errorMsg} onDismiss={() => {setErrorMsg("")}} />}
        <h1 className="text-2xl font-bold mb-4">Wallet TX Checker</h1>

        <input
          placeholder="Wallet address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className="w-full border px-3 py-2 mb-4 rounded"
        />

        <ChainSelector selectedChains={selectedChains} onSelectedChainsChange={setSelectedChains} />

        <div className="flex flex-wrap gap-5">
          <button
            onClick={fetchTxs}
            disabled={isFetchingTxs}
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {isFetchingTxs ? "Fetching..." : "Fetch Txs"}
          </button>
          <button
            onClick={fetchBals}
            disabled={isFetchingBals}
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {isFetchingBals ? "Fetching..." : "Fetch Bals"}
          </button>
        </div>

        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-2">Balances</h2>
          <table className="w-full text-left border mb-8">
            <thead className="bg-gray-200">
              <tr>
                <th className="p-2">Balance</th>
                <th className="p-2">Chain</th>
              </tr>
            </thead>
            <tbody>
              {balances.map((tx, i) => (
                <tr key={i} className="border-t">
                  <td className="p-2">
                    {tx.bal != "-1" ? (parseFloat(tx.bal) / 1e18).toFixed(5) : "-1"} {getCurrency(tx.chainId)}
                  </td>
                  <td className="p-2">{getChainName(tx.chainId)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <h2 className="text-xl font-semibold mb-2">Incoming Transactions</h2>
          <table className="w-full text-left border mb-8">
            <thead className="bg-gray-200">
              <tr>
                <th className="p-2">Hash</th>
                <th className="p-2">From</th>
                <th className="p-2">Value</th>
                <th className="p-2">Chain</th>
                <th className="p-2">Time</th>
              </tr>
            </thead>
            <tbody>
              {incoming.map((tx, i) => (
                <tr key={i} className="border-t">
                  <td className="p-2 underline text-blue-500"><a href={getExplorerLink(tx.chainId, tx.hash)} target="_blank">{tx.hash.slice(0, 10) + "..." +tx.hash.slice(56)}</a></td>
                  <td className="p-2 truncate">{tx.from}</td>
                  <td className="p-2">{(parseFloat(tx.value) / 1e18).toFixed(5)} {getCurrency(tx.chainId)}</td>
                  <td className="p-2">{getChainName(tx.chainId)}</td>
                  <td className="p-2">{new Date(Number(tx.timeStamp) * 1000).toLocaleString()}</td>
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
                <th className="p-2">Time</th>
              </tr>
            </thead>
            <tbody>
              {outgoing.map((tx, i) => (
                <tr key={i} className="border-t">
                  <td className="p-2 underline text-blue-500"><a href={getExplorerLink(tx.chainId, tx.hash)} target="_blank">{tx.hash.slice(0, 10) + "..." +tx.hash.slice(56)}</a></td>
                  <td className="p-2 truncate">{tx.to || "Contract Creation"}</td>
                  <td className="p-2">{(parseFloat(tx.value) / 1e18).toFixed(5)} {getCurrency(tx.chainId)}</td>
                  <td className="p-2">{getChainName(tx.chainId)}</td>
                  <td className="p-2">{new Date(Number(tx.timeStamp) * 1000).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}