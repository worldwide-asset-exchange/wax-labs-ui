import React, {useState, useEffect} from 'react';
import {
Link
} from 'react-router-dom';
import * as waxjs from "@waxio/waxjs/dist";

import RenderCategoryList from './CategoryListSingle.js';

export default function RenderAdminCategories(props){
    const wax = new waxjs.WaxJS(process.env.REACT_APP_WAX_RPC, null, null, false);
    const [ categories, setCategories ] = useState([]);

    console.log(props.accountName);
    console.log(props.activeUser);

    useEffect(() => {
        async function getCategories() {
            try {
                let resp = await wax.rpc.get_table_rows({             
                      code: 'labs.decide',
                      scope: 'labs.decide',
                      table: 'config',
                      json: true,
                  });
                  console.log(resp.rows[0].categories);
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
            {categories.map((category) =>
            <RenderCategoryList category={category} key={category} activeUser={props.activeUser} accountName={props.activeUser} />)}
        </div>
    );
}