import React from 'react';
import DismissIcon from '../icons/DismissIcon.js';

export default function DialogBox(props) {

    const parentClass = props.open ? "dialogBoxContainerEnabled" : "dialogBoxContainerDisabled";

    return (
        <div className={parentClass}>
            <div className="dialogBoxBackground" onClick={props.closeDialogHandler}>
                <div className="dialogBox" onClick={event => event.stopPropagation()}>
                    <div className="dialogHeader">
                        <span>{props.title}</span>
                        <div className="dismissButton" onClick={props.closeDialogHandler}>
                            <DismissIcon size="30" />
                        </div>
                    </div>
                    <hr />
                    <div className="dialogBody">
                        {props.children}
                    </div>
                </div>
            </div>
        </div>
    );
}
