import React, {useEffect, useState} from 'react';
import {useParams} from 'react-router-dom';
import * as waxjs from "@waxio/waxjs/dist";
import RenderSingleDeliverable from "./SingleDeliverable"


import * as globals from "../../utils/vars";
import RenderFilter from '../Filter';
import useQueryString from '../../utils/useQueryString';

import "./DeliverablesList.scss"

const wax = new waxjs.WaxJS(process.env.REACT_APP_WAX_RPC, null, null, false);

const readableDeliverableStatus = globals.READABLE_DELIVERABLE_STATUS

export default function RenderDeliverablesList(props){
    const {id} = useParams();
    const [deliverables, setDeliverables] = useState([]);

    const [statusList, setStatusList] = useQueryString(globals.STATUS_QUERY_STRING_KEY, []);

    async function getDeliverablesData(){
        try{
            let delivs = await wax.rpc.get_table_rows({
                code: globals.LABS_CONTRACT_ACCOUNT,
                scope: id,
                table: globals.DELIVERABLES_TABLE,
                json: true,
                limit: 1000,
            });
            let statusComments = await wax.rpc.get_table_rows({
                code: globals.LABS_CONTRACT_ACCOUNT,
                scope: id,
                table: globals.DELIVERABLES_COMMENTS_TABLE,
                json: true,
                limit: 1000,
            });
            let deliverables = delivs.rows;
            if(statusComments.rows.length){
                deliverables = delivs.rows.map((deliverable, index) => {return {...deliverable, status_comment: statusComments.rows[index].status_comment};});
            }
            console.log(deliverables, statusComments);
            setDeliverables(deliverables);
        } catch (e){
            console.log(e);
        }
    }

    useEffect(()=>{
        getDeliverablesData();
        // eslint-disable-next-line
    },[props.proposal]);

    function filterDeliverables(deliverable){
        if(!statusList){
            return true;
        } else if (!Array.isArray(statusList)){
            return (statusList === deliverable.status)
        } else if (!statusList.length){
            return true
        }else {
            return (statusList.includes(deliverable.status))
        }
    }

    function updateStatusList (newList){
        setStatusList(newList);
    }

    let filteredDeliverables = deliverables.filter(filterDeliverables);


    return (
        <div className="deliverablesList">
            <div className="deliverablesList__title">
                <h2>Deliverables</h2>
                <div className="deliverablesList__completed">{props.proposal.deliverables_completed}
                    <span className="deliverablesList__total">
                        /{props.proposal.deliverables} {props.proposal.deliverables_completed > 1 ? 'are' : 'is'} completed
                    </span>
                </div>
            </div>
            <RenderFilter
                title="Filter deliverables by their status"
                currentList={statusList}
                fullList={globals.DELIVERABLES_STATUS_KEYS}
                updateCurrentList={updateStatusList}
                readableNameDict={readableDeliverableStatus}
            />
            {filteredDeliverables.map((deliverable) => {
                return(
                    <div key={deliverable.deliverable_id} className="single-deliverable mt-5">
                        <RenderSingleDeliverable
                            activeUser={props.activeUser}
                            isAdmin={props.isAdmin}
                            proposal={props.proposal}
                            deliverable={deliverable}
                            rerunProposalQuery={props.rerunProposalQuery}
                            showAlert={props.showAlert}
                        />
                    </div>
                )
            })}
        </div>
    );
}