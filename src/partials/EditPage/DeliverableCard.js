import React, { useRef, useState, useEffect } from "react";
import { useDrag, useDrop } from "react-dnd";
import { ItemTypes } from "./ItemTypes";
import SimpleReactValidator from 'simple-react-validator';


const validator = new SimpleReactValidator();

const style = {
    border: "1px dashed gray",
    padding: "0.5rem 1rem",
    marginBottom: ".5rem",
    backgroundColor: "white",
    cursor: "move"
};
export const RenderDeliverableCard = ({
    id, text, showValidatorMessages, 
    updateDeliverablesValidation, 
    index, moveCard, updateCard, 
    deliverable, removeCard,
    isLast}) => {
    const ref = useRef(null);
    const [refreshComponent, setRefreshComponent] = useState(0);

    const [, drop] = useDrop({
        accept: ItemTypes.CARD,
        hover(item, monitor) {
            if (!ref.current) {
                return;
            }
            const dragIndex = item.index;
            const hoverIndex = index;
            // Don't replace items with themselves
            if (dragIndex === hoverIndex) {
                return;
            }
            // Determine rectangle on screen
            // const hoverBoundingRect = ref.current?.getBoundingClientRect();
            // Get vertical middle
            // const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
            // Determine mouse position
            // const clientOffset = monitor.getClientOffset();
            // Get pixels to the top
            // const hoverClientY = clientOffset.y - hoverBoundingRect.top;
            // Only perform the move when the mouse has crossed half of the items height
            // When dragging downwards, only move when the cursor is below 50%
            // When dragging upwards, only move when the cursor is above 50%
            // Dragging downwards
            // if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
            //     return;
            // }
            // // Dragging upwards
            // if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
            //     return;
            // }
            // Time to actually perform the action
            moveCard(dragIndex, hoverIndex);
            // Note: we're mutating the monitor item here!
            // Generally it's better to avoid mutations,
            // but it's good here for the sake of performance
            // to avoid expensive index searches.
            item.index = hoverIndex;
        }
    });

    const [{ isDragging }, drag] = useDrag({
        item: { type: ItemTypes.CARD, id, index },
        collect: (monitor) => ({
            isDragging: monitor.isDragging()
        })
    });

    const opacity = isDragging ? 0.5 : 1;

    useEffect(()=>{
        // For some unknown reason validator is acting up unless I redo the validator.message in here.
        validator.message('requested', deliverable.requested_amount, 'required|min:0.00000001,num') 
        validator.message('recipient', deliverable.recipient, "required")
        updateDeliverablesValidation(deliverable.id, validator.allValid())
        // eslint-disable-next-line
    }, [deliverable]);

    useEffect(()=>{
        if(showValidatorMessages){
            validator.showMessages();
            setRefreshComponent(refreshComponent + 1);
        }
        // eslint-disable-next-line
    }, [showValidatorMessages]);

    drag(drop(ref));
    // validator.showMessages();
    const requestedErrorMessage = validator.message('requested', deliverable.requested_amount, 'required|min:0.00000001,num') 
    const recipientErrorMessage = validator.message('recipient', deliverable.recipient, "required")
    return (
        <div 
            className={`${((!validator.allValid()) && (showValidatorMessages)) ? "with-error" : ""}`} 
            ref={ref} 
            style={{ ...style, opacity }}
        >
            <button className="btn" disabled={index === 0}>^</button>
            <div>
                Requested WAX
                <input 
                    type="number"
                    name="requested_amount"
                    placeholder="0"
                    value={deliverable.requested_amount}
                    onChange={(event)=>updateCard(event, index)}
                />
                <div style={{backgroundColor: "red"}}>
                    {requestedErrorMessage}
                </div>  
            </div>
            <div>
                Recipient
                <input 
                    type="text"
                    name="recipient"
                    value={deliverable.recipient}
                    onChange={(event)=>updateCard(event, index)}
                />
                <div style={{backgroundColor: "red"}}>
                    {recipientErrorMessage}
                </div> 
            </div>
            <div>{index + 1}) {(deliverable.requested_amount ? deliverable.requested_amount.toFixed(8) : "0.00000000") + " WAX"}</div>
            <button 
                className='btn' 
                onClick={()=>removeCard(index)}
            >
                Remove
            </button>
            <div>
                <button className='btn' disabled={isLast} onClick={()=>moveCard(index, index+1)}>v</button>
            </div>
        </div>
    );
};