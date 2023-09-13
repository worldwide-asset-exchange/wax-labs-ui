from telebot.types import InlineQuery, InlineQueryResultArticle, InputTextMessageContent

from notifications.notification_bot.bot import bot
from notifications.notification_bot.chain import get_proposal_status


async def inline_query_handler(inline_query: InlineQuery):
    if not inline_query:
        return

    try:
        proposal_id = int(inline_query.query)

        proposal_status = await get_proposal_status(proposal_id)

        results = [
            InlineQueryResultArticle(
                id=inline_query.id,
                title=f"Proposal {proposal_id} status",
                input_message_content=InputTextMessageContent(
                    message_text=f'The current status of the proposal {proposal_id} is <b>"{proposal_status}"</b>',
                    parse_mode="html",
                ),
            )
        ]
        await bot.answer_inline_query(inline_query.id, results)
    except TypeError:
        pass
