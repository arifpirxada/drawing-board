export const useDrag = () => {
    const handleDragStart = (e) => {
        e.target.moveToTop();
    };

    const handleDragMove = (e, shapeId, shapeType) => {
        const node = e.target;

        const x = node.x();
        const y = node.y();

        emit('drag_shape', { room: fileId, id: shapeId, shapeType, x, y })
    }

    const handleDragEnd = (e, shapeId, shapeType) => {
        const node = e.target;

        const x = node.x();
        const y = node.y();

        emit('drag_shape_end', { room: fileId, id: shapeId, shapeType, x, y })
    }

    return {
        handleDragStart,
        handleDragMove,
        handleDragEnd
    }
}