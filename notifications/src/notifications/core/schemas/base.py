import typing as t

from pydantic import UUID4, BaseModel


class BaseSchema(BaseModel):
    def create_update_dict(
        self,
        exclude: list[str] = None,
    ) -> dict[str, t.Any]:
        exclude_dict = exclude if isinstance(exclude, list) else []

        return self.model_dump(
            exclude_unset=True,
            exclude={"uuid", *exclude_dict},
        )


GenericSchema = t.TypeVar("GenericSchema", bound=BaseSchema)


class BaseUUID(BaseSchema):
    uuid: UUID4


class PaginationResult(BaseModel, t.Generic[GenericSchema]):
    max_page: int
    current_page: int
    result: list[GenericSchema]


class Result(BaseModel, t.Generic[GenericSchema]):
    total_results: int
    result: list[GenericSchema]
