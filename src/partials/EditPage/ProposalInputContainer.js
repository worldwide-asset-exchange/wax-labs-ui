import React, {useState, useEffect} from 'react'

import SimpleReactValidator from 'simple-react-validator';
import RenderLoadingPage from '../LoadingPage';
import * as GLOBAL_VARS from '../../utils/vars';

const validator = new SimpleReactValidator();

export default function RenderProposalInputContainer ({proposal, hideTotalRequested, showValidatorMessages, updateValidatorData, updateEditableProposal, queryingProposal, activeUser, totalRequestedFunds, categories}) {

    const [editableProposal, setEditableProposal] = useState({
        title:"",
        description:"",
        content:"",
        proposer:"",
        image_url:"",
        estimated_time:"",
        category: "",
    });

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
        // eslint-disable-next-line
    }, [totalRequestedFunds]);

    useEffect(()=>{
        updateEditableProposal(editableProposal);
        // eslint-disable-next-line
    }, [editableProposal]);

    if(queryingProposal){
        return <RenderLoadingPage/>
    }
    
    const totalRequestedErrorMessage = validator.message('total requested', totalRequested, `min:${GLOBAL_VARS.PROPOSAL_MIN_REQUESTED},num|max:${GLOBAL_VARS.PROPOSAL_MAX_REQUESTED},num`); 
    const titleErrorMessage = validator.message('title', editableProposal.title, `required|max:${GLOBAL_VARS.MAX_TITLE_LENGTH}`);
    const descriptionErrorMessage = validator.message('description', editableProposal.description, `required|max:${GLOBAL_VARS.MAX_DESCRIPTION_LENGTH}`);
    const imageUrlErrorMessage = validator.message('image url', editableProposal.image_url, `required|max:${GLOBAL_VARS.MAX_IMGURL_LENGTH}`);
    const contentErrorMessage = validator.message('content', editableProposal.content, `required|max:${GLOBAL_VARS.MAX_BODY_LENGTH}`);
    const categoryErrorMessage = validator.message('category', editableProposal.category, "required");
    const estimatedTimeErrorMessage = validator.message('estimated time', editableProposal.estimated_time, "required|min:1,num");
    
    return(
        <div style={{color:"white"}}>
            {
                !hideTotalRequested ? 
                <div>
                    <div className={`${totalRequestedErrorMessage ? "with-error" : ""}`}>
                        Total Requested: {totalRequested} 
                    </div>                    
                    <div style={{backgroundColor: "red"}}>
                        {totalRequestedErrorMessage}
                    </div>  
                </div>
                : ""
            }
            <div>
                title {editableProposal.title.length}
                <input 
                    className={`${titleErrorMessage ? "input-with-error" : ""}`}
                    value={editableProposal.title}
                    name="title" 
                    onChange={handleInputChange}  
                />
                <div style={{backgroundColor: "red"}}>
                    {titleErrorMessage}
                </div>  
            </div>
            <div>
                description {editableProposal.description.length}
                <input 
                    className={`${descriptionErrorMessage ? "input-with-error" : ""}`}
                    value={editableProposal.description}
                    name="description" 
                    onChange={handleInputChange}  
                />
                <div style={{backgroundColor: "red"}}>
                    {descriptionErrorMessage}
                </div>                  
            </div>
            <div>
                Image URL {editableProposal.image_url.length}
                <input 
                    className={`${imageUrlErrorMessage ? "input-with-error" : ""}`}
                    value={editableProposal.image_url}
                    name="image_url" 
                    onChange={handleInputChange}  
                />
                <div style={{backgroundColor: "red"}}>
                    {imageUrlErrorMessage}
                </div>                  
            </div>
            <div>
                content {editableProposal.content.length}
                <textarea 
                    className={`${contentErrorMessage ? "text-area-with-error" : ""}`}
                    value={editableProposal.content}
                    name="content" 
                    onChange={handleInputChange}  
                />
                <div style={{backgroundColor: "red"}}>
                    {contentErrorMessage}
                </div>                 
            </div>
            <div>
                estimated time (days)
                <input
                    className={`${estimatedTimeErrorMessage ? "input-with-error" : ""}`}
                    type="number" 
                    value={editableProposal.estimated_time}
                    name="estimated_time" 
                    onChange={handleInputChange}  
                />
                <div style={{backgroundColor: "red"}}>
                    {estimatedTimeErrorMessage}
                </div> 
            </div>
            <div>
                category
                <select
                    className={`${categoryErrorMessage ? "select-with-error" : ""}`} 
                    style={{color:"white"}} 
                    value={categories[editableProposal.category]} 
                    name="category" 
                    onChange={handleInputChange}
                >
                    <option value={""}></option>
                    {categories.map((category) =>{
                        return <option style={{color:"black"}} key={category} value={category}>{category}</option>
                    })}
                </select>
                <div style={{backgroundColor: "red"}}>
                    {categoryErrorMessage}
                </div> 
                
            </div>

        </div>
    )
}