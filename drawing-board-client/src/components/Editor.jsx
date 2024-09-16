import React, { useState, useRef, useContext, useEffect } from 'react';
import { Stage, Layer, Line, Rect, Transformer } from 'react-konva';
import StateContext from '../context/StateContext';

function Editor() {
    const [lines, setLines] = useState([]);
    const [rectangles, setRectangles] = useState([]);
    const stageRef = useRef(null);

    const {
        color,
        lineWidth,
        setMouse,
        line, setLine,
        isDrawing,
        setIsDrawing,
        isPen, isMarker, isPencil,
        rectangle, setRectangle
    } = useContext(StateContext);

    const handleMouseDown = (e) => {
        setIsDrawing(true);
        const pos = e.target.getStage().getPointerPosition();
        if (line || isPen || isMarker || isPencil) {
            setLines([...lines, { points: [pos.x, pos.y], color, lineWidth }]);
        } else if (rectangle) {
            setRectangles([...rectangles, {x: pos.x, y: pos.y, width: 0, height: 0, color}]);
        }

        // Deselect shape
        if (e.target === stageRef.current) {
            setSelectedShape(null);
        }
    };

    const handleMouseMove = (e) => {
        const stage = e.target.getStage();
        const point = stage.getPointerPosition();
        setMouse({ x: point.x, y: point.y })

        if (isDrawing) {
            if (isPen || isMarker || isPencil) {
                const lastLine = lines[lines.length - 1];
                lastLine.points = lastLine.points.concat([point.x, point.y]);
                
                lines.splice(lines.length - 1, 1, lastLine);
                setLines([...lines]);
            } else if (line) {
                const lastLine = lines[lines.length - 1];
                const updatedPoints = [lastLine.points[0], lastLine.points[1], point.x, point.y];
        
                const updatedLine = {
                    ...lastLine,
                    points: updatedPoints
                };
        
                const newLines = [...lines];
                newLines[newLines.length - 1] = updatedLine;
        
                setLines(newLines);
            } else if (rectangle) {
                const startX = rectangles[rectangles.length - 1].x;
                const startY = rectangles[rectangles.length - 1].y;

                const width = point.x - startX;
                const height = point.y - startY;

                const lastRect = rectangles[rectangles.length - 1];
                const updatedRect = {
                    ...lastRect,
                    width,
                    height
                };
        
                const newRects = [...rectangles];
                newRects[newRects.length - 1] = updatedRect;
        
                setRectangles(newRects);
            }

        }
    };
    
    const handleMouseUp = () => {
        setLine(false);
        setIsDrawing(false)
    };

    const layerRef = useRef(null);

    const clearPartOfCanvas = (x, y, width, height) => {
        const layer = layerRef.current;
        const ctx = layer.getContext();
        ctx.globalCompositeOperation = 'destination-out';
        ctx.fillStyle = '#000000';
        ctx.fillRect(x, y, width, height);
        ctx.globalCompositeOperation = 'source-over';
        layer.batchDraw();
    };
    useEffect(() => {
        const timer = setTimeout(() => {
            clearPartOfCanvas(330, 450, 200, 200);
            
        }, 4000);
        return () => clearTimeout(timer);
    }, [])

    
      const [selectedShape, setSelectedShape] = useState(null);
      const transformerRef = useRef(null);

      const handleSelect = (e) => {
        const shape = e.target;
        setSelectedShape(shape);
      };

      const handleDragStart = (e) => {
        e.target.moveToTop();
      };

      useEffect(() => {
        if (selectedShape && transformerRef.current) {
          transformerRef.current.nodes([selectedShape]);
          transformerRef.current.getLayer().batchDraw();
        }
      }, [selectedShape]);

    return (
        <div className="canvas-container overflow-x-hidden w-screen h-screen relative">

            <Stage
                width={ window.innerWidth }
                height={ window.innerHeight }
                onMouseDown={ handleMouseDown }
                onMouseMove={ handleMouseMove }
                onMouseUp={ handleMouseUp }
                ref={stageRef}
            >
                <Layer ref={ layerRef }>
                    <Rect
                        x={200}
                        y={150}
                        width={100}
                        height={100}
                        fill="green"
                        draggable
                        onClick={handleSelect}
                        onTap={handleSelect}
                        onDragStart={handleDragStart}
                    />
                    <Rect
                        x={500}
                        y={150}
                        width={400}
                        height={100}
                        fill="red"
                        draggable
                        onClick={handleSelect}
                        onTap={handleSelect}
                        onDragStart={handleDragStart}
                    />
                    <Rect
                        x={200}
                        y={300}
                        width={100}
                        height={100}
                        fill="yellow"
                        draggable
                        onClick={handleSelect}
                        onTap={handleSelect}
                        onDragStart={handleDragStart}
                    />
                    { lines.map((line, i) => (
                        <Line
                            key={ i }
                            points={ line.points }
                            stroke={ line.color }
                            strokeWidth={ line.lineWidth }
                            tension={ 0.2 }
                            lineCap="round"
                            globalCompositeOperation="source-over"
                            draggable
                            onClick={handleSelect}
                            onTap={handleSelect}
                            onDragStart={handleDragStart}
                        />
                    )) }
                    { rectangles.map((rect, i) => (
                        <Rect
                            key={i}
                            x={rect.x}
                            y={rect.y}
                            width={rect.width}
                            height={rect.height}
                            fill={rect.color}
                            // stroke="black"
                            strokeWidth={2}
                            draggable
                            onClick={handleSelect}
                            onTap={handleSelect}
                            onDragStart={handleDragStart}
                        />
                    )) }
                    
                    {selectedShape && (
                        <Transformer
                        ref={transformerRef}
                        boundBoxFunc={(oldBox, newBox) => {
                            if (newBox.width < 20 || newBox.height < 20) {
                            return oldBox;
                            }
                            return newBox;
                        }}
                        />
                    )}
                </Layer>
            </Stage>
        </div>
    );
}

export default Editor;