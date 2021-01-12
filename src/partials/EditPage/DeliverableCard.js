import React, { useRef, useState, useEffect } from "react";
import { useDrag, useDrop } from "react-dnd";
import { ItemTypes } from "./ItemTypes";
import SimpleReactValidator from 'simple-react-validator';
import ArrowIcon from '../../icons/ArrowIcon';

import './DeliverableCard.scss';

const validator = new SimpleReactValidator();

const style = {
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

            // Time to perform the action
            // moveCard is a function passed through props.
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
            className={`${((!validator.allValid()) && (showValidatorMessages)) ? "deliverableCard deliverableCard--error" : "deliverableCard"}`}
            ref={ref}
            style={{ ...style, opacity }}
        >
            <div className="deliverableCard__actions">
                <button
                    className='button button--text'
                    onClick={()=>removeCard(index)}
                >
                    Remove this deliverable
                </button>
                <button className="deliverableCard__arrow" disabled={index === 0}>
                    <ArrowIcon/>
                </button>
                <button className='deliverableCard__arrow deliverableCard__arrow--down' disabled={isLast} onClick={()=>moveCard(index, index+1)}>
                    <ArrowIcon/>
                </button>
            </div>
            <div className="deliverableCard__fieldset">
                <label className="input__label">Requested WAX</label>
                <input
                    className={`${requestedErrorMessage ? "input input--error" : "input"}`}
                    type="number"
                    name="requested_amount"
                    placeholder="0"
                    value={deliverable.requested_amount}
                    onChange={(event)=>updateCard(event, index)}
                />
                <div className="input__errorMessage">
                    {requestedErrorMessage}
                </div>
            </div>
            <div className="deliverableCard__fieldset">
                <label className="input__label">Recipient</label>
                <input
                    type="text"
                    className={`${recipientErrorMessage ? "input input--error" : "input"}`}
                    name="recipient"
                    value={deliverable.recipient}
                    onChange={(event)=>updateCard(event, index)}
                />
                <div className="input__errorMessage">
                    {recipientErrorMessage}
                </div>
            </div>
        </div>
    );
};