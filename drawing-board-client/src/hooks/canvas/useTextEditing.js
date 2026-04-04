import { useState } from "react"
import { generateShapeId } from "../../utils/generateShapeId";

export const useTextEditing = ({ setShapes, textareaRef }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editingText, setEditingText] = useState("");

    const handleSaveText = () => {
        if (editingText !== '') {
            const id = generateShapeId();
            const rect = textareaRef.current.getBoundingClientRect();
            setShapes([...shapes, { id, userId, text: editingText, color, font: textFont, fontSize: textFontSize, left: rect.left, top: rect.top }]);

            emit('draw_shape', { room: fileId, id, userId, text: editingText, color, font: textFont, fontSize: textFontSize, left: rect.left, top: rect.top })
        }
        textareaRef.current.classList.add("hidden")
        setEditingText('');
        setIsMouse(true);
        autoResizeTextarea();
    }
    
    const handleMouseDown = (pos) => {
        if (isEditing) {
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

    const autoResizeTextarea = () => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
        }
    };

    const handleTextChange = (e) => {
        setEditingText(e.target.value)
        autoResizeTextarea();
    }

    const textHandlers = {
        onMouseDown: (pos) => handleMouseDown(pos)
    }

    return {
        textHandlers,
        handleTextChange
    }
}