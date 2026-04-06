import { useState, useMemo, useRef } from "react";
import { throttle } from "../../utils/throttle";

export const useEraser = ({ setShapes, fileId, emit }) => {
    const [isErasing, setIsErasing] = useState(false);
    const [eraserTailShape, setEraserTailShape] = useState(null); // 'eraser' | 'select' | 'draw'
    const deletedShapeIdsRef = useRef(new Set());

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

    const deleteMarkedShapes = () => {
        const ids = Array.from(deletedShapeIdsRef.current);
        setShapes(prev => prev.filter((shape) => !deletedShapeIdsRef.current.has(shape.id)));

        emit('delete_shapes', { room: fileId, ids });
        deletedShapeIdsRef.current.clear();
    };

    const markShapeAsDeleted = (e) => {
        const shape = e.target;
        if (!shape) return;

        const stage = shape.getStage();
        const pointerPosition = stage.getPointerPosition();
        handleEraserTail(pointerPosition);

        if (!shape.attrs?.id) return;

        const shapeId = shape.attrs.id;

        shape.opacity(0.1);

        shape.getLayer().batchDraw();
        deletedShapeIdsRef.current.add(shapeId);
    };

    const throttledDelete = useMemo(() => throttle(markShapeAsDeleted, 16), [markShapeAsDeleted]);

    const eraserHandlers = {
        onMouseDown: (e) => {
            setIsErasing(true);
            markShapeAsDeleted(e);
        },
        onMouseMove: (e) => {
            if (isErasing) throttledDelete(e);
        },
        onMouseUp: () => {
            deleteMarkedShapes();
            setIsErasing(false);
            setEraserTailShape(null);
        }
    }

    return { eraserHandlers, eraserTailShape }
}