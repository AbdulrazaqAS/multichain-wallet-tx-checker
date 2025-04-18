export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'POST not allowed' });
  }

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
}
  