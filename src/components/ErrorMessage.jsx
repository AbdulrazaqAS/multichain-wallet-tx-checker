export default function ErrorMessage({message, onDismiss}) {
    return (
        <div className="bg-red-600 flex justify-between px-1 py-1 w-full text-lg">
            <p className="text-white">{message}</p>
            <button onClick={onDismiss} className="bg-white rounded-full px-2 max-h-max text-red-600 hover:bg-red-200">
                X
            </button>
        </div>
    )
}