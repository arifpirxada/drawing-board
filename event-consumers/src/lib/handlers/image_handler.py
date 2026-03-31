from .base_handler import BaseHandler
import requests
import os
import threading

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
                SERVER_URL = os.getenv("SERVER_URL")
                INTERNAL_SECRET = os.getenv("INTERNAL_SECRET")
                image_name = None

                for img in file_data["images"]:
                    if img["id"] == shape_id:
                        image_name = img["name"]

                if image_name is None:
                    print("no image name")

                if SERVER_URL is not None and INTERNAL_SECRET is not None and image_name:
                    url = SERVER_URL + "/api/internal/image/" + image_name
                    headers = {
                        "x-internal-secret": INTERNAL_SECRET
                    }
                    threading.Thread(target=requests.delete, args=(url,), kwargs={"headers": headers}, daemon=True).start() # Fire and forgot

                file_data["images"] = [img for img in file_data["images"] if img["id"] != shape_id]
            