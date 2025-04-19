const GITHUB_REPO_URL = "https://github.com/AbdulrazaqAS/multichain-wallet-tx-checker.git";
const DEVTO_URL = "https://dev.to/abdulrazaqas";

export default function Footer(){
    return (
        <footer className="h-max bg-gray-500 rounded-md py-3 text-white">
            <ul className="flex flex-col flex-wrap gap-y-4 items-center">
                <li className="text-4xl text-center">Multi-chain Wallet Tx Checker</li>
                <li><a href={GITHUB_REPO_URL} target='_blank' rel="noreferrer noopener" className="underline">Github</a></li>
                <li><a href={DEVTO_URL} target='_blank' rel="noreferrer noopener" className="underline">Dev.To</a></li>
            </ul>
        </footer>
    )
}