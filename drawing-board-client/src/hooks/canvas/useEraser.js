import { useState, useMemo } from "react";
import { throttle } from "../../utils/throttle";

export const useEraser = ({ setShapes, fileId, emit }) => {
    const [isErasing, setIsErasing] = useState(false);
    const [eraserTailShape, setEraserTailShape] = useState(null); // 'eraser' | 'select' | 'draw'

    const handleEraserTail = (pos) => {
        if (eraserTailShape == null) {
            const tail = {
                points: [pos.x, pos.y]
            };
            setEraserTailShape(tail);
        } else {
            setEraserTailShape(prev => {
                const newPoints = prev.points.concat(pos.x, pos.y);

                return {
                    ...prev,
                    points: newPoints.slice(-40),
                };
            });
        }
    }

    const deleteAtPoint = (e) => {
        const target = e.target;
        if (!target) return;
        const stage = target.getStage();

        const pointerPosition = stage.getPointerPosition();

        handleEraserTail(pointerPosition);

        const shape = stage.getIntersection(pointerPosition);
        if (!shape) return;

        const shapeId = shape.attrs.id;

        setShapes((prev) => prev.filter(shape => shape.id !== shapeId));
        emit('delete_shape', { room: fileId, id: shapeId });
    };

    const throttledDelete = useMemo(() => throttle(deleteAtPoint, 16), [deleteAtPoint]);

    const eraserHandlers = {
        onMouseDown: (e) => {
            setIsErasing(true);
            deleteAtPoint(e);
        },
        onMouseMove: (e) => {
            if (isErasing) throttledDelete(e);
        },
        onMouseUp: () => { setIsErasing(false); setEraserTailShape(null); }
    }

    return { eraserHandlers, eraserTailShape }
}