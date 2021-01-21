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

export const SUBMIT_PROP_ALERT_DICT = {
    SUCCESS: 
    {
        title: "Submit prop success!",
        body: `Proposal #${PROPOSAL_ID_TEMPLATE} was submitted`, 
        variant: SUCCESS_VARIANT, 
        dismissible: true
    },
    ERROR:
    {
        title: "Submit prop error!",
        body: "An error ocurred when trying to call the submit prop action.",
        variant: ERROR_VARIANT,
        dismissible: true,
    }
}

export const SAVE_DRAFT_ALERT_DICT = {
    SUCCESS: 
    {
        title: "Save draft success!",
        body: `Proposal #${PROPOSAL_ID_TEMPLATE} was saved. If after the reload, the data in the page does not reflect what you saved, refresh the page after a small delay.`, 
        variant: SUCCESS_VARIANT, 
        dismissible: true
    },
    ERROR:
    {
        title: "Save draft error!",
        body: "An error occurred when trying to sign the transaction for the save draft action",
        variant: ERROR_VARIANT,
        dismissible: true,
    }
}

export const DRAFT_PROP_ALERT_DICT = {
    SUCCESS: 
    {
        title: "Create prop success!",
        body: `Proposal was created.`, 
        variant: SUCCESS_VARIANT, 
        dismissible: true
    },
    ERROR:
    {
        title: "Create prop error!",
        body: "An error ocurred when trying to call the draft prop action",
        variant: ERROR_VARIANT,
        dismissible: true,
    }
}

export const TOO_MANY_DELIVERABLES_ALERT_DICT = {
    WARN: 
    {
        title: "Too many deliverables!",
        body: `Can't have more than ${GLOBAL_VARS.MAX_DELIVERABLES} deliverables`, 
        variant: WARNING_VARIANT, 
        dismissible: true
    },
}

export const NO_REJECTION_REASON_ALERT_DICT = {
    WARN:
    {
        title: "No rejection reason!",
        body: "You have to provide a rejection reason when rejecting a proposal",
        variant: WARNING_VARIANT,
        dismissible: true
    }
}


export const INVALID_DATA_ALERT_DICT = {
    WARN:
    {
        title: "Invalid data!",
        body: "There is some invalid data, fix it before attempting to save draft again.",
        variant: WARNING_VARIANT,
        dismissible: true
    }
}

export const WITHDRAW_FUNDS_ALERT_DICT = {
    SUCCESS: 
    {
        title: "Withdraw was a success!",
        body: "Funds were successfully withdrawn", 
        variant: SUCCESS_VARIANT, 
        dismissible: true
    },
    ERROR:
    {
        title: "Withdraw error",
        body: "There was an error when attempting to withdraw your balance",
        variant: ERROR_VARIANT,
        dismissible: true,
    }
}

export const DONATE_FUNDS_ALERT_DICT = {
    SUCCESS: 
    {
        title: "Donate was a success!",
        body: "Thank you for helping enhance the ecosystem", 
        variant: SUCCESS_VARIANT, 
        dismissible: true
    },
    ERROR:
    {
        title: "Donate error",
        body: "There was an error when attempting to donate to wax labs",
        variant: ERROR_VARIANT,
        dismissible: true,
    }
}

export const EDIT_PROFILE_ALERT_DICT = {
    SUCCESS: 
    {
        title: "Edit profile was a success!",
        body: "Your profile was successfuly updated", 
        variant: SUCCESS_VARIANT, 
        dismissible: true
    },
    ERROR:
    {
        title: "Edit profile error!",
        body: "There was an error when attempting to update your profile",
        variant: ERROR_VARIANT,
        dismissible: true,
    }
}


export const CREATE_PROFILE_ALERT_DICT = {
    SUCCESS: 
    {
        title: "Create profile was a success!",
        body: "Your profile was successfuly created", 
        variant: SUCCESS_VARIANT, 
        dismissible: true
    },
    ERROR:
    {
        title: "Create profile error!",
        body: "There was an error when attempting to create your profile",
        variant: ERROR_VARIANT,
        dismissible: true,
    }
}
export const REMOVE_PROFILE_ALERT_DICT = {
    SUCCESS: 
    {
        title: "Remove profile was a success!",
        body: "Your profile was successfuly removed", 
        variant: SUCCESS_VARIANT, 
        dismissible: true
    },
    ERROR:
    {
        title: "Remove profile error!",
        body: "There was an error when attempting to remove your profile",
        variant: ERROR_VARIANT,
        dismissible: true,
    }
}

export const REMOVE_CATEGORY_ALERT_DICT = {
    SUCCESS: 
    {
        title: "Remove category was a success!",
        body: "Category was successfuly removed", 
        variant: SUCCESS_VARIANT, 
        dismissible: true
    },
    ERROR:
    {
        title: "Remove category error!",
        body: "There was an error when attempting to remove the category",
        variant: ERROR_VARIANT,
        dismissible: true,
    }
}

export const ADD_CATEGORY_ALERT_DICT = {
    SUCCESS: 
    {
        title: "Add category was a success!",
        body: "Category was successfuly added", 
        variant: SUCCESS_VARIANT, 
        dismissible: true
    },
    ERROR:
    {
        title: "Add category error!",
        body: "There was an error when attempting to add the category",
        variant: ERROR_VARIANT,
        dismissible: true,
    }
}

export const SET_DURATION_ALERT_DICT = {
    SUCCESS: 
    {
        title: "Set voting duration was a success!",
        body: "Voting duration was successfuly set", 
        variant: SUCCESS_VARIANT, 
        dismissible: true
    },
    ERROR:
    {
        title: "Set voting duration error!",
        body: "There was an error when attempting to set the voting duration",
        variant: ERROR_VARIANT,
        dismissible: true,
    }
}

export const REMOVE_PROFILE_ADMIN_ALERT_DICT = {
    SUCCESS: 
    {
        title: "Remove profile was a success!",
        body: "Profile was successfuly removed", 
        variant: SUCCESS_VARIANT, 
        dismissible: true
    },
    ERROR:
    {
        title: "Remove profile error!",
        body: "There was an error when attempting to remove the profile",
        variant: ERROR_VARIANT,
        dismissible: true,
    }
}
export const SET_ADMIN_ALERT_DICT = {
    SUCCESS: 
    {
        title: "Set admin was a success!",
        body: "Admin was successfuly set", 
        variant: SUCCESS_VARIANT, 
        dismissible: true
    },
    ERROR:
    {
        title: "Set admin error!",
        body: "There was an error when attempting to set the new admin",
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

