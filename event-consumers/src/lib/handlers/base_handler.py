from abc import ABC, abstractmethod
import logging

logger = logging.getLogger("event-consumers")


class BaseHandler(ABC):
    @abstractmethod
    def handle_event(self, data: dict, file_data: dict):
        pass
