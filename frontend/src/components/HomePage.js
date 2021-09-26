import React from 'react';
import ProfilePicture from './ProfilePicture';

export default function HomePage(props) {
    return (
        <div id="homePage" className="page">
            <div className="card">
                <div className="cardHeader">
                    <div className="cardTitle">Public Details</div>
                </div>
                <div className="cardBody">
                    <ProfilePicture url={props.userDetails.profile_picture_url} />
                    <ul>
                        <li className="labelGroup">
                            <label>First Name</label>
                            <label>{props.userDetails.first_name}</label>
                        </li>
                        <li className="labelGroup">
                            <label>Last Name</label>
                            <label>{props.userDetails.last_name}</label>
                        </li>
                        {props.userDetails.type === "doctor" &&
                            <li className="labelGroup">
                                <label>Specialization</label>
                                <label>{props.userDetails.specialization}</label>
                            </li>
                        }
                    </ul>
                </div>
            </div>
        </div>
    )
}
