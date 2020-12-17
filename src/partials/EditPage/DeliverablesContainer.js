import React, { useState, useCallback, useEffect } from 'react';
import {useParams} from 'react-router-dom';
import update from 'immutability-helper';
import * as waxjs from "@waxio/waxjs/dist";

import { RenderDeliverableCard } from './DeliverableCard';
import { randomEosioName } from '../../utils/util'; 
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

    useEffect(()=>{
        if(props.proposal){
            getDeliverablesData();
        }
        // eslint-disable-next-line
    }, [props.proposal]);

    useEffect(()=>{
        if(deliverables){
            let copyDeliverables = [...deliverables];
            copyDeliverables = copyDeliverables.map((deliverable, index)=>{
                deliverable.id = randomEosioName();
                return deliverable
            });
            setEditableDeliverables(copyDeliverables);
        }
        // eslint-disable-next-line
    }, [deliverables])

    useEffect(()=>{
        props.updateDeliverablesLists({toAdd:[...editableDeliverables], toRemove:[...deliverables]})
        
        // eslint-disable-next-line
    },[editableDeliverables])

    function alertMaxDeliverables(){
        props.showAlert({...GLOBAL_ALERTS.TOO_MANY_DELIVERABLES_ALERT_DICT.WARN})

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
            requested: (deliverables.length + 1).toFixed(8) + " WAX"
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
            setDeliverables(delivs.rows);
        } catch (e){
            console.log(e);
        }
        props.runningQuery(false);
    }

    const removeCard = useCallback((index)=>{
        setEditableDeliverables(update(editableDeliverables, {
            $splice: [
                [index, 1],
            ],
        }));
    }, [editableDeliverables]);

    const moveCard = useCallback((dragIndex, hoverIndex) => {
        const dragCard = editableDeliverables[dragIndex];
        setEditableDeliverables(update(editableDeliverables, {
            $splice: [
                [dragIndex, 1],
                [hoverIndex, 0, dragCard],
            ],
        }));
    }, [editableDeliverables]);
    const renderCard = (deliverable, index) => {
        return (
            <RenderDeliverableCard 
                key={deliverable.id} 
                index={index} 
                id={deliverable.id} 
                text={(index + 1) + ") " + deliverable.requested} 
                deliverable={deliverable} 
                removeCard={removeCard} 
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