
export const SUCCESS_VARIANT = "success"
export const ERROR_VARIANT = "danger"

export const CANCEL_PROP_ALERT_DICT = {
    SUCCESS: 
    {
        title: "Proposal cancelled!",
        body: "Proposal #%proposal_id% was successfully cancelled", 
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
        body: "Proposal was %approve%.", 
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
        body: "Proposal #%proposal_id% was deleted.", 
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
        body: "%reviewer_name% was set as the reviewer of proposal #%proposal_id%.", 
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
        body: "Proposal #%proposal_id% is now in the voting stage.", 
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
        body: "Proposal #%proposal_id% voting was ended.", 
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

export const ad = {
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

