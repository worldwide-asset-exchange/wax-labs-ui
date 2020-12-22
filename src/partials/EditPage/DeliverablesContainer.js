import React, { useState, useCallback, useEffect } from 'react';
import {useParams} from 'react-router-dom';
import update from 'immutability-helper';
import * as waxjs from "@waxio/waxjs/dist";

import { RenderDeliverableCard } from './DeliverableCard';
import { randomEosioName, requestedAmountToFloat } from '../../utils/util'; 
import * as GLOBAL_VARS from '../../utils/vars';
import * as GLOBAL_ALERTS from '../../utils/alerts';


const wax = new waxjs.WaxJS(process.env.REACT_APP_WAX_RPC, null, null, false);

const style = {
    width: 400,
};

export const RenderDeliverablesContainer = (props) => {

    const {id} = useParams();

    // We need one set of them to have a copy of the state of the table deliverables
    // because we are going to use it on the save draft step.
    const [deliverables, setDeliverables] = useState([]);

    // Another set for the editable ones (the ones the user will update/re order).
    const [editableDeliverables, setEditableDeliverables] = useState([]);

    // dict to keep track of validation. The reason I did not go for a list
    // is that since deliverables can get reordered, I was afraid having to
    // also reorder this list every time the other one got reorded
    // could get messy/hard to maintain.
    const [deliverablesValidation, setDeliverablesValidation] = useState({});

    useEffect(()=>{
        if(props.proposal){
            getDeliverablesData();
        }
        // eslint-disable-next-line
    }, [props.proposal]);

    useEffect(()=>{
        if(deliverables){
            let copyDeliverables = [...deliverables];
            let deliverablesValidation = {};
            copyDeliverables = copyDeliverables.map((deliverable, index)=>{
                // we create/store a unique (at least very hard to collide) id.
                deliverable.id = randomEosioName();
                // we use this id as key, in the deliverablesValidation dict. 
                deliverablesValidation[deliverable.id] = true;
                return deliverable
            });
            // we set the deliverablesValidation dict.
            setDeliverablesValidation(deliverablesValidation);
            setEditableDeliverables(copyDeliverables);
        }
        // eslint-disable-next-line
    }, [deliverables])

    useEffect(()=>{
        // We update the parent state with local deliverables information (we are removing the old ones
        // adding the new ones)
        props.updateDeliverablesLists({toAdd:[...editableDeliverables], toRemove:[...deliverables]})
        // eslint-disable-next-line
    },[editableDeliverables]);

    useEffect(()=>{
        let allValid = true;
        // If any of them is false, all valid will be false
        // because of agregating &&
        for(var [,value] of Object.entries(deliverablesValidation)){
            allValid = allValid && value;
        }
        // update parent state
        props.updateDeliverablesValidation(allValid);
        // eslint-disable-next-line
    }, [deliverablesValidation])

    function alertMaxDeliverables(){
        props.showAlert({...GLOBAL_ALERTS.TOO_MANY_DELIVERABLES_ALERT_DICT.WARN})
    }

    function updateDeliverablesValidation(id, isValid){
        let deliverablesValidationCopy = {...deliverablesValidation};
        deliverablesValidationCopy[id] = isValid;
        setDeliverablesValidation(deliverablesValidationCopy);
    }

    function createNewDeliv(){
        let deliverables = [...editableDeliverables]
        if(deliverables.length >= GLOBAL_VARS.MAX_DELIVERABLES){
            alertMaxDeliverables();
            return;
        }
        let deliverable = {
            id: randomEosioName(),
            recipient: props.activeUser.accountName,
            requested_amount: ""
        }
        deliverables.push(deliverable);
        setEditableDeliverables(deliverables);
    }


    async function getDeliverablesData(){
        props.runningQuery(true);
        try{
            let delivs = await wax.rpc.get_table_rows({
                code: GLOBAL_VARS.LABS_CONTRACT_ACCOUNT,
                scope: id,
                table: GLOBAL_VARS.DELIVERABLES_TABLE,
                json: true,
                limit: 1000,
            });
            let deliverables = [...delivs.rows];
            deliverables = deliverables.map(deliverable => {
                deliverable.requested_amount = requestedAmountToFloat(deliverable.requested);
                return deliverable 
            })
            setDeliverables(deliverables);
        } catch (e){
            console.log(e);
        }
        props.runningQuery(false);
    }


    function updateDeliverable(event, index){
        const updatedDeliverable = {...editableDeliverables[index]};
        updatedDeliverable[event.target.name] = event.target.value;
        if(event.target.type === "number"){
            if(event.target.value !== ""){
                updatedDeliverable[event.target.name] = parseFloat(event.target.value);
            }
        }
        // chang it for his updated version
        setEditableDeliverables(update(editableDeliverables, {
            $splice: [
                [index, 1, updatedDeliverable],
            ],
        }));
    }

    const removeCard = useCallback((index)=>{
        setEditableDeliverables(update(editableDeliverables, {
            $splice: [
                [index, 1],
            ],
        }));
    }, [editableDeliverables]);

    const moveCard = useCallback((dragIndex, hoverIndex) => {
        const deliverable = editableDeliverables[dragIndex];
        setEditableDeliverables(update(editableDeliverables, {
            $splice: [
                [dragIndex, 1],
                [hoverIndex, 0, deliverable],
            ],
        }));
    }, [editableDeliverables]);

    const renderCard = (deliverable, index) => {
        return (
            <RenderDeliverableCard
                key={deliverable.id}
                isLast={index === (editableDeliverables.length - 1)} 
                index={index} 
                id={deliverable.id} 
                text={(index + 1) + ") " + deliverable.requested}
                showValidatorMessages={props.showValidatorMessages} 
                deliverable={deliverable} 
                removeCard={removeCard}
                updateDeliverablesValidation={updateDeliverablesValidation}
                updateCard={updateDeliverable} 
                moveCard={moveCard}
            />);
    };
    return (
        <div>
            {props.queryingDeliverables ? 
                "Loading..."
            :
                <>                
                    <div style={style}>{editableDeliverables.map((deliverable, i) => renderCard(deliverable, i))}</div>
                    <button className="btn" onClick={createNewDeliv}>Add new deliverable</button>
                </>
            }
        </div>
    );
    
};