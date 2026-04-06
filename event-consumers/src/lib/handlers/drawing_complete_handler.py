from .base_handler import BaseHandler

class DrawingCompleteHandler(BaseHandler):
    def handle_event(self, data: dict, file_data: dict):
        shape = data.get("shape")
        if shape is None:
            return
        
        file_data["shapes"].append(shape)