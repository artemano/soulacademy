"use client";

import ReactConfetti from "react-confetti";

import { useConfettiStore } from "@/hooks/use-confetti-store";

export const ConfettiProvider = () => {
    const confettiStore = useConfettiStore();
    if (!confettiStore.isOpen) return null;

    return (
        <ReactConfetti className="pointer-events-none z-[100]"
            numberOfPieces={500}
            recycle={false}
            onConfettiComplete={() => { confettiStore.onClose(); }} />
    )
}