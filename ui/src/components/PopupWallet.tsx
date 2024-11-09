// import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";

function PopupWallet({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-center mb-4 text-xl font-semibold">
          Connect Your Wallet
        </h2>
        {/* <WalletMultiButton /> */}
        <button
          onClick={onClose}
          className="mt-4 bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
        >
          Close
        </button>
      </div>
    </div>
  );
}

export default PopupWallet;
