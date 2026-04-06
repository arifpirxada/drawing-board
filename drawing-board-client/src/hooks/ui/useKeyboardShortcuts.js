import { useEffect } from "react";

export function useKeyboardShortcuts({
    resetAllTools,
    setIsMouse, setIsPen, setEraser, setArrowLine, setLine, setRectangle, setTriangle, setCircle, isEditing
}) {
    useEffect(() => {
        const KEY_HANDLERS = {
            s: () => setIsMouse(true),
            d: () => setIsPen(true),
            e: () => setEraser(true),
            a: () => setArrowLine(true),
            w: () => setLine(true),
            r: () => setRectangle(true),
            t: () => setTriangle(true),
            c: () => setCircle(true)
        };

        const handleKeyDown = (e) => {
            const keyHandler = KEY_HANDLERS[e.key];
            if (!keyHandler || isEditing) return;
            resetAllTools();
            keyHandler();
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);

    }, [resetAllTools, setIsMouse]);
}