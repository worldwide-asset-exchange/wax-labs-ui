import cyclopts

from cli.creators import create_proposals_from_wax_proposals, create_users_from_profile

app = cyclopts.App()


@app.command()
async def users():
    await create_users_from_profile()


@app.command()
async def proposals():
    await create_proposals_from_wax_proposals()
