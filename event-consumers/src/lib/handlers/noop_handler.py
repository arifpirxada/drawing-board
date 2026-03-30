from .base_handler import BaseHandler


class NoOpHandler(BaseHandler):
    @property
    def event_types(self) -> list[str]:
        return [
            "add_image", "delete_image",
            "add_text", "delete_text",
            "drawing_complete",
            "transform_shape", "drag_shape"
        ]

    def handle_event(self, event_type: str, data: dict, file_data: dict):
        pass
