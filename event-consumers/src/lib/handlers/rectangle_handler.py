import logging
from .base_handler import BaseHandler

logger = logging.getLogger("event-consumers")


class RectangleHandler(BaseHandler):
    @property
    def event_types(self) -> list[str]:
        return ["draw_rectangle", "update_rectangle", "delete_rectangle"]

    def handle_event(self, event_type: str, data: dict, file_data: dict):
        shape_id = data.get("id", "unknown")

        match event_type:
            case "draw_rectangle":
                if "rectangles" not in file_data:
                    file_data["rectangles"] = []
                file_data["rectangles"].append(data)

            case "update_rectangle":
                if "rectangles" not in file_data:
                    logger.warning(f"update_rectangle: No rectangles for {shape_id}")
                    return
                for rectangle in file_data["rectangles"]:
                    if rectangle["id"] == shape_id:
                        points = data.get("points", {})
                        x = points.get("x")
                        y = points.get("y")
                        if x is not None and y is not None:
                            rectangle["width"] = x - rectangle["x"]
                            rectangle["height"] = y - rectangle["y"]
                        return
                logger.warning(f"update_rectangle: Rectangle {shape_id} not found")

            case "delete_rectangle":
                if "rectangles" not in file_data:
                    return
                file_data["rectangles"] = [r for r in file_data["rectangles"] if r["id"] != shape_id]
