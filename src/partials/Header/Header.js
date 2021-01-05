import React from 'react'

import RenderLoggedOutHeader from './LoggedOutHeader';
import RenderLoggedInHeader from './LoggedInHeader';

// Decided to separate the different logged in states into different components,
// since they are very different, and to keep this file cleaner.
export default function RenderHeader(props){

    if(!props.activeUser){
        return (
            <RenderLoggedOutHeader loginModal={props.loginModal}/>
        )
    }
    return (
            <RenderLoggedInHeader 
                queryingAdmin={props.queryingAdmin} 
                logout={props.logout} 
                activeUser={props.activeUser} 
                isAdmin={props.isAdmin} 
                categories={props.categories} 
                queryingCategories={props.queryingCategories}
            />
    )
    
}
