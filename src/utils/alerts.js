
export const SUCCESS_VARIANT = "success"
export const ERROR_VARIANT = "danger"

export const CANCEL_PROP_ALERT_DICT = {
    SUCCESS: 
    {
        title: "Proposal cancelled!",
        body: "Proposal was successfully cancelled", 
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

export const ac = {
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

