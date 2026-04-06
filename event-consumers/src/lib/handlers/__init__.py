from .base_handler import BaseHandler
# from .image_handler import ImageHandler
from .transform_handler import TransformHandler
from .drag_handler import DragHandler
from .noop_handler import NoOpHandler
from .drawing_complete_handler import DrawingCompleteHandler
from .delete_shapes_handler import DeleteShapesHandler


class HandlerRegistry:
    def __init__(self):
        self._handlers: dict[str, BaseHandler] = {
            "drawing_complete": DrawingCompleteHandler(),
            "delete_shapes": DeleteShapesHandler(),
            "transform_shape": TransformHandler(),
            "drag_shape_end": DragHandler()
        }

    def get_handler(self, event_type: str) -> BaseHandler:
        return self._handlers.get(event_type, NoOpHandler())


registry = HandlerRegistry()


def get_handler(event_type: str) -> BaseHandler:
    return registry.get_handler(event_type)
