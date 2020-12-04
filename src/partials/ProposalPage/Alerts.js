import React from 'react';
import PropTypes from 'prop-types';
import Alert from 'react-bootstrap/Alert'

export default function RenderAlerts(props){
    RenderAlerts.propTypes = {
        alertList: PropTypes.array.isRequired,
        removeAlert: PropTypes.func.isRequired
    }

    function RenderAlert(props){
        return(
            <Alert variant={props.alertObj.variant} onClose={()=>props.removeAlert(props.index)} dismissible={props.alertObj.dismissible}>
                <Alert.Heading>{props.alertObj.title}</Alert.Heading>
                <p>{props.alertObj.body}</p>
                {props.alertObj.details ?
                <React.Fragment>
                    <hr />
                    <p className="mb-0">
                        {props.alertObj.details}
                    </p>
                </React.Fragment> 
                :
                ""
                }
            </Alert>
        )
    }

    if(props.alertList){
        return (
            <div>
                {props.alertList.map((alertObj, index) => <RenderAlert key={alertObj} alertObj={alertObj} index={index} removeAlert={props.removeAlert}/>)}
            </div>
        )
    }
    return ""

}