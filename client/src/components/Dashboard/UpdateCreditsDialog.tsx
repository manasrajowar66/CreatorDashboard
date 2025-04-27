import { useState } from "react";

interface UpdateCreditsDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (credits: number) => void;
  userEmail: string;
  currentCredits: number;
}

function UpdateCreditsDialog({
  open,
  onClose,
  onSave,
  userEmail,
  currentCredits,
}: UpdateCreditsDialogProps) {
  const [credits, setCredits] = useState<number>(currentCredits);

  const handleSave = () => {
    onSave(credits);
  };

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
      onClick={handleOverlayClick}
    >
      <div className="bg-white rounded-xl !shadow-lg p-8 w-full max-w-md opacity-100">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Update Credits
        </h2>
        <p className="text-gray-600 text-sm mb-4">
          Updating credits for: <span className="font-medium">{userEmail}</span>
        </p>

        <input
          type="number"
          value={credits}
          onChange={(e) => setCredits(Number(e.target.value))}
          className="w-full p-3 border border-gray-300 rounded-lg mb-6 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="Enter credits"
        />

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-gray-300 text-gray-800 hover:bg-gray-400 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition disabled:bg-gray-300 disabled:!cursor-not-allowed"
            disabled={credits < 0}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

export default UpdateCreditsDialog;
