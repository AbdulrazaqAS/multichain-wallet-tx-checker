const express = require("express");
const cors = require("cors");
require("dotenv").config({ path: ".env.local" });

const app = express();
const PORT = 5000;

app.use(cors());

app.post("/api/fetchTransactions", async (req, res) => {
    const { address, chains, start_block=0, end_block="latest" } = req.query;
    const chainsId = chains.split(',')

    const apiKey = process.env.ETHERSCAN_API_KEY;
    const baseUrl = "https://api.etherscan.io/v2/api";

    const results = [];
    for (const chain of chainsId) {
        const url = `${baseUrl}?` +
            `chainid=${chain}` +
            `&module=account` +
            `&action=txlist` +
            `&address=${address}` +
            `&startblock=${start_block}` +
            `&endblock=${end_block}` +
            `&sort=desc` +
            `&apikey=${apiKey}`;

        try {
          const res = await fetch(url);
          const data = await res.json();
          
          if (data.status !== "1" && data.result?.length != 0) throw new Error(data.result);  // Not an error due to empty txs
    
          results.push(data.result);
        } catch (error) {
          console.error(`Error on chain ${chain}:`, error.message);
          results.push([{error: error.message}]);
        }
    }
    
    res.status(200).json(results);
});

app.post("/api/fetchBalances", async (req, res) => {
  const { address, chains } = req.query;
  const chainsId = chains.split(',')

  const apiKey = process.env.ETHERSCAN_API_KEY;
  const baseUrl = "https://api.etherscan.io/v2/api";

  const results = [];
  for (const chain of chainsId) {
      const url = `${baseUrl}?` +
          `chainid=${chain}` +
          `&module=account` +
          `&action=balance` +
          `&address=${address}` +
          `&tag=latest` +
          `&apikey=${apiKey}`;

      try {
        const res = await fetch(url);
        const data = await res.json();
  
        if (data.status !== "1") throw new Error(data.result);
  
        results.push(data.result);
      } catch (error) {
        console.error(`Error on chain ${chain}:`, error.message);
        results.push("-1");
      }
  }
  
  res.status(200).json(results);
});
  
app.listen(PORT, () => {
  console.log(`Local server running on http://localhost:${PORT}`);
});
