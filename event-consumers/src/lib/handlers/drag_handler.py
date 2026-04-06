from .base_handler import BaseHandler

class DragHandler(BaseHandler):
    def handle_event(self, data: dict, file_data: dict):
        shape_id = data.get("id")

        if shape_id is None:
            return
        
        for shape in file_data["shapes"]:
            if shape["id"] == shape_id:
                shape["x"] = data["x"]
                shape["y"] = data["y"]
                break
