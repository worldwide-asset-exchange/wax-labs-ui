import React, {useState, useEffect} from 'react';
import {
Link
} from 'react-router-dom';
import * as waxjs from "@waxio/waxjs/dist";

import RenderCategoryList from './CategoryListSingle.js';

const wax = new waxjs.WaxJS(process.env.REACT_APP_WAX_RPC, null, null, false);
export default function RenderAdminCategories(props){
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
                        account: 'labs',
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
                      code: 'labs',
                      scope: 'labs',
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
        <div className="admin-content-wrapper">
            <div className="admin-submenu">
                <ul>
                    <li><Link className="btn" to="/admin">Back to Admin Menu</Link></li>
                </ul>
            </div>
            <div className="admin-content">
                <h3>Add or Remove Category</h3>
                <div className="add-cat">
                    <input type="text" onChange={handleInputChange} />
                    <button className="btn" onClick={addCategory}>Add Category</button>
                </div>
                <h3>Category List</h3>
                {categories.map((category) =>
                <RenderCategoryList category={category} key={category} activeUser={props.activeUser} accountName={props.activeUser} />)}
            </div>
        </div>
    );
}