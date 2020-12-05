import React, {useEffect, useState, useRef} from 'react';
import {useParams} from 'react-router-dom';
import ReactTags from 'react-tag-autocomplete';
import * as waxjs from "@waxio/waxjs/dist";
import RenderSingleDeliverable from "./SingleDeliverable"

import './ReactTags.css'

const wax = new waxjs.WaxJS(process.env.REACT_APP_WAX_RPC, null, null, false);

const readableDeliverableStatus = {
    drafting: "Draft",
    reported: "Reported",
    accepted: "Accepted",
    inprogress: "In progress",
    claimed: "Claimed",
    rejected: "Rejected",
}


const tagsObject = {};
const allTag = {id: "all", name: "All"};
const suggestions = [];

function addEntriesToList(list){
    Object.entries(tagsObject).forEach(([key, value]) => {
        list.push(value);
    }); 
};

function setup(){
    Object.entries(readableDeliverableStatus).forEach(([id, name]) => {
        tagsObject[id] = {id: id, name: name};
    });    

    addEntriesToList(suggestions);
    suggestions.push(allTag);
}
setup();


export default function RenderDeliverableList(props){
    const {id} = useParams();
    const [deliverables, setDeliverables] = useState([]);
    const [tags, setTags] = useState([]);
    const inputRef = useRef(null);

    async function getDeliverablesData(){
        try{
            let delivs = await wax.rpc.get_table_rows({
                code: 'labs',
                scope: id,
                table: 'deliverables',
                json: true,
                limit: 1000,
            });
            setDeliverables(delivs.rows);
        } catch (e){
            console.log(e);
        }
    }

    useEffect(()=>{
        getDeliverablesData();
        // eslint-disable-next-line
    },[props.proposal]);

    function onTagAddition(tag){
        let tempTags = tags.slice(0);
        if(tempTags.includes(allTag)){
            // If allTag is in there, remove it.
            tempTags.splice(tempTags.indexOf(allTag), 1);
        }
        if(tag.id === "all"){
            // If the allTag was added, remove all other tags from the list.
            tempTags = [tag];
        }
        // Only add tag, if it is not inside the array.
        else if(!tags.includes(tag)){
            tempTags = [].concat(tempTags, tag);
        }
        else {
            return;
        }
        setTags(tempTags);
    }
    function onDeleteTag(index){        
        let tempTags = tags.slice(0);
        if(!tempTags[index]){
            return
        }
        if(tempTags[index].id === "all"){
            // If the allTag was removed, add all other tags to the list.
            tempTags = [];
            addEntriesToList(tempTags, readableDeliverableStatus);  
        }
        else {
            tempTags.splice(index, 1);
        }
        setTags(tempTags);
    }

    function filterDeliverables(deliverable){
        // If no tags where added, it means no filters.
        if(tags.length === 0){
            return true;
        }
        // If tags includes the allTag, it also means no filters.
        if(tags.includes(allTag)){
            return true
        }
        // If there is at least one tag in the list, 
        // return true if it is included in the tags list, false otherwise.
        return tags.includes(tagsObject[deliverable.status])
    }


    let filteredDeliverables = deliverables.filter(filterDeliverables);
 

    return (
        <div className="deliverable-list">
            <h1>Deliverables ({props.proposal.deliverables_completed}/{props.proposal.deliverables})</h1>
            <ReactTags
                ref={inputRef}
                tags={tags}
                suggestions={suggestions}
                onDelete={onDeleteTag}
                onAddition={onTagAddition}
                minQueryLength={1}
                allowNew={false}
                placeholderText="Add status to filter the deliverables"
                noSuggestionsText="Invalid status"
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