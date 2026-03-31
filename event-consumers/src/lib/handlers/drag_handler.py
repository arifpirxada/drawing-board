from .base_handler import BaseHandler

SHAPE_TYPE_TO_KEY = {
    "image": "images",
    "text": "texts",
    "circle": "circles",
    "triangle": "triangles",
    "rectangle": "rectangles",
    "arrowline": "arrowLines",
    "line": "lines",
}

class DragHandler:
    @property
    def event_types(self) -> list[str]:
        return ["drag_shape_end"]
    
    def handle_event(self, event_type: str, data: dict, file_data: dict):
        shape_id = data.get("id", "unknown")

        shape_type: str | None = data.get("shapeType")

        if shape_type is None:
            return
        
        collection_key = SHAPE_TYPE_TO_KEY.get(shape_type)
        if not collection_key or collection_key not in file_data:
            return
        
        for item in file_data[collection_key]:
            if item["id"] == shape_id:
                item["x"] = data["x"]
                item["y"] = data["y"]
                break
