import React from 'react';
import DefaultAccountIcon from '../icons/DefaultAccountIcon';

export default function ProfilePicture(props) {
    const style = props.url ? { backgroundImage: `url(${props.url})` } : {};
    return (
        <div className="profilePicture" style={style}>
            {!props.url &&
                <DefaultAccountIcon size="30" />
            }
        </div>
    );
}
