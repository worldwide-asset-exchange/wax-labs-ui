import * as GLOBAL_VARS from './vars'

export const SUCCESS_VARIANT = "success"
export const ERROR_VARIANT = "danger"
export const WARNING_VARIANT = "warning"
export const ACCEPT_TEMPLATE = "%accept%"
export const AMOUNT_TEMPLATE = "%amount%"
export const APPROVE_TEMPLATE = "%approve%"
export const DELIVERABLE_ID_TEMPLATE = "%deliverable_id%"
export const PROPOSAL_ID_TEMPLATE = "%proposal_id%"
export const REVIEWER_NAME_TEMPLATE = "%reviewer_name%"
export const VOTE_OPTION_TEMPLATE = "%vote_option%"
export const AVAILABLE_FUNDS_TEMPLATE = "%available_funds"
export const REQUESTED_FUNDS_TEMPLATE = "%requested_funds"

export const CANCEL_PROP_ALERT_DICT = {
    SUCCESS:
    {
        title: "Proposal was cancelled.",
        body: `Proposal #${PROPOSAL_ID_TEMPLATE} was successfully cancelled`,
        variant: SUCCESS_VARIANT,
        dismissible: true
    },
    ERROR:
    {
        title: "We couldn't cancel the proposal",
        body: "Something went wrong while canceling the proposal. Please, try again.",
        variant: ERROR_VARIANT,
        dismissible: true,
    }
}

export const REVIEW_PROP_ALERT_DICT = {
    SUCCESS:
    {
        title: "Your review has been registered.",
        body: `Proposal was ${APPROVE_TEMPLATE}.`,
        variant: SUCCESS_VARIANT,
        dismissible: true
    },
    ERROR:
    {
        title: "We couldn't register your review",
        body: "Something went wrong while registering your review for the proposal. Please, try again.",
        variant: ERROR_VARIANT,
        dismissible: true,
    }
}

export const DELETE_PROP_ALERT_DICT = {
    SUCCESS:
    {
        title: "Proposal was deleted",
        body: `Proposal #${PROPOSAL_ID_TEMPLATE} was deleted.`,
        variant: SUCCESS_VARIANT,
        dismissible: true
    },
    ERROR:
    {
        title: "We couldn't delete your proposal.",
        body: "Something went wrong while removing your proposal. Please, try again.",
        variant: ERROR_VARIANT,
        dismissible: true,
    }
}


export const SET_REVIEWER_ALERT_DICT = {
    SUCCESS:
    {
        title: "The reviewer has been set.",
        body: `${REVIEWER_NAME_TEMPLATE} was set as the reviewer of proposal #${PROPOSAL_ID_TEMPLATE}.`,
        variant: SUCCESS_VARIANT,
        dismissible: true
    },
    ERROR:
    {
        title: "We couldn't set the chosen reviewer.",
        body: "Something went wrong while trying to set the chosen reviewer. Make sure the account exists and try again.",
        variant: ERROR_VARIANT,
        dismissible: true,
    }
}

export const BEGIN_VOTING_ALERT_DICT = {
    SUCCESS:
    {
        title: "The proposal voting has started.",
        body: `Proposal #${PROPOSAL_ID_TEMPLATE} is now in the voting stage.`,
        variant: SUCCESS_VARIANT,
        dismissible: true
    },
    ERROR:
    {
        title: "We couldn't start the voting for the proposal ",
        body: "Something went wrong while starting the proposal's voting. Please, try again.",
        variant: ERROR_VARIANT,
        dismissible: true,
    }
}
export const END_VOTING_ALERT_DICT = {
    SUCCESS:
    {
        title: "Proposal voting has ended.",
        body: `Proposal #${PROPOSAL_ID_TEMPLATE} voting has ended.`,
        variant: SUCCESS_VARIANT,
        dismissible: true
    },
    ERROR:
    {
        title: "We couldn't end the proposal voting",
        body: "Something went wrong while trying to end the proposal's voting. Please, try again.",
        variant: ERROR_VARIANT,
        dismissible: true,
    }
}

export const REVIEW_DELIVERABLE_ALERT_DICT = {
    SUCCESS:
    {
        title: "Your deliverable review has been succesfully registered.",
        body: `Deliverable #${DELIVERABLE_ID_TEMPLATE}'s was ${ACCEPT_TEMPLATE}.`,
        variant: SUCCESS_VARIANT,
        dismissible: true
    },
    ERROR:
    {
        title: "We couldn't register your deliverable review.",
        body: "Something went wrong while trying to register your deliverable review. Make sure you added the report and try again.",
        variant: ERROR_VARIANT,
        dismissible: true,
    },
    MISSING_FUNDS:
    {
        title: "We couldn't register your deliverable review. There are not enough available funds",
        body: `There are only ${AVAILABLE_FUNDS_TEMPLATE} available funds and you are trying to approve ${REQUESTED_FUNDS_TEMPLATE}. Add more funds and try again.`,
        variant: ERROR_VARIANT,
        dismissible: true,
    }
}
export const SUBMIT_REPORT_ALERT_DICT = {
    SUCCESS:
    {
        title: "Your report has been succesfully submitted.",
        body: `Deliverable #${DELIVERABLE_ID_TEMPLATE}'s report has been submitted.`,
        variant: SUCCESS_VARIANT,
        dismissible: true
    },
    ERROR:
    {
        title: "We couldn't submit your report.",
        body: "Somethinig went wrong while trying to submit your deliverable report. Please, try again.",
        variant: ERROR_VARIANT,
        dismissible: true,
    }
}

export const CLAIM_FUNDS_ALERT_DICT = {
    SUCCESS:
    {
        title: "You have claimed the funds successfully.",
        body: `Deliverable #${DELIVERABLE_ID_TEMPLATE}'s funds (${AMOUNT_TEMPLATE}) were claimed.`,
        variant: SUCCESS_VARIANT,
        dismissible: true
    },
    ERROR:
    {
        title: "We couldn't proceed with the fund claiming.",
        body: "Something went wrong while claiming your funds. Please, try again.",
        variant: ERROR_VARIANT,
        dismissible: true,
    }
}

export const CAST_VOTE_ALERT_DICT = {
    SUCCESS:
    {
        title: "Your vote has been successfully cast.",
        body: `Voted ${VOTE_OPTION_TEMPLATE} successfully.`,
        variant: SUCCESS_VARIANT,
        dismissible: true
    },
    ERROR:
    {
        title: "We couldn't cast your vote.",
        body: "Something went wrong while trying to cast your vote for this proposal. Please, try again.",
        variant: ERROR_VARIANT,
        dismissible: true,
    }
}

export const SUBMIT_PROP_ALERT_DICT = {
    SUCCESS:
    {
        title: "Your proposal has been successfully submitted.",
        body: `Proposal #${PROPOSAL_ID_TEMPLATE} is now waiting for the admin's review.`,
        variant: SUCCESS_VARIANT,
        dismissible: true
    },
    ERROR:
    {
        title: "We couldn't submit your proposal.",
        body: "Something went wrong while trying to submit your proposal. Please, try again.",
        variant: ERROR_VARIANT,
        dismissible: true,
    }
}

export const SAVE_DRAFT_ALERT_DICT = {
    SUCCESS:
    {
        title: "Your proposal draft has been successfully saved.",
        body: `Proposal #${PROPOSAL_ID_TEMPLATE} was saved. If after the reload, the data in the page does not reflect what you saved, refresh the page after a small delay.`,
        variant: SUCCESS_VARIANT,
        dismissible: true
    },
    ERROR:
    {
        title: "We couldn't save your proposal draft.",
        body: "Something went wrong while trying to save your draft. Make sure there are no errors with the content and try again.",
        variant: ERROR_VARIANT,
        dismissible: true,
    }
}

export const DRAFT_PROP_ALERT_DICT = {
    SUCCESS:
    {
        title: "Your proposal has been created.",
        body: `Your proposal has been successfully created and it's ready for you to add the deliverables.`,
        variant: SUCCESS_VARIANT,
        dismissible: true
    },
    ERROR:
    {
        title: "We coudn't create your proposal.",
        body: "Somethin went wrong while trying to create your proposal. Please, try again.",
        variant: ERROR_VARIANT,
        dismissible: true,
    }
}

export const TOO_MANY_DELIVERABLES_ALERT_DICT = {
    WARN:
    {
        title: "There are quite a few deliverables.",
        body: `Your proposal shoudln't have more than ${GLOBAL_VARS.MAX_DELIVERABLES} deliverables.`,
        variant: ERROR_VARIANT,
        dismissible: true
    },
}

export const NO_REJECTION_REASON_ALERT_DICT = {
    WARN:
    {
        title: "You should add a reason for the rejection.",
        body: "When rejecting a proposal, remember to give valuable feedback for the proposer.",
        variant: ERROR_VARIANT,
        dismissible: true
    }
}


export const INVALID_DATA_ALERT_DICT = {
    WARN:
    {
        title: "There is some information that needs reviewing.",
        body: "Some of the information you provided is not according to our expectations. Please, check the error messages and try again.",
        variant: ERROR_VARIANT,
        dismissible: true
    }
}

export const WITHDRAW_FUNDS_ALERT_DICT = {
    SUCCESS:
    {
        title: "Your withdrawal was a success.",
        body: "Your funds have been successfully withdrawn",
        variant: SUCCESS_VARIANT,
        dismissible: true
    },
    ERROR:
    {
        title: "We couldn't complete your withdrawal.",
        body: "Something went wrong while attempting to withdraw from your balance. Please, try again.",
        variant: ERROR_VARIANT,
        dismissible: true,
    }
}

export const SKIP_VOTING_ALERT_DICT = {
    SUCCESS:
    {
        title: "The proposal has been accepted without being voted.",
        body: "The proposal has been accepted and will skip voting. It's status will be changed to in progress directly.",
        variant: SUCCESS_VARIANT,
        dismissible: true
    },
    ERROR:
    {
        title: "We couldn't register your acceptance.",
        body: "Something went wrong while registering your acceptance and skip voting. Please, try again.",
        variant: ERROR_VARIANT,
        dismissible: true,
    }
}

export const DONATE_FUNDS_ALERT_DICT = {
    SUCCESS:
    {
        title: "Your donation has been received.",
        body: "Thank you for helping enhance the ecosystem",
        variant: SUCCESS_VARIANT,
        dismissible: true
    },
    ERROR:
    {
        title: "We couldn't register your donation.",
        body: "Something went wrong while attempting to donate to wax labs",
        variant: ERROR_VARIANT,
        dismissible: true,
    }
}

export const EDIT_PROFILE_ALERT_DICT = {
    SUCCESS:
    {
        title: "Your profile has been updated.",
        body: "The changes you made have been updated to your profile.",
        variant: SUCCESS_VARIANT,
        dismissible: true
    },
    ERROR:
    {
        title: "We couldn't update your profile.",
        body: "Something went wrong while trying to save your changes. Please make sure there are no errors and try again.",
        variant: ERROR_VARIANT,
        dismissible: true,
    }
}


export const CREATE_PROFILE_ALERT_DICT = {
    SUCCESS:
    {
        title: "Your profile has been successfully created.",
        body: "You now have a profile and can be even more active in the community.",
        variant: SUCCESS_VARIANT,
        dismissible: true
    },
    ERROR:
    {
        title: "We couldn't create your profile.",
        body: "Something went wrong while trying to create your profile. Make sure there are no errors and try again.",
        variant: ERROR_VARIANT,
        dismissible: true,
    }
}
export const REMOVE_PROFILE_ALERT_DICT = {
    SUCCESS:
    {
        title: "Your profile has been successfully removed.",
        body: "Your personal information has been removed.",
        variant: SUCCESS_VARIANT,
        dismissible: true
    },
    ERROR:
    {
        title: "We couldn't remove your profile.",
        body: "Something went wrong while attempting to remove your profile. Please, try again.",
        variant: ERROR_VARIANT,
        dismissible: true,
    }
}

export const REMOVE_CATEGORY_ALERT_DICT = {
    SUCCESS:
    {
        title: "Category has been successfully removed.",
        body: "The category can't be selected anymore for new proposals.",
        variant: SUCCESS_VARIANT,
        dismissible: true
    },
    ERROR:
    {
        title: "We couldn't remove the category.",
        body: "Something went wrong whille attempting to remove the category. Please, try again.",
        variant: ERROR_VARIANT,
        dismissible: true,
    }
}

export const ADD_CATEGORY_ALERT_DICT = {
    SUCCESS:
    {
        title: "Category has been added successfully.",
        body: "The new category is now available for the proposals.",
        variant: SUCCESS_VARIANT,
        dismissible: true
    },
    ERROR:
    {
        title: "We couldn't add the category.",
        body: "Something went wrong while attempting to add the category. Make sure it follows all the naming requirements and try again.",
        variant: ERROR_VARIANT,
        dismissible: true,
    }
}

export const SET_DURATION_ALERT_DICT = {
    SUCCESS:
    {
        title: "Voting period duration has been successfully set.",
        body: "The new voting period is now being applied to in voting proposals.",
        variant: SUCCESS_VARIANT,
        dismissible: true
    },
    ERROR:
    {
        title: "We couldn't set the voting period duration.",
        body: "Something went wrong while attempting to set the voting duration. Please, try again.",
        variant: ERROR_VARIANT,
        dismissible: true,
    }
}

export const REMOVE_PROFILE_ADMIN_ALERT_DICT = {
    SUCCESS:
    {
        title: "The profile has been successfully removed.",
        body: "The user's personal information doesn't exist anymore.",
        variant: SUCCESS_VARIANT,
        dismissible: true
    },
    ERROR:
    {
        title: "We couldn't remove the user's profile.",
        body: "Something went wrong while attempting to remove the profile. Make sure the user exists and has a profile and try again.",
        variant: ERROR_VARIANT,
        dismissible: true,
    }
}
export const SET_ADMIN_ALERT_DICT = {
    SUCCESS:
    {
        title: "New admin has been successfully set.",
        body: "New admin has been set. Thank you for all your work! It's been a pleasure.",
        variant: SUCCESS_VARIANT,
        dismissible: true
    },
    ERROR:
    {
        title: "We couldn't set the new admin.",
        body: "Something went wrong while attempting set the new admin. Make sure the user exists and try again.",
        variant: ERROR_VARIANT,
        dismissible: true,
    }
}

export const SET_MIN_REQUESTED_ALERT_DICT = {
    SUCCESS:
    {
        title: "New minimum requested value has been successfully set.",
        body: "New minimum requested value has been set. Thank you for all your work! It's been a pleasure.",
        variant: SUCCESS_VARIANT,
        dismissible: true
    },
    ERROR:
    {
        title: "We couldn't set the new minimum requested value.",
        body: "Something went wrong while attempting set the new minimum requested value. Please, try again.",
        variant: ERROR_VARIANT,
        dismissible: true,
    }
}

export const SET_MAX_REQUESTED_ALERT_DICT = {
    SUCCESS:
    {
        title: "New maximum requested value has been successfully set.",
        body: "New maximum requested value has been set. Thank you for all your work! It's been a pleasure.",
        variant: SUCCESS_VARIANT,
        dismissible: true
    },
    ERROR:
    {
        title: "We couldn't set the new maximum requested value.",
        body: "Something went wrong while attempting set the new maximum requested value. Please, try again.",
        variant: ERROR_VARIANT,
        dismissible: true,
    }
}



// Please copy and paste this if you are creating a new ALERT_DICT
export const ALERT_DICT_TEMPLATE = {
    SUCCESS:
    {
        title: "",
        body: "",
        variant: SUCCESS_VARIANT,
        dismissible: true
    },
    ERROR:
    {
        title: "",
        body: "",
        variant: ERROR_VARIANT,
        dismissible: true,
    }
}

