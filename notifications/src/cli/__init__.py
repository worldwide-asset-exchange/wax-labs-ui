import inspect
from functools import partial, wraps

import asyncer
import typer

from cli.creators import create_proposals_from_wax_proposals, create_users_from_profile


class AsyncTyper(typer.Typer):
    @staticmethod
    def maybe_run_async(decorator, f):
        if inspect.iscoroutinefunction(f):

            @wraps(f)
            def runner(*args, **kwargs):
                return asyncer.runnify(f)(*args, **kwargs)

            decorator(runner)
        else:
            decorator(f)
        return f

    def callback(self, *args, **kwargs):
        decorator = super().callback(*args, **kwargs)
        return partial(self.maybe_run_async, decorator)

    def command(self, *args, **kwargs):
        decorator = super().command(*args, **kwargs)
        return partial(self.maybe_run_async, decorator)


app = AsyncTyper()


@app.command()
async def users():
    await create_users_from_profile()


@app.command()
async def proposals():
    await create_proposals_from_wax_proposals()
