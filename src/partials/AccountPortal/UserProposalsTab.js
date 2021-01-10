import React, {useEffect, useState} from 'react';

import RenderGenericProposals from '../GenericProposals';

import * as GLOBAL_VARS from '../../utils/vars';
import {getNameBounds, getProposals} from '../../utils/util';

export default function RenderUserProposalsTab (props) {

    const [queryArgs, setQueryArgs] = useState (null);

    useEffect(()=>{
        
        let newQueryArgs = [];
        GLOBAL_VARS.PROPOSALS_STATUS_KEYS.forEach((key, index)=>{
            newQueryArgs.push({
                queryType: GLOBAL_VARS.BY_PROPOSER_STAT_QUERY_TYPE,
                statusKey: key,
                getBounds: getNameBounds,
                accountName: props.userToSearch,
                getProposals: getProposals,
            })
        });

        setQueryArgs(newQueryArgs);
        
    },[props.userToSearch, props.tabString]);


    return (
        <RenderGenericProposals
            subtitle="Proposals that you are the proposer of"
            noProposalsMessage="No proposals were found, try changing the filters."
            categories={props.categories}
            showCreateButton={true}
            profile={props.profile}
            activeUser={props.activeUser}
            queryArgs={queryArgs}
        />
    )

}