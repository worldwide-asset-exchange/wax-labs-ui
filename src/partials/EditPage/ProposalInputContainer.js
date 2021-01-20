import React, {useState, useEffect} from 'react'

import SimpleReactValidator from 'simple-react-validator';
import RenderLoadingPage from '../LoadingPage';
import * as GLOBAL_VARS from '../../utils/vars';

import './ProposalInputContainer.scss';

const validator = new SimpleReactValidator();

export default function RenderProposalInputContainer ({proposal, deprecatedCategories, hideTotalRequested, showValidatorMessages, updateValidatorData, updateEditableProposal, queryingProposal, activeUser, totalRequestedFunds, categories, updateTotalRequestedErrorMessage}) {

    const [editableProposal, setEditableProposal] = useState({
        title:"",
        description:"",
        content:"",
        proposer:"",
        image_url:"",
        estimated_time:"",
        category: "",
    });

    const [availableCategories, setAvailableCategories] = useState([]);

    const [totalRequested, setTotalRequested] = useState(Number(0).toFixed(8) + ' WAX')

    const [refreshPage, setRefreshPage] = useState(0);

    function handleInputChange(event){
        let value = event.target.value;
        let name = event.target.name;
        let proposalCopy = {...editableProposal};
        proposalCopy[name] = value;
        setEditableProposal(proposalCopy);

    }

    
    useEffect(()=>{
        function filterDeprecated(category) {
            return !deprecatedCategories.includes(category);
        }
        let availableCategories = [...categories];
        availableCategories = availableCategories.filter(filterDeprecated);
        setAvailableCategories(availableCategories);

    }, [categories, deprecatedCategories]);

    useEffect(()=>{
        updateValidatorData(validator.allValid());
        
        // eslint-disable-next-line
    }, [editableProposal, totalRequested])

    useEffect(()=>{
        setRefreshPage(refreshPage + 1);
        if(showValidatorMessages){
            validator.showMessages();
        }
        else{
            validator.hideMessages();
        }
        // eslint-disable-next-line
    }, [showValidatorMessages]);

    useEffect(()=>{
        setEditableProposal({...editableProposal, ...proposal});
        // eslint-disable-next-line
    }, [proposal]);


    useEffect(()=>{
        let totalRequested = totalRequestedFunds.toFixed(8) + " WAX"
        setTotalRequested(totalRequested);
        
        // Some components don't pass this callback, so only use it if it was passed.
        if(updateTotalRequestedErrorMessage){
            updateTotalRequestedErrorMessage(validator.message('total requested', totalRequestedFunds, `max:${GLOBAL_VARS.PROPOSAL_MAX_REQUESTED},num|min:${GLOBAL_VARS.PROPOSAL_MIN_REQUESTED},num`));
        }
        // eslint-disable-next-line
    }, [totalRequestedFunds, showValidatorMessages]);

    useEffect(()=>{
        updateEditableProposal(editableProposal);
        // eslint-disable-next-line
    }, [editableProposal]);

    if(queryingProposal){
        return <RenderLoadingPage/>
    }

    const titleErrorMessage = validator.message('title', editableProposal.title, `required|max:${GLOBAL_VARS.MAX_TITLE_LENGTH}`);
    const descriptionErrorMessage = validator.message('description', editableProposal.description, `required|max:${GLOBAL_VARS.MAX_DESCRIPTION_LENGTH}`);
    const imageUrlErrorMessage = validator.message('image url', editableProposal.image_url, `required|max:${GLOBAL_VARS.MAX_IMGURL_LENGTH}`);
    const contentErrorMessage = validator.message('content', editableProposal.content, `required|max:${GLOBAL_VARS.MAX_BODY_LENGTH}`);
    const categoryErrorMessage = validator.message('category', editableProposal.category, "required");
    const estimatedTimeErrorMessage = validator.message('estimated time', editableProposal.estimated_time, "required|min:1,num");
    
    return(
        <div className="proposalInputContainer">
            <div className="proposalInputContainer__fieldset">
                <label className="input__label">Title
                    <span className={`proposalInputContainer__charAmount ${editableProposal.title.length > GLOBAL_VARS.MAX_TITLE_LENGTH ? "proposalInputContainer__charAmount--error" : ""}`}> {editableProposal.title.length}/{GLOBAL_VARS.MAX_TITLE_LENGTH}
                    </span>
                </label>
                <input
                    className={`${titleErrorMessage ? "input input--error" : "input"}`}
                    value={editableProposal.title}
                    name="title"
                    onChange={handleInputChange}
                />
                <div className="input__errorMessage">
                    {titleErrorMessage}
                </div>
            </div>
            <div className="proposalInputContainer__fieldset">
                <label className="input__label">Description
                    <span className={`proposalInputContainer__charAmount ${editableProposal.description.length > GLOBAL_VARS.MAX_DESCRIPTION_LENGTH ? "proposalInputContainer__charAmount--error" : ""}`}> {editableProposal.description.length}/{GLOBAL_VARS.MAX_DESCRIPTION_LENGTH}
                    </span>
                </label>
                <input
                    className={`${descriptionErrorMessage ? "input input--error" : "input"}`}
                    value={editableProposal.description}
                    name="description"
                    onChange={handleInputChange}
                />
                <div className="input__errorMessage">
                    {descriptionErrorMessage}
                </div>
            </div>
            <div className="proposalInputContainer__fieldset">
                <label className="input__label">
                    Image URL
                    <span className={`proposalInputContainer__charAmount ${editableProposal.image_url.length > GLOBAL_VARS.MAX_IMGURL_LENGTH ? "proposalInputContainer__charAmount--error" : ""}`}> {editableProposal.image_url.length}/{GLOBAL_VARS.MAX_IMGURL_LENGTH}
                    </span>
                </label>
                <input
                    className={`${imageUrlErrorMessage ? "input input--error" : "input"}`}
                    value={editableProposal.image_url}
                    name="image_url"
                    onChange={handleInputChange}
                />
                <div className="input__errorMessage">
                    {imageUrlErrorMessage}
                </div>
            </div>
            <div className="proposalInputContainer__fieldset">
                <label className="input__label">Content
                    <span className={`proposalInputContainer__charAmount ${editableProposal.content.length > GLOBAL_VARS.MAX_BODY_LENGTH ? "proposalInputContainer__charAmount--error" : ""}`}> {editableProposal.content.length}/{GLOBAL_VARS.MAX_BODY_LENGTH}
                    </span>
                </label>
                <textarea
                    className={`${contentErrorMessage ? "textarea textarea--error" : "textarea"}`}
                    value={editableProposal.content}
                    name="content"
                    onChange={handleInputChange}
                />
                <div className="input__errorMessage">
                    {contentErrorMessage}
                </div>
            </div>
            <div className="proposalInputContainer__fieldset">
                <label className="input__label">Estimated time (days)</label>
                <input
                    className={`${estimatedTimeErrorMessage ? "input input--error" : "input"}`}
                    type="number"
                    value={editableProposal.estimated_time}
                    name="estimated_time"
                    onChange={handleInputChange}
                />
                <div className="input__errorMessage">
                    {estimatedTimeErrorMessage}
                </div>
            </div>
            <div className="proposalInputContainer__fieldset">
                <label className="input__label">Category</label>
                <select
                    className={`${categoryErrorMessage ? "select select--error" : "select"}`}
                    value={categories[editableProposal.category]}
                    name="category"
                    onChange={handleInputChange}
                >
                    <option value={""}></option>
                    {availableCategories.map((category) =>{
                        return <option className="select__option" key={category} value={category}>{category}</option>
                    })}
                </select>
                <div className="input__errorMessage">
                    {categoryErrorMessage}
                </div>
            </div>
            {
                !hideTotalRequested ?
                <div className="proposalInputContainer__fieldset">
                    <div className="input__label">Total amount requested</div>
                    <h4>{totalRequested}</h4>
                </div>
                : ""
            }
        </div>
    )
}