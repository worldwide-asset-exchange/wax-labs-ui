
export const SUCCESS_VARIANT = "success"
export const ERROR_VARIANT = "danger"
export const ACCEPT_TEMPLATE = "%accept%"
export const AMOUNT_TEMPLATE = "%amount%"
export const APPROVE_TEMPLATE = "%approve%"
export const DELIVERABLE_ID_TEMPLATE = "%deliverable_id%"
export const PROPOSAL_ID_TEMPLATE = "%proposal_id%"
export const REVIEWER_NAME_TEMPLATE = "%reviewer_name%"
export const VOTE_OPTION_TEMPLATE = "%vote_option%"

export const CANCEL_PROP_ALERT_DICT = {
    SUCCESS: 
    {
        title: "Proposal cancelled!",
        body: `Proposal #${PROPOSAL_ID_TEMPLATE} was successfully cancelled`, 
        variant: SUCCESS_VARIANT, 
        dismissible: true
    },
    ERROR:
    {
        title: "Cancel proposal error!",
        body: "Cancel proposal encountered an error.",
        variant: ERROR_VARIANT,
        dismissible: true,
    }
}

export const REVIEW_PROP_ALERT_DICT = {
    SUCCESS: 
    {
        title: "Review proposal success!",
        body: `Proposal was ${APPROVE_TEMPLATE}.`, 
        variant: SUCCESS_VARIANT, 
        dismissible: true
    },
    ERROR:
    {
        title: "Review proposal error!",
        body: "An error ocurred when trying to call the review proposal action.",
        variant: ERROR_VARIANT,
        dismissible: true,
    }
}

export const DELETE_PROP_ALERT_DICT = {
    SUCCESS: 
    {
        title: "Delete proposal success!",
        body: `Proposal #${PROPOSAL_ID_TEMPLATE} was deleted.`, 
        variant: SUCCESS_VARIANT, 
        dismissible: true
    },
    ERROR:
    {
        title: "Delete proposal error!",
        body: "An error ocurred when trying to call the delete proposal action.",
        variant: ERROR_VARIANT,
        dismissible: true,
    }
}


export const SET_REVIEWER_ALERT_DICT = {
    SUCCESS: 
    {
        title: "Set reviewer success!",
        body: `${REVIEWER_NAME_TEMPLATE} was set as the reviewer of proposal #${PROPOSAL_ID_TEMPLATE}.`, 
        variant: SUCCESS_VARIANT, 
        dismissible: true
    },
    ERROR:
    {
        title: "Set reviewer error!",
        body: "An error ocurred when trying to call the set reviewer action.",
        variant: ERROR_VARIANT,
        dismissible: true,
    }
}

export const BEGIN_VOTING_ALERT_DICT = {
    SUCCESS: 
    {
        title: "Begin voting success!",
        body: `Proposal #${PROPOSAL_ID_TEMPLATE} is now in the voting stage.`, 
        variant: SUCCESS_VARIANT, 
        dismissible: true
    },
    ERROR:
    {
        title: "Begin voting error!",
        body: "An error ocurred when trying to call the begin voting action.",
        variant: ERROR_VARIANT,
        dismissible: true,
    }
}
export const END_VOTING_ALERT_DICT = {
    SUCCESS: 
    {
        title: "End voting success!",
        body: `Proposal #${PROPOSAL_ID_TEMPLATE} voting was ended.`, 
        variant: SUCCESS_VARIANT, 
        dismissible: true
    },
    ERROR:
    {
        title: "End voting error!",
        body: "An error ocurred when trying to call the end voting action.",
        variant: ERROR_VARIANT,
        dismissible: true,
    }
}

export const REVIEW_DELIVERABLE_ALERT_DICT = {
    SUCCESS: 
    {
        title: "Review deliverable success!",
        body: `Deliverable #${DELIVERABLE_ID_TEMPLATE}'s was ${ACCEPT_TEMPLATE}.`, 
        variant: SUCCESS_VARIANT, 
        dismissible: true
    },
    ERROR:
    {
        title: "Review report error!",
        body: "An error ocurred when trying to call the reviewdeliv action.",
        variant: ERROR_VARIANT,
        dismissible: true,
    }
}
export const SUBMIT_REPORT_ALERT_DICT = {
    SUCCESS: 
    {
        title: "Submit report success!",
        body: `Deliverable #${DELIVERABLE_ID_TEMPLATE}'s report was submitted.`, 
        variant: SUCCESS_VARIANT, 
        dismissible: true
    },
    ERROR:
    {
        title: "Submit report error!",
        body: "An error ocurred when trying to call the submit report action.",
        variant: ERROR_VARIANT,
        dismissible: true,
    }
}

export const CLAIM_FUNDS_ALERT_DICT = {
    SUCCESS: 
    {
        title: "Claim funds success!",
        body: `Deliverable #${DELIVERABLE_ID_TEMPLATE}'s funds (${AMOUNT_TEMPLATE}) were claimed.`, 
        variant: SUCCESS_VARIANT, 
        dismissible: true
    },
    ERROR:
    {
        title: "Claim funds error!",
        body: "An error occurred when trying to call the claim funds action.",
        variant: ERROR_VARIANT,
        dismissible: true,
    }
}

export const CAST_VOTE_ALERT_DICT = {
    SUCCESS: 
    {
        title: "Cast vote success!",
        body: `Voted ${VOTE_OPTION_TEMPLATE} successfully.`, 
        variant: SUCCESS_VARIANT, 
        dismissible: true
    },
    ERROR:
    {
        title: "Voting error!",
        body: "An error ocurred when trying to call the castvote action.",
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

