export const useTransform = ({ emit, fileId }) => {
    const handleTransformEnd = (e, shapeId, shapeType) => {
        const node = e.target;

        const x = node.x();
        const y = node.y();
        const scaleX = node.scaleX();
        const scaleY = node.scaleY();
        const rotation = node.rotation();

        emit('transform_shape', { room: fileId, id: shapeId, shapeType, scaleX, scaleY, rotation, x, y })
    }

    return { handleTransformEnd };
}