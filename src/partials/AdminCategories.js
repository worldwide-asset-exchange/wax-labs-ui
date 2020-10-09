import React, {useState, useEffect} from 'react';
import {
Link
} from 'react-router-dom';
import * as waxjs from "@waxio/waxjs/dist";

import RenderCategoryList from './CategoryListSingle.js';

export default function RenderAdminCategories(props){
    const wax = new waxjs.WaxJS(process.env.REACT_APP_WAX_RPC, null, null, false);
    const [ categories, setCategories ] = useState([]);
    const [ add_category, setNewCategory ] = useState('');
    const activeUser = props.activeUser;
    
    function handleInputChange(event) {
        const value = event.target.value;

        setNewCategory(prevState => {
            return { ...prevState, new_category: value }
          }
        );
    }

    async function addCategory(){
        try {
            await activeUser.signTransaction({
                actions: [
                    {
                        account: 'labs.decide',
                        name: 'addcategory',
                        authorization: [{
                            actor: activeUser.accountName,
                            permission: 'active',
                        }],
                        data: {
                            new_category: add_category.new_category,
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

    useEffect(() => {
        async function getCategories() {
            try {
                let resp = await wax.rpc.get_table_rows({             
                      code: 'labs.decide',
                      scope: 'labs.decide',
                      table: 'config',
                      json: true,
                  });
                  setCategories(resp.rows[0].categories);
                } catch(e) {
                  console.log(e);
            }
        }
        getCategories();
     }, []);


    return (
        <div className="admin-content">
            <Link to="/admin">Return to Admin Menu</Link>
            <div className="add-cat">
                <input type="text" onChange={handleInputChange} />
                <button onClick={addCategory}>Add Category</button>
            </div>
            {categories.map((category) =>
            <RenderCategoryList category={category} key={category} activeUser={props.activeUser} accountName={props.activeUser} />)}
        </div>
    );
}