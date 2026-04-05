import { useEffect, useState } from "react"
import { generateShapeId } from "../../utils/generateShapeId";

export const useTextEditing = ({ setShapes, textareaRef, color, textFont, textFontSize, userId, fileId, emit, setIsMouse, isEditing, setIsEditing }) => {
    const [editingText, setEditingText] = useState("");

    const handleSaveText = () => {
        if (editingText !== '') {
            const id = generateShapeId(userId);
            const rect = textareaRef.current.getBoundingClientRect();
            setShapes(prev => [...prev, { type: "text", id, userId, text: editingText, color, font: textFont, fontSize: textFontSize, left: rect.left, top: rect.top }]);

            emit('draw_shape', { room: fileId, id, userId, type: "text", text: editingText, color, font: textFont, fontSize: textFontSize, left: rect.left, top: rect.top })
        }
        textareaRef.current.classList.add("hidden")
        textareaRef.current.innerText = "";
        setEditingText('');
        setIsMouse(true);
    }

    const handleMouseDown = (e, forceEdit = false) => {
        if (isEditing || forceEdit) {
            const pos = e.target.getStage().getPointerPosition();
            textareaRef.current.style.left = `${pos.x}px`
            textareaRef.current.style.top = `${pos.y}px`
            textareaRef.current.classList.remove('hidden')
            setTimeout(() => {
                textareaRef.current.focus()
            }, 10)
            setIsEditing(false)
        } else if (editingText !== '') {
            handleSaveText();
        }
    }


    const handleTextChange = (e) => {
        setEditingText(e.target.innerText)
    }

    const textHandlers = {
        onMouseDown: (e, forceEdit = false) => handleMouseDown(e, forceEdit)
    }

    return {
        textHandlers, editingText,
        handleTextChange, handleSaveText
    }
}