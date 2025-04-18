export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'POST not allowed' });
    }

    const { address, chains, start_block=0, end_block=99999999 } = req.query;
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
          `&sort=asc` +
          `&apikey=${apiKey}`;

      try {
        const res = await fetch(url);
        const data = await res.json();
  
        if (data.status !== "1") throw new Error(data.result);
  
        results.push(data.result);
      } catch (error) {
        console.error(`Error on chain ${chain}:`, error.message);
        results.push([{error: error.message}]);
      }
    }
    
    res.status(200).json(results);
}
  