import { useState, useRef, useContext, useMemo } from 'react';
import { Stage, Layer, Rect, Transformer } from 'react-konva';
import StateContext from '../../context/StateContext';
import useSocket from '../../hooks/socketio/useSocket';
import { ShapeRenderer } from './ShapeRenderer';
import ZoomControls from './ZoomControls';
import { useDrawing } from '../../hooks/canvas/useDrawing';
import { useEraser } from '../../hooks/canvas/useEraser';
import { useSelection } from '../../hooks/canvas/useSelection';
import { useTextEditing } from '../../hooks/canvas/useTextEditing';
import { useCanvasMouseHandlers } from '../../hooks/canvas/useCanvasMouseHandlers';
import { useDrag } from '../../hooks/canvas/useDrag';
import { useTransform } from '../../hooks/canvas/useTransform';
import EraserTailShape from './EraserTailShape';
import { useRemoteDrawingEvents } from '../../hooks/socketio/useRemoteDrawingEvents';
const CELL_WIDTH = 70;
const CELL_HEIGHT = 70;

function Editor({ fileId, userId, fileData }) {
    const [stagePos, setStagePos] = useState({ x: 0, y: 0 });
    const [stageScale, setStageScale] = useState(1);


    const [cursor, setCursor] = useState('cursor-crosshair')
    const stageRef = useRef(null);
    const textareaRef = useRef(null);
    const layerRef = useRef(null);

    const {
        isMouse, setIsMouse, isPen, isPanning,
        lineWidth, strokeWidth, strokeColor,
        textFont, textFontSize,
        color, bgColor,
        line, arrowLine, rectangle, triangle, circle, eraser,
        gridView,
        shapes, setShapes,
        isEditing, setIsEditing, resetAllTools
    } = useContext(StateContext);

    const { emit, on, off } = useSocket();

    // .

    const { drawingHandlers, activeDrawingsRef, setActiveDrawings } = useDrawing({
        isPen, line, rectangle, triangle, circle, arrowLine,
        color, bgColor, strokeColor, lineWidth, strokeWidth,
        shapes, setShapes, fileId, userId, emit
    });
    const { eraserHandlers, eraserTailShape } = useEraser({ setShapes, fileId, emit });
    const { selectionHandlers, selectionRef, transformerRef, handleSelect, selectionRect, selectedShape, selectedShapes } = useSelection({ layerRef })
    const { textHandlers, handleTextChange, handleSaveText } = useTextEditing({
        setShapes, textareaRef, color, textFont, textFontSize,
        userId, fileId, emit, setIsMouse, isEditing, setIsEditing
    });
    const { handleDragStart, handleDragMove, handleDragEnd } = useDrag({ emit, fileId });
    const { handleTransformEnd } = useTransform({ emit, fileId });

    const { handleMouseDown, handleMouseMove, handleMouseUp, handleDblClick } = useCanvasMouseHandlers({
        stageRef,
        eraser, isMouse, isEditing, isPanning, setIsEditing,
        drawingHandlers, eraserHandlers, selectionHandlers, textHandlers,
        setCursor, resetAllTools
    });

    // Infinite canvas

    const gridComponents = useMemo(() => {

        // Calculate buffer based on zoom level
        const bufferMultiplier = Math.min(1.6, 1.2 / stageScale);
        const bufferWidth = window.innerWidth * bufferMultiplier;
        const bufferHeight = window.innerHeight * bufferMultiplier;

        // // Calculate visible area bounds
        const startX = Math.floor((-stagePos.x - bufferWidth) / CELL_WIDTH) * CELL_WIDTH;
        const endX = Math.floor((-stagePos.x + bufferWidth * 2) / CELL_WIDTH) * CELL_WIDTH;
        const startY = Math.floor((-stagePos.y - bufferHeight) / CELL_HEIGHT) * CELL_HEIGHT;
        const endY = Math.floor((-stagePos.y + bufferHeight * 2) / CELL_HEIGHT) * CELL_HEIGHT;

        // Generate only visible grid components
        const components = [];
        for (let x = startX; x < endX; x += CELL_WIDTH) {
            for (let y = startY; y < endY; y += CELL_HEIGHT) {
                components.push(
                    <Rect
                        key={ `${x}-${y}` }
                        x={ x } 
                        y={ y }
                        width={ CELL_WIDTH }
                        height={ CELL_HEIGHT }
                        fill="#121212"
                        stroke="#1E1E1E"
                        strokeWidth={ gridView ? 1 : 0 }
                    />
                );
            }
        }
        return components;
    }, [gridView, stagePos.x, stagePos.y, stageScale])


    // Handle remote incomming events

    useRemoteDrawingEvents({ userId, activeDrawingsRef, setShapes, setActiveDrawings, on, off });



    return (
        <div className={ `${cursor} canvas-container overflow-x-hidden w-screen h-screen relative` }>
            <Stage
                ref={ stageRef }
                width={ window.innerWidth }
                height={ window.innerHeight }
                x={ stagePos.x }
                y={ stagePos.y }
                scaleX={ stageScale }
                scaleY={ stageScale }
                draggable={ isPanning }
                onDragEnd={ (e) => {
                    setStagePos(e.currentTarget.position());
                } }
                onPointerDown={ handleMouseDown }
                onPointerMove={ handleMouseMove }
                onPointerUp={ handleMouseUp }
                onDblClick={ handleDblClick }
                onDblTap={ handleDblClick }
            >
                <Layer
                    name='grid'
                    listening={ false }
                >
                    { gridComponents }
                </Layer>
                <Layer ref={ layerRef }>
                    { shapes.map((shape) => (
                        <ShapeRenderer
                            key={ shape.id }
                            shape={ shape }
                            isMouse={ isMouse }
                            handleSelect={ handleSelect }
                            handleDragStart={ handleDragStart }
                            handleDragMove={ handleDragMove }
                            handleDragEnd={ handleDragEnd }
                            handleTransformEnd={ handleTransformEnd }
                        />
                    )) }
                </Layer>
                <Layer
                    name="transform"
                >
                    {/* Selection Rectangle */ }
                    { selectionRect.visible && (
                        <Rect
                            ref={ selectionRef }
                            x={ Math.min(selectionRect.x1, selectionRect.x2) }
                            y={ Math.min(selectionRect.y1, selectionRect.y2) }
                            width={ Math.abs(selectionRect.x2 - selectionRect.x1) }
                            height={ Math.abs(selectionRect.y2 - selectionRect.y1) }
                            fill="rgba(0, 123, 255, 0.1)"
                            stroke="rgba(0, 123, 255, 0.8)"
                            strokeWidth={ 1 }
                            dash={ [5, 5] }
                            listening={ false }
                        />
                    ) }

                    { (selectedShape || selectedShapes.length > 0) && (
                        <Transformer
                            ref={ transformerRef }
                            boundBoxFunc={ (oldBox, newBox) => {
                                if (newBox.width < 20 || newBox.height < 20) {
                                    return oldBox;
                                }
                                return newBox;
                            } }
                        />
                    ) }
                </Layer>
                <Layer>
                    {eraserTailShape && <EraserTailShape eraserTailShape={ eraserTailShape } />}
                </Layer>
            </Stage>
            <div
                ref={ textareaRef }
                contentEditable="true"
                className='hidden bg-transparent overflow-hidden resize-none absolute border border-none outline-none py-1 px-3 rounded-sm'
                onInput={ handleTextChange }
                onBlur={ handleSaveText }
                style={ {
                    fontFamily: textFont,
                    fontSize: `${textFontSize}px`,
                    color: color,
                    zIndex: 1000,
                    height: 'auto',
                    minHeight: '44px',
                } }
                rows={ 1 }
            ></div>
            <ZoomControls stageRef={ stageRef } stageScale={ stageScale } setStageScale={ setStageScale } setStagePos={ setStagePos } />
        </div>
    );
}

export default Editor;