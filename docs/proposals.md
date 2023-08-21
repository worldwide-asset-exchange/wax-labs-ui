## Worflow
![Workflow](./proposal_workflow.svg)

## Naming convention

All functions used in the project are divided between `query` and `actions` functions, and they are organized by
function affinity.

- `Query` functions use `waxClient.v1.chain.get_table_rows` directly and returns a `GetTableRowsResult<T>` where
  `T` is an interface that lives in `@/api/models`.
- `Action` functions use `session.transact`, where session is the current wharfkit logged interface.
    - We use a wrapper to easily execute multiple actions at the same time.
    - This wrapper lives in `@/api/chain/actions/execute.ts` and it should be used instead of the raw interface.
    - The functions that executes the chain actions don't, usually, start and/or end with `get`/`set`, and they try to
      express the function objective.
    - Functions that creates the chain payload are prefixed with `create` and suffixed
      with `Action`: `createSetAdminAction` and they should live ibn the `create` folder in the `actions` folder

## Proposal flow

### Create proposal

In order to create a proposal, the proposer must have a profile created and at least `100.00000000 WAX` in their
account.

This information can be obtained by using the function `accountHasBalance({ actor })`.

If the actor **DOES NOT** have enough balance for creating a proposal, we will add an extra action to the
`createProposal`<sup>*</sup> function:

```typescript
const response = createTransferFundsAction({session: session!})
```

This actions does the following:

- transfer dummy funds from the WaxLabs contract.
- The funds will be transferred back in the WaxLabs contract, since it is a fee for creating **new** proposals.

When a proposal is created, it is sent to a `DRAFT` state, because we can't send deliverables with the proposal.

<small>* This action doesn't return the proposal id, only the transaction id,
which can be used to track the proposal ID. The default behaviour of the previous WaxLabs version was to
redirect the users to the `My Proposals` page</small>

##### Requirements

- Only the proposer can execute this action

---

### Editing proposals

Only proposal with status `DRAFT` or `FAILED_DRAFT` can be edited, if the proposal is in another state, the contract
will raise an error.

The recommended approach is to use the `editProposal` function, however, if more than one action needs to be executed,
we should use the `createEditProposalAction` function.

##### Requirements

- Only the proposer can execute this action

---

### Adding deliverables

Deliverables must be added to Proposals in `DRAFT` state, and raise an error or redirect to proposals page if they're
not.
The deliverables should be created using the `addDeliverable` or `addDeliverables`, if more than one deliverable.

```typescript
const response = await addDeliverable({
    session: session!,
    deliverableId,
    proposalId,
    requestedAmount,
    recipient,
    smallDescription,
    daysToComplete,
})
```

If we need to also update the proposal, it is recommended to use the `createAddDeliverableAction` function directly to
build your own custom actions array.

There are **NO** status change for the Proposal if we're just adding deliverables.

##### Requirements

- Only the proposer can execute this action
- Proposal status must be `DRAFT` or `FAILED_DRAFT`
- The `recipient` account must have a WaxLabs profile
- The `smallDescription` must be smaller than 80
- The `requestedAmount` should not overflow the proposal requested amount

---

### Removing deliverables

We can remove deliverables using `removeDeliverable` function. If we need to execute multiple actions at the same time,
we can use the `createRemoveDeliverableAction` action directly.

```typescript
const response = await removeDeliverable({session: session!, deliverableId, proposalId})
```

After removing a deliverable, if the proposal was on `FAILED_DRAFT`, it will be updated to `DRAFT` status.

##### Requirements

- Only the proposer can execute this action
- Proposal status must be `DRAFT` or `FAILED_DRAFT`

---

### Editing deliverables

We can edit deliverables using `editDeliverable` function. If we need to execute multiple actions at the same time,
we can use the `createEditDeliverableAction` action directly.

```typescript
const response = await editDeliverable({
    session: session!,
    deliverableId,
    proposalId,
    newRequestedAmount,
    newRecipient,
    smallDescription,
    daysToComplete,
})
```

After editing a deliverable, if the proposal was on `FAILED_DRAFT`, it will be updated to `DRAFT` status.

##### Requirements

- Only the proposer can execute this action
- Proposal status must be `DRAFT` or `FAILED_DRAFT`
- Deliverable status must be `DRAFT`
- The `newRecipient` account must have a WaxLabs profile
- The `smallDescription` must be smaller than 80
- The `newRequestedAmount` should not overflow the proposal requested amount

---

### Submit Proposal

After all deliverables were added and the proposal was finalized, we can submit it to review of the Wax Labs admin.
For doing that we should use the `submitProposal` function.

##### Requirements

- Only the proposer can execute this action
- The proposal total requested funds (`total_requested_funds` prop in the proposal object) must be between the min and
  max
  requested of the Wax Labs contract. These values can be queried from the global config object:

  ```typescript
  import {useConfigData} from "./useConfigData";
  
  const {configs} = useConfigData();
  
  console.log(configs.parsed_max_requested, configs.parsed_min_requested);
  ```

  if a proposal `total_requested_funds` is not between this range, it can't be submitted for review.

- The proposal **MUST** have status equal to `DRAFT`

After submitted, a proposal **CAN'T** be edited, and it sent to be reviewed by an admin.

---

### Review Proposal

After the proposal is submitted, the proposal can be reviewed by the admin. For doing that we should use
the `reviewProposal` function or the `skipVoting` function.

```typescript
const response = await reviewProposal({session: session!, proposalId, approve, draft, memo})
```

```typescript
const response = await skipVoting({session: session!, proposalId, memo})
```

##### Requirements

- Only the admin can execute this action
- The proposal **MUST** have status equal to `SUBMITTED`
- The proposal **MUST** have an reviewer set.

The outcome of a revision are:

- Approved: The proposal was approved and the status of self and the associated deliverables set to `IN_PROGRESS`
  - We use the `skipVoting` function if the proposal doesn't require approval from the community 

- Approved with voting: The proposal was approved and the status is set to `APPROVED`
  - We use the `reviewProposal` function if the proposal requires approval from the community

- Rejected: The proposal is moved to `FAILED_DRAFT` or `FAILED` status.
    - If the proposal was completely rejected (`FAILED` state), it **CAN'T** be edited
    - If the revision enables the edition, we can edit it. For allow editing, the Admin must set the flag `draft`* 
      to `true` when submitting the revision. 

<small>* On the old Wax Labs, the draft action is associated with requiring community voting</small> 

---

### Cancel Proposal

We should only use the `cancelProposal` function for doing that. The memo prop is not required and can be ignored.

##### Requirements

- Only the proposer or an admin can execute this action
- The status of the proposal must be one of:
    - `DRAFTING`
    - `SUBMITTED`
    - `APPROVED`
    - `VOTING`
    - `FAILED_DRAFT`

---

### Start Proposal Voting

If a proposal was approved, we can start the community voting. For doing that we should use the `beginVoting` function,
however, the proposer/actor must have at least `10.00000000 WAX` on the WaxLabs Contract. If that's not the case, we use
the same logic of the `createProposal` function, and we add the transfer funds actions.

```typescript
const response = await beginVoting({session: session!, ballotName, proposalId})
```

<small>* the `ballotName` is a random Antelope name (12 required characters)</small>

After starting the voting, the proposal status is updated to `VOTING` and the `vote_end_time` prop is set to a date
using the following equation:

```text
vote_end_time = NOW() + configs.vote_duration
```

<small>* We don't actually need to calculate the `vote_end_time` date, this is here just for explanation</small>

##### Requirements

- Only the proposer or an admin can execute this action
- The proposal status must be equal to `APPROVED`

---

### Voting 

When a proposal is Approved with Voting, the community must vote on the proposal until the admin ends the voting or the minimum voting is reached. 
If the successful path is reached, the proposal is set to `IN_PROGRESS`, if not it is set to `FAILED`.

The voting should be handled with: 

```typescript
const response = await vote({ballotName, voteOption, session});
```

Where ballotName is the one set in the proposal object (`ballot_name`) and voteOption is the one obtained from `ballotOptions` function.

##### Requirements

- Any user with Wax Chain account

---

### End Proposal Voting

After the voting period, we can close the proposal voting, and we should use the the `endVoting`;

The proposal won't change status if we close the voting.

##### Requirements

- Only the proposer or an admin can execute this action
- The proposal status must be equal to `VOTING`

---

### Delete Proposal

After the proposal lifecycle we can delete the proposal using the `deleteProposal` function. This will completely erase
both the proposal and deliverables from the chain.

##### Requirements

- Only the proposer or an admin can delete a proposal
- The proposal status must be one of:
    - `FAILED`
    - `CANCELLED`
    - `COMPLETED`

---

### Submit Report

Once a proposal is approved by both the admin and community (if the total community voting is bigger than the minimum
set in the contract), the proposal status is set to `IN_PROGRESS` and we can submit reports of the deliverables.
For executing this action we should use `submitReport`.

##### Requirements

- Only the proposer or an admin can execute this action
- The status of the proposal must be `IN_PROGRESS`
- The status of the deliverable must be `IN_PROGRESS`

---

### Set Reviewer

Once a proposal is submitted, the admin assign deliverables to any account that is present in the WaxLabs Contract,
therefore, the reviewer must have a WaxLabs profile.

This action can be executed with `setReviewer` function:

```typescript
const response = await setReviewer({newReviewer, deliverableId, proposalId, session});
```

##### Requirements

- Only the admin can execute this action
- The status of the proposal must be `SUBMITTED`

---

### Reviewing a deliverable

Once a proposal is submitted, the admin assign deliverables to any account that is present in the WaxLabs Contract,
therefore, the reviewer must have a WaxLabs profile.

If the WaxLabs contract does not have enough funds to pay the current deliverable, this action will fail if the reviewer
accepts the deliverable

This action can be executed with `setReviewer` function:

```typescript
const response = await reviewDeliverable({
    session: session!,
    proposalId,
    deliverableId,
    accept,
    memo,
})
```

If the reviewer accepts the deliverable, it is updated to `ACCEPTED` status and can be claimed.  
If the reviewer rejects the deliverable, it is updated to `REJECTED` status and the deliverable **CAN NOT** be claimed,
neither be edited/removed.

##### Requirements

- Only a reviewer can execute this action
    - This information is saved in the Proposal object as `reviewer`
- The status of the proposal must be `IN_PROGRESS`
- The status of the deliverable must be `REPORTED`
    - This status is set when the deliverable is submitted

---

### Claiming funds

As soon a deliverable enters in `ACCEPT` state, we can already claim the funds referent to it. This action can be
executed using `claimFunds` function:

```typescript
const response = await claimFunds({
    session: session!,
    proposalId,
    deliverableId,
})
```

If the deliverable was claimed already, its status is updated to `CLAIMED`.

Once the last deliverable is claimed, we set the proposal status to `COMPLETED`.

##### Requirements

- Only a reviewer can execute this action
    - This information is saved in the Proposal object as `reviewer`
- The status of the proposal must be `IN_PROGRESS`
- The status of the deliverable must be `ACCEPTED`

---
