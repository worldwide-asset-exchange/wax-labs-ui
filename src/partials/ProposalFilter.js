import React, {useState, useEffect} from 'react';
import {
Link
} from 'react-router-dom';
import * as waxjs from "@waxio/waxjs/dist";

export default function RenderProposalFilter(props) {
    const wax = new waxjs.WaxJS(process.env.REACT_APP_WAX_RPC, null, null, false);
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        async function getCategories() {
            try {
                let resp = await wax.rpc.get_table_rows({             
                      code: 'labs',
                      scope: 'labs',
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
    <div className="proposals-menu">
        <div className="proposal-type-filter row">
            {props.activeUser ?
            <Link to="/proposals/new">New Proposal</Link>
            :
            <></>
            }
            <ul>
            {props.activeUser ?
            <>    
                <li><Link to="/proposals/my-proposals">My Proposals</Link></li>
                <li><Link to="/proposals/my-drafts">My Draft Proposals</Link></li>
            </>
            :
            <></>
            }
            {props.activeUser && props.isAdmin ?
            <>
                <li><Link to="/proposals/in-review">In Review Proposals</Link></li>
            </>
            :
            <></>
            }
                <li><Link to="/proposals" className={props.status === "active" ? "current-page btn" : "btn" }>Active Proposals</Link></li>
                <li><Link to="/proposals/archived" className={props.status === "archived" ? "current-page btn" : "btn" }>Archived Proposals</Link></li>
            </ul>
        </div>
        <div className="sort-dropdown row">
            <select>
                <option>Created: Newest to Oldest</option>
                <option>Created: Oldest to Newest</option>
                <option>Voting Period: Ending Soon</option>
                <option>Voting Period: Not Ending Soon</option>
                <option>WAX Requested: Highest to Lowest</option>
                <option>WAX Requested: Lowest to Highest</option>
            </select>
        </div>
        <div className="status-filter row">
            <strong>Status</strong>
            {props.status === "active" ?
                <ul>
                    <li><input type="checkbox" name="voting" /> In Vote</li>
                    <li><input type="checkbox" name="inprogress" /> In Progress</li>
                </ul>
            : props.status === "archived" ?
                <ul>
                    <li><input type="checkbox" name="completed" /> Completed</li>
                    <li><input type="checkbox" name="rejected" /> Rejected</li>
                    <li><input type="checkbox" name="cancelled" /> Cancelled</li>
                </ul>
            :
            ''
            }
        </div>
        <div className="category-filter row">
            <strong>Category</strong>
            <ul>
                {categories.map((category, index) =>
                    <li key={index}><input type="checkbox" name={category} /> {category}</li>)}
            </ul>
        </div>
    </div>
    );
}