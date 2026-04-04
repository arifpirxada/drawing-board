import { useState } from "react";

export const useEraser = ({ setShapes, fileId }) => {
    const [isErasing, setIsErasing] = useState(false);

    const deleteAtPoint = (e) => {
        const target = e.target;
        if (!target) return;
        const stage = target.getStage();

        const pointerPosition = stage.getPointerPosition();

        // const shapes = stage.getAllIntersections(pointerPosition);
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
        onMouseUp: () => { setIsErasing(false); }
    }

    return { eraserHandlers }
}