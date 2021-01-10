import React, {useState, useEffect} from 'react';
import SimpleReactValidator from 'simple-react-validator';

import * as GLOBAL_VARS from '../../../utils/vars';

const validator = new SimpleReactValidator();


export default function RenderProfileInputContainer (props) {

    const [editableProfile, setEditableProfile] = useState({
        bio: "",
        contact: "",
        country: "",
        full_name: "",
        image_url: "",
        website: "",
        wax_account: "",
    });

    const [refreshPage, setRefreshPage] = useState(0);

    function handleInputChange(event){
        let value = event.target.value;
        let name = event.target.name;
        let profileCopy = {...editableProfile};
        profileCopy[name] = value;
        setEditableProfile(profileCopy);
    }

    useEffect(()=>{
        props.updateValidatorData(validator.allValid());
        // eslint-disable-next-line
    }, [editableProfile])

    useEffect(()=>{
        setRefreshPage(refreshPage + 1);
        if(props.showValidatorMessages){
            validator.showMessages();
        }
        else{
            validator.hideMessages();
        }
        // eslint-disable-next-line
    }, [props.showValidatorMessages]);

    useEffect(()=>{
        if(props.profile){
            setEditableProfile({...editableProfile, ...props.profile});
        }
        // eslint-disable-next-line
    }, [props.profile]);

    useEffect(()=>{
        props.updateEditableProfile(editableProfile);
        // eslint-disable-next-line
    }, [editableProfile]);

    const waxAcountErrorMessage = validator.message('wax account', editableProfile.wax_account, `required|max:12`);
    const fullNameErrorMessage = validator.message('full name', editableProfile.full_name, 'required|max:64');
    const countryErrorMessage = validator.message('country', editableProfile.country, 'required|max:64');
    const imageUrlErrorMessage = validator.message('image url', editableProfile.image_url, `required|max:${GLOBAL_VARS.MAX_IMGURL_LENGTH}`);
    const webSiteErrorMessage = validator.message('website', editableProfile.website, 'required|max:128');
    const biographyErrorMesssage = validator.message('biography', editableProfile.bio, 'required|max:512');
    const telegramHandleErrorMessage = validator.message('telegram handle', editableProfile.contact, 'required|max:32');

    return (
        <div style={{color:"white"}}>
            <div>
                <label>Wax account</label>
                <input
                    className={`${waxAcountErrorMessage ? "input-with-error" : ""}`}
                    value={editableProfile.wax_account}
                    name="wax_account"
                    onChange={handleInputChange}
                    disabled={props.editMode}
                />
                <div style={{backgroundColor: "red"}}>
                    {waxAcountErrorMessage}
                </div>  
            </div>
            <div>
                <label>Full name</label>
                <input
                    className={`${fullNameErrorMessage ? "input-with-error" : ""}`}
                    value={editableProfile.full_name}
                    name="full_name"
                    onChange={handleInputChange}
                />
                <div style={{backgroundColor: "red"}}>
                    {fullNameErrorMessage}
                </div>  
            </div>
            <div>
                <label>Country</label>
                <input
                    className={`${countryErrorMessage ? "input-with-error" : ""}`}
                    value={editableProfile.country}
                    name="country"
                    onChange={handleInputChange}
                />
                <div style={{backgroundColor: "red"}}>
                    {countryErrorMessage}
                </div> 
            </div>
            <div>
                <label>Website</label>
                <input
                    className={`${webSiteErrorMessage ? "input-with-error" : ""}`}
                    value={editableProfile.website}
                    name="website"
                    onChange={handleInputChange}
                />
                <div style={{backgroundColor: "red"}}>
                    {webSiteErrorMessage}
                </div> 
            </div>
            <div>
                <label>Telegram handle</label>
                <input
                    className={`${telegramHandleErrorMessage ? "input-with-error" : ""}`}
                    value={editableProfile.contact}
                    name="contact"
                    onChange={handleInputChange}
                />
                <div style={{backgroundColor: "red"}}>
                    {telegramHandleErrorMessage}
                </div> 
            </div>
            <div>
                <label>Image URL</label>
                <input
                    className={`${imageUrlErrorMessage ? "input-with-error" : ""}`}
                    value={editableProfile.image_url}
                    name="image_url"
                    onChange={handleInputChange}
                />
                <div style={{backgroundColor: "red"}}>
                    {imageUrlErrorMessage}
                </div> 
            </div>
            <div>
                <label>Biography</label>
                <textarea
                    className={`${biographyErrorMesssage ? "textarea-with-error" : ""}`}
                    value={editableProfile.bio}
                    name="bio"
                    onChange={handleInputChange}
                />
                <div style={{backgroundColor: "red"}}>
                    {biographyErrorMesssage}
                </div> 
            </div>
        </div>
    )
}