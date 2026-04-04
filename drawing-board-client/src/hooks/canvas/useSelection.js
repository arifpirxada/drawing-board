import { useState } from "react"

export const useSelection = ({ layerRef }) => {
    const [isSelecting, setIsSelecting] = useState(false);
    const [selectedShape, setSelectedShape] = useState(null);
    const [selectedShapes, setSelectedShapes] = useState([]);
    const [selectionRect, setSelectionRect] = useState({
        visible: false,
        x1: 0,
        y1: 0,
        x2: 0,
        y2: 0
    });
    const transformerRef = useRef(null);
    const selectionRef = useRef(null);

    const handleMouseDown = (pos) => {
        setSelectedShape(null);
        setSelectedShapes([]);

        setIsSelecting(true);
        setSelectionRect({
            visible: true,
            x1: pos.x,
            y1: pos.y,
            x2: pos.x,
            y2: pos.y
        })
    }

    const handleMouseUp = () => {
        if (!isSelecting) return;

        setIsSelecting(false);

        const selBox = {
            x: Math.min(selectionRect.x1, selectionRect.x2),
            y: Math.min(selectionRect.y1, selectionRect.y2),
            width: Math.abs(selectionRect.x2 - selectionRect.x1),
            height: Math.abs(selectionRect.y2 - selectionRect.y1)
        }

        // Only select if the selection box has some size
        if (selBox.width > 5 && selBox.height > 5) {
            // Find intersecting shapes
            const selectedElements = [];
            // const layer = stageRef.current.getLayers()[0];

            layerRef.current.children.forEach((shape) => {
                const shapeBox = shape.getClientRect();
                if (shape._id === selectionRef.current._id) {
                    return;
                }
                if (Konva.Util.haveIntersection(selBox, shapeBox)) {
                    selectedElements.push(shape);
                }
            });

            setSelectedShapes(selectedElements);
        }

        // Hide selection rectangle    
        setTimeout(() => {
            setSelectionRect(prev => ({ ...prev, visible: false }));
        }, 10);
    }

    const handleSelect = (e) => {
        // if we are selecting with rect, do nothing
        const { x1, x2, y1, y2 } = selectionRect;
        const moved = x1 !== x2 || y1 !== y2;
        if (moved) {
            return;
        }

        const shape = e.target;
        setSelectedShape(shape);
        setSelectedShapes([]);
    };

    useEffect(() => {
        if (transformerRef.current) {
            if (selectedShapes.length > 0) {
                transformerRef.current.nodes(selectedShapes);
            } else if (selectedShape) {
                transformerRef.current.nodes([selectedShape]);
            } else {
                transformerRef.current.nodes([]);
            }
            transformerRef.current.getLayer().batchDraw();
        }
    }, [selectedShape, selectedShapes]);

    const selectionHandlers = {
        onMouseDown: (pos) => handleMouseDown(pos),
        onMouseMove: (pos) => {
            if (!isSelecting) return;
            setSelectionRect(prev => ({ ...prev, x2: pos.x, y2: pos.y }));
        },
        onMouseUp: handleMouseUp
    }

    return {
        selectionHandlers,
        selectionRef, transformerRef,
        handleSelect
    }
}