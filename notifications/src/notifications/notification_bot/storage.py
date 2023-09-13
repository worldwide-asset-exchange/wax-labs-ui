import json
import typing
from collections import defaultdict
from pathlib import Path

from telebot.asyncio_storage.base_storage import StateContext, StateStorageBase


class JsonStorage(StateStorageBase):
    def __init__(self, file_path: Path | str | None = None) -> None:
        super().__init__()

        self.file_path = (Path(file_path) if file_path else Path("./.state-save/states.json")).resolve()
        self.create_dir()
        self.data = self.read()

    def create_dir(self):
        """
        Create directory .save-handlers.
        """
        if not self.file_path.exists():
            self.file_path.parent.mkdir(parents=True, exist_ok=True)

            with open(self.file_path, "w") as fp:
                fp.write("{}")

    def read(self) -> defaultdict:
        with open(self.file_path) as fp:
            data = defaultdict(dict)
            data.update(json.load(fp))
            return data

    def update_data(self):
        with open(self.file_path, "w") as fp:
            fp.write(json.dumps(self.data))

    async def set_state(self, chat_id: int, user_id: int, state):
        if hasattr(state, "name"):
            state = state.name

        if self.has_valid_state(chat_id, user_id):
            self.data[str(chat_id)][str(user_id)]["state"] = state
        else:
            self.data[str(chat_id)][str(user_id)] = {"state": state, "data": {}}

        self.update_data()
        return True

    async def delete_state(self, chat_id: int, user_id: int):
        if self.has_valid_state(chat_id, user_id):
            del self.data[str(chat_id)][str(user_id)]

            if chat_id == user_id:
                del self.data[chat_id]

            self.update_data()

            return True

        return False

    async def get_state(self, chat_id: int, user_id: int):
        if self.has_valid_state(chat_id, user_id):
            return self.data[str(chat_id)][str(user_id)]["state"]

        return None

    async def get_data(self, chat_id: int, user_id: int):
        if self.has_valid_state(chat_id, user_id):
            return self.data[str(chat_id)][str(user_id)]["data"]

        return None

    async def reset_data(self, chat_id: int, user_id: int, skip_save: bool = False):
        if self.has_valid_state(chat_id, user_id):
            self.data[str(chat_id)][str(user_id)]["data"] = {}

            if not skip_save:
                self.update_data()

            return True
        return False

    async def set_data(self, chat_id: int, user_id: int, key: str, value: typing.Any):
        if not self.has_valid_state(chat_id, user_id):
            await self.reset_data(chat_id, user_id, True)

        self.data[str(chat_id)][str(user_id)]["data"][key] = value

        self.update_data()

        return True

    def get_interactive_data(self, chat_id: int, user_id: int):
        return StateContext(self, chat_id, user_id)

    async def save(self, chat_id: int, user_id: int, data):
        self.data[str(chat_id)][str(user_id)]["data"] = data
        self.update_data()

    def has_valid_state(self, chat_id: int, user_id: int):
        state = self.data.get(str(chat_id), {}).get(str(user_id))

        return bool(state) and isinstance(state, dict) and bool(state.get("data"))
