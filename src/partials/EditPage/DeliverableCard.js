import React, { useRef, useState, useEffect } from "react";
import { useDrag, useDrop } from "react-dnd";
import { Overlay, Popover } from 'react-bootstrap';
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
    isLast, totalRequestedErrorMessage,
    hasShownTooltip}) => {
    const ref = useRef(null);
    const [refreshComponent, setRefreshComponent] = useState(0);
    const [show, setShow] = useState(false);
    const [target, setTarget] = useState(null);


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
        validator.message('requested', deliverable.requested_amount, 'required|min:0.00000001,num');
        validator.message('recipient', deliverable.recipient, "required");
        validator.message('small description', deliverable.small_description, 'required');
        validator.message('days to complete', deliverable.days_to_complete, 'required');
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
    const descriptionErrorMessage = validator.message('small description', deliverable.small_description, 'required')
    const daysToCompleteErrorMessage = validator.message('days to complete', deliverable.days_to_complete, 'required')

    function handleClick (event) {
        if (!hasShownTooltip() && !show) {
            setShow(true);
            setTarget(event.target);
        } else if (hasShownTooltip() && show) {
            setShow(false);
            setTarget(event.target);
        }
    }
    return (
        <div
            className={`${
                !validator.allValid() && showValidatorMessages
                    ? 'deliverableCard deliverableCard--error'
                    : 'deliverableCard'
            }`}
            ref={ref}
            style={{ ...style, opacity }}
            onClick={handleClick}
        >
            <Overlay show={show} target={target} placement="top" container={ref.current} containerPadding={20}>
                <Popover id="popover-contained" className="deliverableCard__popover">
                    <Popover.Title as="h3">You can drag your deliverables</Popover.Title>
                    <Popover.Content>
                        Using your <strong>cursor</strong> your can rearrange your deliverables' order by dragging them to the desired position.
                    </Popover.Content>
                </Popover>
            </Overlay>
            <div className="deliverableCard__actions">
                <button className="button button--text" onClick={() => removeCard(index)}>
                    Remove this deliverable
                </button>
                <button
                    className="deliverableCard__arrow"
                    disabled={index === 0}
                    onClick={() => moveCard(index, index - 1)}
                >
                    <ArrowIcon />
                </button>
                <button
                    className="deliverableCard__arrow deliverableCard__arrow--down"
                    disabled={isLast}
                    onClick={() => moveCard(index, index + 1)}
                >
                    <ArrowIcon />
                </button>
            </div>
            <div className="deliverableCard__fieldset">
                <label className="input__label">Requested WAX</label>
                <input
                    className={`${
                        requestedErrorMessage || totalRequestedErrorMessage ? 'input input--error' : 'input'
                    }`}
                    type="number"
                    name="requested_amount"
                    placeholder="0"
                    value={deliverable.requested_amount}
                    onChange={(event) => updateCard(event, index)}
                />
                <div className="input__errorMessage">
                    {requestedErrorMessage}
                    {totalRequestedErrorMessage}
                </div>
            </div>
            <div className="deliverableCard__fieldset">
                <label className="input__label">Recipient</label>
                <input
                    type="text"
                    className={`${recipientErrorMessage ? 'input input--error' : 'input'}`}
                    name="recipient"
                    value={deliverable.recipient}
                    onChange={(event) => updateCard(event, index)}
                />
                <div className="input__errorMessage">{recipientErrorMessage}</div>
            </div>
            <div className="deliverableCard__fieldset">
                <label className="input__label">Small Description</label>
                <input
                    type="text"
                    className={`${descriptionErrorMessage ? 'input input--error' : 'input'}`}
                    name="small_description"
                    value={deliverable.small_description}
                    onChange={(event) => updateCard(event, index)}
                />
                <div className="input__errorMessage">{descriptionErrorMessage}</div>
            </div>
            <div className="deliverableCard__fieldset">
                <label className="input__label">Amount of days to complete</label>
                <input
                    className={`${daysToCompleteErrorMessage ? 'input input--error' : 'input'}`}
                    type="number"
                    name="days_to_complete"
                    placeholder="0"
                    value={deliverable.days_to_complete}
                    onChange={(event) => updateCard(event, index)}
                />
                <div className="input__errorMessage">{daysToCompleteErrorMessage}</div>
            </div>
        </div>
    );
};