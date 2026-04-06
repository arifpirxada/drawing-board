from .base_handler import BaseHandler


class NoOpHandler(BaseHandler):
    def handle_event(self, data: dict, file_data: dict):
        pass
