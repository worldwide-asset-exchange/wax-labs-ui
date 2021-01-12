import React from 'react'

import './CategoryCard.scss';

export default function RenderCategoryCard (props) {
    return (
        <div className="categoryCard">
            <p className="categoryCard__name">{props.category}</p>
            <button className="button button--text" onClick={()=>props.deleteCategory(props.category)}>Delete</button>
        </div>
    )
}