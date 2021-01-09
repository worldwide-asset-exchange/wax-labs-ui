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
                queryType: "BY_PROPOSER_STAT",
                statusKey: key,
                getBounds: getNameBounds,
                accountName: props.userToSearch,
                getProposals: getProposals,
            })
        });

        setQueryArgs(newQueryArgs);
        
    },[props.userToSearch]);


    return (
        <RenderGenericProposals
            noProposalsMessage="No proposals were found for this proposer, try chaning the filters."
            categories={props.categories}
            profile={props.profile}
            activeUser={props.activeUser}
            queryArgs={queryArgs}
        />
    )

}