import logging
from .base_handler import BaseHandler

logger = logging.getLogger("event-consumers")


class ArrowHandler(BaseHandler):
    @property
    def event_types(self) -> list[str]:
        return ["draw_arrow_line", "update_arrow_line", "delete_arrow_line"]

    def handle_event(self, event_type: str, data: dict, file_data: dict):
        shape_id = data.get("id", "unknown")

        match event_type:
            case "draw_arrow_line":
                if "arrowLines" not in file_data:
                    file_data["arrowLines"] = []
                file_data["arrowLines"].append(data)

            case "update_arrow_line":
                if "arrowLines" not in file_data:
                    logger.warning(f"update_arrow_line: No arrowLines for {shape_id}")
                    return
                for arrLine in file_data["arrowLines"]:
                    if arrLine["id"] == shape_id:
                        points = data.get("points", {})
                        x = points.get("x")
                        y = points.get("y")
                        if x is not None and y is not None:
                            arrLine["points"] = [arrLine["points"][0], arrLine["points"][1], x, y]
                        return
                logger.warning(f"update_arrow_line: Arrow line {shape_id} not found")

            case "delete_arrow_line":
                if "arrowLines" not in file_data:
                    return
                file_data["arrowLines"] = [a for a in file_data["arrowLines"] if a["id"] != shape_id]
