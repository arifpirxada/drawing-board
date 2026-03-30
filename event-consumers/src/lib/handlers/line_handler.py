import logging
from .base_handler import BaseHandler

logger = logging.getLogger("event-consumers")


class LineHandler(BaseHandler):
    @property
    def event_types(self) -> list[str]:
        return [
            "draw_line", "update_line", "delete_line",
            "draw_straight_line", "update_straight_line", "delete_straight_line"
        ]

    def handle_event(self, event_type: str, data: dict, file_data: dict):
        shape_id = data.get("id", "unknown")
        
        if "lines" not in file_data:
            file_data["lines"] = []

        match event_type:
            case "draw_line" | "draw_straight_line":
                file_data["lines"].append(data)

            case "update_line" | "update_straight_line":
                if not file_data["lines"]:
                    logger.warning(f"{event_type}: No lines for {shape_id}")
                    return

                for line in file_data["lines"]:
                    if line["id"] == shape_id:
                        points = data.get("points", {})
                        x = points.get("x")
                        y = points.get("y")
                        if x is not None and y is not None:
                            if event_type == "update_line":
                                line["points"].extend([x, y])
                            else:
                                line["points"] = [line["points"][0], line["points"][1], x, y]
                        return
                logger.warning(f"{event_type}: Line {shape_id} not found")

            case "delete_line" | "delete_straight_line":
                file_data["lines"] = [l for l in file_data["lines"] if l["id"] != shape_id]
