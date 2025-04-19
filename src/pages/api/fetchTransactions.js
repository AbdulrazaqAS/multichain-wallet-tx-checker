function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'POST not allowed' });
    }

    const { address, chains, startBlocks="", endBlocks="" } = req.query;
    const chainsId = chains.split(',')
    const startBlocksInt = startBlocks.split(',')
    const endBlocksInt = endBlocks.split(',')

    const apiKey = process.env.ETHERSCAN_API_KEY;
    const baseUrl = "https://api.etherscan.io/v2/api";

    const results = [];
    for (const i in chainsId) {
      const chain = chainsId[i];
      const url = `${baseUrl}?` +
          `chainid=${chain}` +
          `&module=account` +
          `&action=txlist` +
          `&address=${address}` +
          `&startblock=${startBlocksInt[i] || 0}` +
          `&endblock=${endBlocksInt[i] || "latest"}` +
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
      // Delay after every 5 requests (max api calls/sec in etherscan for free tier)
      if ((i + 1) % 5 === 0) {
        await wait(2000);
      }
    }
    
    res.status(200).json(results);
}
  