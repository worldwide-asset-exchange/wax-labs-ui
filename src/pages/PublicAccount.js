import React, {useState, useEffect} from 'react';
import {
Link,
useParams
} from 'react-router-dom';
import * as waxjs from "@waxio/waxjs/dist";

export default function RenderProposals(props) {
    const wax = new waxjs.WaxJS(process.env.REACT_APP_WAX_RPC, null, null, false);
    const [account, setAccount] = useState();
    const { accName } = useParams();

    useEffect(() => {
        async function getAccount() {
            try {
                let resp = await wax.rpc.get_table_rows({             
                      code: 'labs',
                      scope: 'labs',
                      table: 'profiles',
                      json: true,
                      lower_limit: accName,
                      upper_limit: accName,
                      limit: 1
                  });
                  if (resp.rows.length){
                    setAccount(resp.rows[0]);
                  }
                } catch(e) {
                  console.log(e);
            }
        }
        getAccount();
     }, []);

    if (account){
        console.log(account);
        return (
            <div className="public-account">
                <div className="account-info-table">
                    <div className="row">
                        <h3>{account.wax_account} - WAX Labs Profile</h3>
                    </div>
                    <div className="row">
                        <div className="col label">
                            <strong>Name:</strong>
                        </div>
                        <div className="col value">
                            {account.full_name}
                        </div>
                    </div>
                    <div className="row">
                        <div className="col label">
                            <strong>Biography:</strong>
                        </div>
                        <div className="col value">
                            {account.bio}
                        </div>
                    </div>
                    <div className="row">
                        <div className="col label">
                            <strong>Image (url):</strong>
                        </div>
                        <div className="col value">
                            <img src={account.image_url} alt="" />
                        </div>        
                    </div>
                    <div className="row">
                        <div className="col label">
                            <strong>Country:</strong>    
                        </div>
                        <div className="col value">
                            {account.country}          
                        </div>                          
                    </div>
                    <div className="row">
                        <div className="col label">
                            <strong>Website:</strong>   
                        </div>
                        <div className="col value">
                            {account.website}           
                        </div>                         
                    </div>
                    <div className="row">
                        <div className="col label">
                            <strong>Telegram Handle:</strong>   
                        </div>
                        <div className="col value">
                            {account.contact}              
                        </div>                         
                    </div>
                </div>
            </div>
        );
    } else {
        return null;
    }
}