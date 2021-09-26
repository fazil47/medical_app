import React from 'react';
import DismissIcon from '../icons/DismissIcon.js';

export default function ErrorMessage(props) {
    return (
        <div className="errorMessage">
            <label>{props.message}</label>
            <div className="button" onClick={props.dismissMessageHandler}>
                <DismissIcon size="30" />
            </div>
        </div>
    )
}
