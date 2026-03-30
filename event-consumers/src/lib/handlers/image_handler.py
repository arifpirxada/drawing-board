from .base_handler import BaseHandler

class ImageHandler(BaseHandler):
    @property
    def event_types(self) -> list[str]:
        return ["add_image", "delete_image"]
    
    def handle_event(self, event_type: str, data: dict, file_data: dict):
        shape_id = data.get("id", "unknown")

        if "images" not in file_data:
            file_data["images"] = []

        match event_type:
            case "add_image":
                file_data["images"].append(data)
            
            case "delete_image":
                file_data["images"] = [img for img in file_data["images"] if img["id"] != shape_id]
            