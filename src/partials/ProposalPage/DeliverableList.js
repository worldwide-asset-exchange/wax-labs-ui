import React, {useEffect, useState} from 'react';
import {Link, useParams} from 'react-router-dom';
import * as waxjs from "@waxio/waxjs/dist";
import RenderSingleDeliverable from "./SingleDeliverable"


const wax = new waxjs.WaxJS(process.env.REACT_APP_WAX_RPC, null, null, false);
const statusList = [
    "drafting",
    "reported",
    "accepted",
    "inprogress",
    "claimed",
    "rejected"
]
const readableStatusName = {
    drafting: "Draft",
    reported: "Reported",
    accepted: "Accepted",
    inprogress: "In progress",
    claimed: "Claimed",
    rejected: "Rejected",
}

export default function RenderDeliverableList(props){
    const {id} = useParams();
    const [deliverables, setDeliverables] = useState([]);
    const [displayDeliverables, setDisplayDeliverables] = useState([]);

    const [filtersChecked, setFiltersChecked] = useState({
        drafting: true,
        reported: true,
        accepted: true,
        inprogress: true,
        claimed: true,
        rejected: true,
    });
    async function getDeliverablesData(){
        try{
            let delivs = await wax.rpc.get_table_rows({
                code: 'labs',
                scope: id,
                table: 'deliverables',
                json: true,
                limit: 1000,
            });
            console.log(delivs.rows);
            setDeliverables(delivs.rows);
        } catch (e){
            console.log(e);
        }
    }

    useEffect(()=>{
        getDeliverablesData();
    },[props.proposal]);

    function handleCheckBoxChange(event){
        console.log(event.target.checked);
        let currentStatus = event.target.checked;
        let currentFiltersChecked = {...filtersChecked};
        currentFiltersChecked[event.target.name] = currentStatus;
        setFiltersChecked(currentFiltersChecked);
    }


    let filteredDeliverables = deliverables.filter(deliverable => filtersChecked[deliverable.status])
    
    console.log(filtersChecked);

    return (
        <div className="deliverable-list">
            <h1>Deliverables ({props.proposal.deliverables_completed}/{props.proposal.deliverables})</h1>
            <p><strong>Filters:</strong></p>

            {statusList.map((status, index) => {
                console.log(filtersChecked[status]);
                return(
                    <div key={index}>
                        <label>{readableStatusName[status]}</label>
                        <input 
                            type="checkbox" 
                            name={status}
                            onChange={handleCheckBoxChange}
                            checked={filtersChecked[status]}
                        />
                    </div>           
                )

            })}
            

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