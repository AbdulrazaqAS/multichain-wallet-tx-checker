import { useState } from "react";
import { CHAINS } from "@/utils/chainMap";

import ChainSelector from "@/components/ChainSelector";
import DateRangeToggle from "@/components/DateRangeToggle";
import ErrorMessage from "@/components/ErrorMessage";
import Footer from "@/components/Footer";

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

async function fetchTransactionsFromServer(address, chains, blockNumbers=null) {
  const query = new URLSearchParams({
    address,
    chains: chains.join(','),
    startBlocks: blockNumbers ? blockNumbers[0].join(',') : "",
    endBlocks: blockNumbers ? blockNumbers[1].join(',') : ""
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

async function getBlockRangeFromDates(chains, startDate, endDate) {
  const startTs = Math.floor(new Date(startDate).getTime() / 1000);
  const endTs = Math.floor(new Date(endDate).getTime() / 1000);

  const startQuery = new URLSearchParams({
    timestamp: startTs,
    chains: chains.join(',')
  });

  const endQuery = new URLSearchParams({
    timestamp: endTs,
    chains: chains.join(',')
  });

  const isDev = process.env.NODE_ENV === 'development';
  const endpoint = isDev
        ? "http://localhost:5000/api/getBlockNumberByTimestamp"
        : "/api/getBlockNumberByTimestamp";

  try {
    const url1 = `${endpoint}?${startQuery.toString()}`;
    const res1 = await fetch(url1, {method: "POST"});

    const url2 = `${endpoint}?${endQuery.toString()}`;
    const res2 = await fetch(url2, {method: "POST"});

    const data1Promise = res1.json()
    const data2Promise = res2.json()
    const data = await Promise.all([data1Promise, data2Promise]);
    
    return data;
  } catch (error) {
    console.error("Fetch error:", error.message);
    throw error;
  }
}

function fixBlockNumbersError(numbers, replaceWith){
  return numbers.map(num => num == '-1' ? replaceWith : num);
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
  const [dateRange, setDateRange] = useState(null);

  const NoChainSelectedError = new Error("Please select at least one chain");
  const InvalidWalletAddressError = new Error("Invalid wallet address");
  const InvalidDateRangeError = new Error("Invalid Date range");

  async function fetchTxs() {
    try {
      if (address.length !== 42) throw InvalidWalletAddressError;
      if (selectedChains.length === 0) throw NoChainSelectedError;
      
      setErrorMsg("");  // clear prev error
      setIsFetchingTxs(true);
      
      let blockNumbers;
      if (dateRange){
        const {start, end} = dateRange;
        if (!start || !end) throw InvalidDateRangeError;

        if (new Date(start).getTime() >= new Date(end).getTime()){
          throw InvalidDateRangeError;
        }
        blockNumbers = await getBlockRangeFromDates(selectedChains, start, end);
        const startBlocks = fixBlockNumbersError(blockNumbers[0], "0");
        const endBlocks = fixBlockNumbersError(blockNumbers[1], "latest");
        blockNumbers = [startBlocks, endBlocks]
      }
      
      let allIncoming = [];
      let allOutgoing = [];
      
      const txs = await fetchTransactionsFromServer(address, selectedChains, blockNumbers);
      for (let i=0; i<selectedChains.length; i++) {
        const chainTxs = txs[i];

        if (chainTxs[0]?.error){
          console.error(`Error in chainId ${selectedChains[i]}:`, new Error(chainTxs[0].error));
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
      if (address.length !== 42) throw InvalidWalletAddressError;
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
    <main className="min-h-screen bg-gray-100 p-1 md:p-10 md:pb-0">
      <div className="max-w-max mx-auto bg-white rounded-lg shadow-md p-1 md:p-6">
        {errorMsg && <ErrorMessage message={errorMsg} onDismiss={() => {setErrorMsg("")}} />}
        <h1 className="text-2xl font-bold mb-4">Multi-chain Wallet TX Checker</h1>

        <input
          placeholder="0x......"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className="w-full border px-3 py-2 mb-4 rounded"
        />

        <ChainSelector selectedChains={selectedChains} onSelectedChainsChange={setSelectedChains} />
        <hr />
        <DateRangeToggle onChange={setDateRange} />

        <div className="flex flex-wrap gap-5">
          <button
            onClick={fetchTxs}
            disabled={isFetchingTxs || isFetchingBals}
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {isFetchingTxs ? "Fetching..." : "Fetch Txs"}
          </button>
          <button
            onClick={fetchBals}
            disabled={isFetchingBals || isFetchingTxs}
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
                    {tx.bal != "-1" ? (parseFloat(tx.bal) / 1e18) : "-1"} {getCurrency(tx.chainId)}
                  </td>
                  <td className="p-2">{getChainName(tx.chainId)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <h2 className="text-xl font-semibold mb-2">Incoming Transactions ({incoming.length})</h2>
          <div className="max-h-140 overflow-auto">
            <table className="w-full text-left border mb-2">
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
                    <td className="p-2">{(parseFloat(tx.value) / 1e18).toFixed(8)} {getCurrency(tx.chainId)}</td>
                    <td className="p-2">{getChainName(tx.chainId)}</td>
                    <td className="p-2">{new Date(Number(tx.timeStamp) * 1000).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h2 className="text-xl font-semibold mb-2 mt-8">Outgoing Transactions ({outgoing.length})</h2>
          <div className="max-h-140 overflow-auto">
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
                    <td className="p-2">{(parseFloat(tx.value) / 1e18).toFixed(8)} {getCurrency(tx.chainId)}</td>
                    <td className="p-2">{getChainName(tx.chainId)}</td>
                    <td className="p-2">{new Date(Number(tx.timeStamp) * 1000).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}