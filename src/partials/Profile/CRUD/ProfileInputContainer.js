import React, {useState, useEffect} from 'react';

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

    function handleInputChange(event){
        let value = event.target.value;
        let name = event.target.name;
        let profileCopy = {...editableProfile};
        profileCopy[name] = value;
        setEditableProfile(profileCopy);
    }

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

    return (
        <div style={{color:"white"}}>
            <div>
                <label>Wax account</label>
                <input
                    value={editableProfile.wax_account}
                    name="wax_account"
                    onChange={handleInputChange}
                    disabled={props.editMode}
                />

            </div>
            <div>
                <label>Full name</label>
                <input
                    value={editableProfile.full_name}
                    name="full_name"
                    onChange={handleInputChange}
                />
            </div>
            <div>
                <label>Country</label>
                <input
                    value={editableProfile.country}
                    name="country"
                    onChange={handleInputChange}
                />
            </div>
            <div>
                <label>Website</label>
                <input
                    value={editableProfile.website}
                    name="website"
                    onChange={handleInputChange}
                />
            </div>
            <div>
                <label>Telegram handle</label>
                <input
                    value={editableProfile.contact}
                    name="contact"
                    onChange={handleInputChange}
                />
            </div>
            <div>
                <label>Image URL</label>
                <input
                    value={editableProfile.image_url}
                    name="image_url"
                    onChange={handleInputChange}
                />
            </div>
            <div>
                <label>Biography</label>
                <textarea
                    value={editableProfile.bio}
                    name="bio"
                    onChange={handleInputChange}
                />
            </div>
        </div>
    )
}