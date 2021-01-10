import React, {useEffect, useState} from 'react';
import RenderCategoryCard from './CategoryCard';

import * as GLOBAL_VARS from '../../utils/vars';
import * as GLOBAL_ALERTS from '../../utils/alerts';
import RenderLoadingPage from '../LoadingPage';

export default function RenderManageCategoriesTab(props) {

    const [nonDeprecatedCategories, setNonDeprecatedCategories] = useState([]);
    const [newCategory, setNewCategory] = useState([]);
    
    useEffect(()=>{
        let cancelled = false
        if(props.queryingCategories){
            return
        }
        function filterDeprecated(category){
            return !(props.deprecatedCategories.includes(category));
        }

        let nonDeprecatedCategories = props.categories.filter(filterDeprecated);

        if(!cancelled){
            setNonDeprecatedCategories(nonDeprecatedCategories);
        }

        const cleanup = () => cancelled = true;
        return cleanup;
    }, [props.categories, props.deprecatedCategories, props.queryingCategories]);

    function createDeleteCategoryAction(category){
        let activeUser = props.activeUser;
        return {
            account: GLOBAL_VARS.LABS_CONTRACT_ACCOUNT,
            name: GLOBAL_VARS.REMOVE_CATEGORY_ACTION,
            authorization: [{
                actor: activeUser.accountName,
                permission: activeUser.requestPermission,
            }],
            data: {
                category_name: category,
            }
        } 
    }
    function createAddCategoryAction(){
        let activeUser = props.activeUser;
        return {
            account: GLOBAL_VARS.LABS_CONTRACT_ACCOUNT,
            name: GLOBAL_VARS.ADD_CATEGORY_ACTION,
            authorization: [{
                actor: activeUser.accountName,
                permission: activeUser.requestPermission,
            }],
            data: {
                new_category: newCategory,
            }
        }
    }

    async function addNewCategory(){
        let activeUser = props.activeUser;
        let actionList = [createAddCategoryAction()];

        try {
            await activeUser.signTransaction (
                {actions: actionList}
                , {
                    blocksBehind: 3,
                    expireSeconds: 30,
                }
            );
            props.showAlert(GLOBAL_ALERTS.ADD_CATEGORY_ALERT_DICT.SUCCESS);
            props.rerunCategoriesQuery();
        } catch(e){
            console.log(e);
            let alertObj = {
                ...GLOBAL_ALERTS.ADD_CATEGORY_ALERT_DICT.ERROR,
                details: e.message
            }
            props.showAlert(alertObj);
        }
    }
    async function deleteCategory(category){
        let activeUser = props.activeUser;
        let actionList = [createDeleteCategoryAction(category)];

        try {
            await activeUser.signTransaction (
                {actions: actionList}
                , {
                    blocksBehind: 3,
                    expireSeconds: 30,
                }
            );
            props.showAlert(GLOBAL_ALERTS.REMOVE_CATEGORY_ALERT_DICT.SUCCESS);
            props.rerunCategoriesQuery();
        } catch(e){
            console.log(e);
            let alertObj = {
                ...GLOBAL_ALERTS.REMOVE_CATEGORY_ALERT_DICT.ERROR,
                details: e.message
            }
            props.showAlert(alertObj);
        }
    }


    return (
        <div>
            <div>
                <p>New category</p>
                <input value={newCategory} onChange={(event)=>setNewCategory(event.target.value)}/>
                <button className="btn" onClick={()=>addNewCategory()}>Add new category</button>
            </div>
            {
                props.queryingCategories ? 
                <RenderLoadingPage/>
                :
                <div>
                    <h2>Current categories</h2>
                    {nonDeprecatedCategories.map((category, index) => {
                        return (
                            <div key={category}>
                                <RenderCategoryCard
                                    category={category}
                                    deleteCategory={deleteCategory}
                                />
                            </div>
                        )
                    })}
                </div>
            }
        </div>
    );
}