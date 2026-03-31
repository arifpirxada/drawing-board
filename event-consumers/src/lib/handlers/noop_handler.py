from .base_handler import BaseHandler


class NoOpHandler(BaseHandler):
    @property
    def event_types(self) -> list[str]:
        return [
            "drawing_complete", "drag_shape"
        ]

    def handle_event(self, event_type: str, data: dict, file_data: dict):
        pass
