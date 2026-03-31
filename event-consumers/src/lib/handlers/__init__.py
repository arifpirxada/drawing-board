from .base_handler import BaseHandler
from .line_handler import LineHandler
from .rectangle_handler import RectangleHandler
from .triangle_handler import TriangleHandler
from .circle_handler import CircleHandler
from .arrow_handler import ArrowHandler
from .text_handler import TextHandler
from .image_handler import ImageHandler
from .transform_handler import TransformHandler
from .drag_handler import DragHandler
from .noop_handler import NoOpHandler


class HandlerRegistry:
    def __init__(self):
        self._handlers: dict[str, BaseHandler] = {}
        self._register_handlers()

    def _register_handlers(self):
        handlers = [
            LineHandler(),
            RectangleHandler(),
            TriangleHandler(),
            CircleHandler(),
            ArrowHandler(),
            TextHandler(),
            ImageHandler(),
            TransformHandler(),
            DragHandler(),
            NoOpHandler(),
        ]

        for handler in handlers:
            for event_type in handler.event_types:
                self._handlers[event_type] = handler

    def get_handler(self, event_type: str) -> BaseHandler:
        return self._handlers.get(event_type, NoOpHandler())


registry = HandlerRegistry()


def get_handler(event_type: str) -> BaseHandler:
    return registry.get_handler(event_type)
