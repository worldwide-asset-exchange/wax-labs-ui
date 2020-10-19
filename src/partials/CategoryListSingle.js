import React from 'react';
import * as waxjs from "@waxio/waxjs/dist";

export default function RenderCategoryList(props){
    const activeUser = props.activeUser;

    async function removeCategory(){
        try {
            await activeUser.signTransaction({
                actions: [
                    {
                        account: 'labs.decide',
                        name: 'rmvcategory',
                        authorization: [{
                            actor: activeUser.accountName,
                            permission: 'active',
                        }],
                        data: {
                            category_name: props.category,
                        },
                    },
                ]} , {
                blocksBehind: 3,
                expireSeconds: 30
            });
        } catch(e) {
            console.log(e);
        }
    }

    return (
        <div className="single-category">
            <div className="cat-name">
                {props.category}
            </div>
            <div className="cat-remove">
                <button className="btn" onClick={removeCategory}>Remove</button>
            </div>
        </div>
    );
}