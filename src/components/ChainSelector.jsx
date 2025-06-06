import { CHAINS } from "@/utils/chainMap";

export default function ChainSelector({ selectedChains, onSelectedChainsChange }) {
  return (
    <div>
      <div className="flex flex-wrap gap-4">
        {CHAINS.map(({ id, name }) => (
          <label key={id} className="inline-flex items-center">
            <input
              type="checkbox"
              value={id}
              checked={selectedChains.includes(id)}
              onChange={(e) => {
                const checked = e.target.checked;
                const value = parseInt(e.target.value);
                onSelectedChainsChange(checked ? [...selectedChains, value] : selectedChains.filter(c => c !== value));
              }}
              className="mr-2"
            />
            {name}
          </label>
        ))}
      </div>
      {selectedChains.length > 5 && <p className="text-orange-500">If fetching txs, please select fewer chains to avoid reaching max API capacity.</p>}
    </div>
  );
}
