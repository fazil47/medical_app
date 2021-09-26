import React from 'react';
import { getCookie } from '../utils/getCookie';
import { withRouter } from 'react-router';

import ProfilePicture from './ProfilePicture';
import AnimatedLoaderIcon from '../icons/AnimatedLoaderIcon';

function UserAccountPage(props) {
    const [isLoading, SetIsLoading] = React.useState(false);

    function logOut() {
        SetIsLoading(true);
        fetch('/api/logout', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'X-CSRFToken': getCookie('csrftoken')
            },
        })
            .then(response => {
                SetIsLoading(false);
                if (response.status === 202) {
                    props.history.push("/login");
                }
                return response.json()
            })
            .then(result => console.log(result))
            .catch(error => console.log(error));
    }

    return (
        <div id="userAccountPage">
            <div className="card">
                <div className="cardBody">
                    <ProfilePicture url={props.userDetails.profile_picture_url} />
                    <ul>
                        <li className="labelGroup">
                            <label>Username</label>
                            <label>{props.userDetails.username}</label>
                        </li>
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
                        {isLoading &&
                            <AnimatedLoaderIcon size="30" />
                        }
                        <li>
                            <button className="button danger" onClick={logOut}>Log Out</button>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
}

const UserAccountPageWithRouter = withRouter(UserAccountPage);
export default UserAccountPageWithRouter;