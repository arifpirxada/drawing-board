from abc import ABC, abstractmethod
import logging

logger = logging.getLogger("event-consumers")


class BaseHandler(ABC):
    @property
    @abstractmethod
    def event_types(self) -> list[str]:
        pass

    @abstractmethod
    def handle_event(self, event_type: str, data: dict, file_data: dict):
        pass
