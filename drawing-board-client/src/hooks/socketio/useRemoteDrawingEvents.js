import { useEffect } from 'react';

const getUpdatedLine = (line, data) => ({
    ...line,
    points: line.points.concat([data.points.x, data.points.y])
});

const getUpdatedStraightLine = (line, data) => ({
    ...line,
    points: [line.points[0], line.points[1], data.points.x, data.points.y]
});

const getUpdatedRectangle = (rect, data) => ({
    ...rect,
    width: data.points.x - rect.x,
    height: data.points.y - rect.y
});

const getUpdatedTriangle = (triangle, data) => {
    const [startX, startY] = triangle.points;
    const dx = data.points.x - startX;
    const dy = data.points.y - startY;
    const pts = [...triangle.points];
    pts[3] = pts[1] + dy;
    pts[4] = pts[0] + dx;
    pts[5] = pts[1] + dy;
    return { ...triangle, points: pts };
};

const getUpdatedCircle = (circle, data) => {
    const dx = data.points.x - circle.x;
    const dy = data.points.y - circle.y;
    return { ...circle, radius: Math.sqrt(dx * dx + dy * dy) };
};

const getUpdatedArrowLine = (arrowLine, data) => ({
    ...arrowLine,
    points: [arrowLine.points[0], arrowLine.points[1], data.points.x, data.points.y]
});

const SHAPE_UPDATERS = {
    line: getUpdatedLine,
    straight_line: getUpdatedStraightLine,
    rectangle: getUpdatedRectangle,
    triangle: getUpdatedTriangle,
    circle: getUpdatedCircle,
    arrow_line: getUpdatedArrowLine,
};

const loadRemoteImage = (data, setShapes) => {
    const baseURL = import.meta.env.VITE_SERVER_URL;
    if (!baseURL) return;

    const url = `${baseURL}/uploads/${data.name}`;
    const image = new Image();
    image.onload = () =>
        setShapes(prev => [...prev, { type: 'image', id: data.id, userId: data.userId, image, src: url }]);
    image.src = url;
};

export const useRemoteDrawingEvents = ({ userId, activeDrawingsRef, setShapes, setActiveDrawings, on, off }) => {
    useEffect(() => {
        const isRemote = (data) => data.userId !== userId;
        const getTargetId = (data) => activeDrawingsRef.current.get(data.userId);

        const handleDraw = (data) => {
            if (!isRemote(data)) return;
            setActiveDrawings(prev => new Map(prev).set(data.userId, data.id));

            if (data.type === 'image') {
                loadRemoteImage(data, setShapes);
            } else {
                setShapes(prev => [...prev, data]);
            }
        };

        const handleUpdate = (data) => {
            if (!isRemote(data)) return;
            if (getTargetId(data) !== data.id) return;

            setShapes(prev => prev.map(shape => {
                if (shape.id !== data.id) return shape;
                const updater = SHAPE_UPDATERS[shape.type];
                if (!updater) return shape;
                return updater(shape, data);
            }));
        };

        const handleDelete = (data) => {
            if (!isRemote(data)) return;
            setShapes(prev => prev.filter(item => !data.ids.includes(item.id)));
        };

        const drawingComplete = (data) => {
            if (!isRemote(data)) return;
            setActiveDrawings(prev => {
                const updated = new Map(prev);
                updated.delete(data.userId);
                return updated;
            });
        };

        const transformShape = (data) =>
            setShapes(prev =>
                prev.map(shape =>
                    shape.id === data.id
                        ? { ...shape, scaleX: data.scaleX, scaleY: data.scaleY, rotation: data.rotation, x: data.x, y: data.y }
                        : shape
                )
            );

        const dragShape = (data) =>
            setShapes(prev =>
                prev.map(shape => shape.id === data.id ? { ...shape, x: data.x, y: data.y } : shape)
            );

        on('draw_shape', handleDraw);
        on('update_shape', handleUpdate);
        on('delete_shapes', handleDelete);

        on('drawing_complete', drawingComplete);
        on('transform_shape', transformShape);
        on('drag_shape', dragShape);

        return () => {
            off('draw_shape', handleDraw);
            off('update_shape', handleUpdate);
            off('delete_shape', handleDelete);

            off('drawing_complete', drawingComplete);
            off('transform_shape', transformShape);
            off('drag_shape', dragShape);
        };
    }, [on, off]);
};