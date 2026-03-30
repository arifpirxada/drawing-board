import logging
import math
from .base_handler import BaseHandler

logger = logging.getLogger("event-consumers")


class CircleHandler(BaseHandler):
    @property
    def event_types(self) -> list[str]:
        return ["draw_circle", "update_circle", "delete_circle"]

    def handle_event(self, event_type: str, data: dict, file_data: dict):
        shape_id = data.get("id", "unknown")

        match event_type:
            case "draw_circle":
                if "circles" not in file_data:
                    file_data["circles"] = []
                file_data["circles"].append(data)

            case "update_circle":
                if "circles" not in file_data:
                    logger.warning(f"update_circle: No circles for {shape_id}")
                    return
                for circle in file_data["circles"]:
                    if circle["id"] == shape_id:
                        points = data.get("points", {})
                        x = points.get("x")
                        y = points.get("y")
                        if x is not None and y is not None:
                            dx = x - circle["x"]
                            dy = y - circle["y"]
                            circle["radius"] = math.sqrt(dx * dx + dy * dy)
                        return
                logger.warning(f"update_circle: Circle {shape_id} not found")

            case "delete_circle":
                if "circles" not in file_data:
                    return
                file_data["circles"] = [c for c in file_data["circles"] if c["id"] != shape_id]
