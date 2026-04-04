import { useState } from "react";
import { getWorldPosition } from "../../utils/getWorldPosition";

export const useCanvasMouseHandlers = ({
  stageRef,
  eraser, isMouse, isEditing, isPanning,
  drawingHandlers, eraserHandlers, selectionHandlers, textHandlers,
}) => {

  const [mode, setMode] = useState(""); // 'eraser' | 'select' | 'draw'

  const handleMouseDown = useCallback((e) => {
    const stage = e.target.getStage();
    const pos = getWorldPosition(stage);

    textHandlers.onMouseDown(pos);

    if (mode === 'eraser') return eraserHandlers.onMouseDown(e);
    if (mode === 'select' && e.target === stageRef.current) return selectionHandlers.onMouseDown(pos);
    if (mode === 'draw') return drawingHandlers.onMouseDown(pos);
  }, [mode, eraserHandlers, selectionHandlers, drawingHandlers, textHandlers]);

  const handleMouseMove = useCallback((e) => {
    const stage = e.target.getStage();
    const pos = getWorldPosition(stage);

    if (mode === 'eraser') return eraserHandlers.onMouseMove(e);
    if (mode === 'select') return selectionHandlers.onMouseMove(pos);
    if (mode === 'draw') return drawingHandlers.onMouseMove(pos);
  }, [mode, eraserHandlers, selectionHandlers, drawingHandlers, textHandlers]);

  const handleMouseUp = useCallback((e) => {
    if (mode === 'eraser') return eraserHandlers.onMouseUp();
    if (mode === 'select') return selectionHandlers.onMouseUp();
    if (mode === 'draw') return drawingHandlers.onMouseUp();
  }, [mode, eraserHandlers, selectionHandlers, drawingHandlers, textHandlers]);


  useEffect(() => {
    if (eraser) {
      setCursor('cursor-none')
      setMode("eraser");
    } else if (isMouse) {
      setCursor('cursor-default');
      setMode("select");
    } else if (isEditing) {
      setCursor('cursor-text');
      setMode("");
    } else if (isPanning) {
      setCursor('cursor-grab');
      setMode("");
    } else {
      setCursor('cursor-crosshair');
      setMode("");
    }
  }, [eraser, isMouse, isEditing, isPanning]);

  return { handleMouseDown, handleMouseMove, handleMouseUp };
};