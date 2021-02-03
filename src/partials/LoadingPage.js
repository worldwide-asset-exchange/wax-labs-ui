import React from 'react';
import './LoadingPage.scss';

// Just a stub for now.
export default function RenderLoadingPage(props){

    return (
        <div className="loadingPage">
            <h1>Loading resources...</h1>
            <div className="loadingPage__spinner"></div>
        </div>
    )
}