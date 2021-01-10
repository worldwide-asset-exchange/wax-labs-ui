import React from 'react'

export default function RenderCategoryCard (props) {
    return (
        <div>
            <p>{props.category}</p>
            <button className="btn" onClick={()=>props.deleteCategory(props.category)}>Delete</button>
        </div>
    )
}