import React, {useState, useEffect} from 'react';
import { getNameBounds } from '../../utils/util';

import * as GLOBAL_VARS from '../../utils/vars';
import { getProposalsWithDeliverablesInPassedStatus } from '../Deliverables/DeliverablesQueries';
import RenderGenericProposals from '../GenericProposals';

export default function RenderDeliverablesToReviewTab (props) {
    const [queryArgs, setQueryArgs] = useState ([]);

    useEffect(()=>{
        
        let newQueryArgs = [{
            queryType: GLOBAL_VARS.BY_REVIEWER_STAT_QUERY_TYPE,
            statusKey: GLOBAL_VARS.PROPOSAL_INPROGRESS_KEY,
            getBounds: getNameBounds,
            accountName: props.reviewer,
            getProposals: getProposalsWithDeliverablesInPassedStatus,
            deliverableStatusKeyList: [GLOBAL_VARS.REPORTED_KEY], 
        }];

        setQueryArgs(newQueryArgs);
        
    },[props.reviewer, props.tabString]);

    return (
        <RenderGenericProposals
            subtitle="Proposals that you are the reviewer of and have reported deliverables"
            noProposalsMessage="No proposals you are reviewer of, with reported deliverables were found, try changing the filters."
            categories={props.categories}
            profile={props.profile}
            activeUser={props.activeUser}
            defaultStatus={[GLOBAL_VARS.PROPOSAL_INPROGRESS_KEY]}
            queryArgs={queryArgs}
            noStatusFilter={true}
        />
    )


}