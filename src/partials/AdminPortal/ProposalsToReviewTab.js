import { useState, useEffect } from 'react';

import * as GLOBAL_VARS from '../../utils/vars';
import { getProposals, getStatBounds } from '../../utils/util';
import RenderGenericProposals from '../GenericProposals';

export default function RenderProposalsToReviewTab(props) {
    const [queryArgs, setQueryArgs] = useState(null);

    useEffect(() => {
        let newQueryArgs = [
            {
                queryType: GLOBAL_VARS.BY_STAT_CAT_QUERY_TYPE,
                statusKey: GLOBAL_VARS.SUBMITTED_KEY,
                getBounds: getStatBounds,
                accountName: props.reviewer,
                getProposals: getProposals
            }
        ];

        setQueryArgs(newQueryArgs);
    }, [props.reviewer, props.tabString]);

    return (
        <RenderGenericProposals
            subtitle="These proposals are waiting for review"
            noProposalsMessage="No proposals found with current filters, try clearing the filters."
            categories={props.categories}
            profile={props.profile}
            activeUser={props.activeUser}
            defaultStatus={[GLOBAL_VARS.SUBMITTED_KEY]}
            queryArgs={queryArgs}
            noStatusFilter
        />
    );
}
