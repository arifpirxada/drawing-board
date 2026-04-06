from .base_handler import BaseHandler
import requests
import os
import threading

class DeleteShapesHandler(BaseHandler):
    def handle_event(self, data: dict, file_data: dict):
        shape_ids = data.get("ids")
        if shape_ids is None:
            return

        # If Image delete image in uploads
        for shape in file_data["shapes"]:
            if shape["id"] in shape_ids and shape["type"] == "image":
                image_name = shape.get("name")
                if image_name is None:
                    return
                self.delete_image(image_name)


        file_data["shapes"] = [
            s for s in file_data["shapes"] if s.get("id") not in shape_ids
        ]

    
    def delete_image(self, image_name: str):
        SERVER_URL = os.getenv("SERVER_URL")
        INTERNAL_SECRET = os.getenv("INTERNAL_SECRET")

        if image_name is None:
            print("Error Deleting Image: No image name provided")
            return

        if SERVER_URL is None or INTERNAL_SECRET is None:
            print("Error Deleting Image: SERVER_URL or INTERNAL_SECRET missing")
            return
        
        url = SERVER_URL + "/api/internal/image/" + image_name
        headers = {
            "x-internal-secret": INTERNAL_SECRET
        }
        threading.Thread(target=requests.delete, args=(url,), kwargs={"headers": headers}, daemon=True).start() # Fire and forgot
