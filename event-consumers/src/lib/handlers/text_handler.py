from .base_handler import BaseHandler

class TextHandler(BaseHandler):
    @property
    def event_types(self) -> list[str]:
        return ["add_text", "delete_text"]
    
    def handle_event(self, event_type: str, data: dict, file_data: dict):
        shape_id = data.get("id", "unknown")

        if "texts" not in file_data:
            file_data["texts"] = []
        
        match event_type:
            case "add_text":
                file_data["texts"].append(data)

            case "delete_text":
                file_data["texts"] = [t for t in file_data["texts"] if t["id"] != shape_id]
