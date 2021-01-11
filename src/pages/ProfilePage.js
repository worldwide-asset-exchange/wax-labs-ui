import React, {useState, useEffect} from 'react';
import {useParams} from 'react-router-dom';

import RenderUserProposalsTab from '../partials/AccountPortal/UserProposalsTab';
import RenderLoadingPage from '../partials/LoadingPage';
import {getProfileData} from '../partials/Profile/CRUD/QueryProfile';
import RenderProfileDisplay from '../partials/Profile/ProfileDisplay';


export default function RenderProfilePage(props){
    const {accountName} = useParams();
    const [userProfile, setUserProfile] = useState(null);
    const [queryingUserProfile, setQueryingUserProfile] = useState(true);

    useEffect(()=>{
        
        let cancelled = false;
        
        if(accountName){
            setQueryingUserProfile(true);
            getProfileData(accountName).then(profileData => {
                if(!cancelled){
                    setUserProfile(profileData);
                    setQueryingUserProfile(false);
                }
            })
        }
        
        const cleanup = () => {cancelled = true};
        return cleanup;
    }, [accountName]);

    return(
        <div>
            {
                queryingUserProfile ?
                <RenderLoadingPage/>
                :
                <RenderProfileDisplay
                    profile={userProfile}
                    notFoundMessage={`${accountName} hasn't created a profile yet.`}
                />            
            }
            
            <RenderUserProposalsTab
                userToSearch={accountName}
                subtitle={`${accountName}'s proposals`}
                categories={props.categories}
                activeUser={props.activeUser}
                showCreateButton={false}
                defaultStatus={[]}
            />
        </div>
    )
}