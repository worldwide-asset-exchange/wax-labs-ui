import React from 'react';

import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';

import useQueryString from '../utils/useQueryString';
import * as GLOBAL_VARS from '../utils/vars';

import RenderBalance from '../partials/AccountPortal/Balance';

export default function RenderAccountPortal (props) {

    const [tabString, setTabString] = useQueryString(GLOBAL_VARS.TAB_QUERY_STRING_KEY, GLOBAL_VARS.BALANCE_EVENT_KEY);

    return (
        <Tabs defaultActiveKey={tabString} id="account-portal">
            <Tab 
                eventKey={GLOBAL_VARS.BALANCE_EVENT_KEY} 
                title="Balance" 
                onEnter={()=>setTabString(GLOBAL_VARS.BALANCE_EVENT_KEY)}
            >
                <RenderBalance activeUser={props.activeUser} />
            </Tab>
            <Tab 
                eventKey={GLOBAL_VARS.PROFILE_EVENT_KEY} 
                title="Profile"
                onEnter={()=>setTabString(GLOBAL_VARS.PROFILE_EVENT_KEY)}
            >

            </Tab>
            <Tab 
                eventKey={GLOBAL_VARS.MY_PROPOSALS_EVENT_KEY} 
                title="My proposals"
                onEnter={()=>setTabString(GLOBAL_VARS.MY_PROPOSALS_EVENT_KEY)}
            >

            </Tab>
            <Tab 
                eventKey={GLOBAL_VARS.DELIVERABLES_TO_REVIEW_EVENT_KEY} 
                title="Deliverables to review"
                onEnter={()=>setTabString(GLOBAL_VARS.DELIVERABLES_TO_REVIEW_EVENT_KEY)}
            >

            </Tab>
        </Tabs>
    )
}
