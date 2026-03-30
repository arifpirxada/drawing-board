import logging
from .base_handler import BaseHandler

logger = logging.getLogger("event-consumers")


class TriangleHandler(BaseHandler):
    @property
    def event_types(self) -> list[str]:
        return ["draw_triangle", "update_triangle", "delete_triangle"]

    def handle_event(self, event_type: str, data: dict, file_data: dict):
        shape_id = data.get("id", "unknown")

        match event_type:
            case "draw_triangle":
                if "triangles" not in file_data:
                    file_data["triangles"] = []
                file_data["triangles"].append(data)

            case "update_triangle":
                if "triangles" not in file_data:
                    logger.warning(f"update_triangle: No triangles for {shape_id}")
                    return
                for triangle in file_data["triangles"]:
                    if triangle["id"] == shape_id:
                        points = data.get("points", {})
                        x = points.get("x")
                        y = points.get("y")
                        if x is not None and y is not None:
                            startX = triangle["points"][0]
                            startY = triangle["points"][1]
                            triangle["points"][3] = startY + (y - startY)
                            triangle["points"][4] = startX + (x - startX)
                            triangle["points"][5] = startY + (y - startY)
                        return
                logger.warning(f"update_triangle: Triangle {shape_id} not found")

            case "delete_triangle":
                if "triangles" not in file_data:
                    return
                file_data["triangles"] = [t for t in file_data["triangles"] if t["id"] != shape_id]
