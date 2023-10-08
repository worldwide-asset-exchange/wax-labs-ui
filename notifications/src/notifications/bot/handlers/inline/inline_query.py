async def inline_query_handler():
    pass
    # if not inline_query:
    #     return
    #
    # try:
    #     proposal_id = int(inline_query.query)
    #
    #     proposal = await get_proposal(proposal_id)
    #
    #     results = [
    #         InlineQueryResultArticle(
    #             id=inline_query.id,
    #             title=f"Proposal {proposal_id} status",
    #             input_message_content=InputTextMessageContent(
    #                 message_text=f'The current status of the proposal
    #                 {proposal_id} is <b>"{proposal.human_status}"</b>',
    #                 parse_mode="html",
    #             ),
    #         )
    #     ]
    #     # await bot.answer_inline_query(inline_query.id, results)
    # except TypeError:
    #     pass
