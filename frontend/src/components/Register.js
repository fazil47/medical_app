import React from 'react';
import { withRouter } from 'react-router';
import { Link } from 'react-router-dom';
import { getCookie } from '../utils/getCookie';
import AnimatedLoaderIcon from '../icons/AnimatedLoaderIcon';
import ErrorMessage from './ErrorMessage';

function Register(props) {
    const [username, setUsername] = React.useState("");
    const [firstName, setFirstName] = React.useState("");
    const [lastName, setLastName] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [confirmation, setConfirmation] = React.useState("");
    const [email, setEmail] = React.useState("");
    const [specialization, setSpecialization] = React.useState("");
    const [type, setType] = React.useState("");
    const [profilePicture, setProfilePicture] = React.useState();
    const [errorMessage, SetErrorMessage] = React.useState();
    const [isLoading, SetIsLoading] = React.useState(false);

    function handleSubmit(event) {
        event.preventDefault();
        SetIsLoading(true);
        let userDetails = new FormData();
        userDetails.append('username', username);
        userDetails.append('first_name', firstName);
        userDetails.append('last_name', lastName);
        userDetails.append('password', password);
        userDetails.append('confirmation', confirmation);
        userDetails.append('email', email);
        userDetails.append('type', type);
        userDetails.append('profile_picture', profilePicture);
        if (type === "doctor") {
            userDetails.append('specialization', specialization)
        }
        fetch('/api/register', {
            credentials: 'include',
            mode: 'same-origin',
            method: 'POST',
            headers: {
                'X-CSRFToken': getCookie('csrftoken')
            },
            body: userDetails
        })
            .then(response => {
                SetIsLoading(false);
                if (response.status === 201) {
                    props.history.push("/");
                } else {
                    return response.json()
                        .then(result => { SetErrorMessage(result.message) })
                        .catch(console.log)
                }
            });
    }

    return (
        <div className="card">
            <div className="cardHeader">
                <h2 className="cardTitle">Register</h2>
            </div>
            <form className="cardBody" onSubmit={handleSubmit} method="post">
                <ul>
                    <li className="inputGroup">
                        <label>Username</label>
                        <input required autofocus onChange={event => { setUsername(event.target.value) }} type="text" name="username" placeholder="Username" />
                    </li>
                    <li className="inputGroup">
                        <label>First Name</label>
                        <input required onChange={event => { setFirstName(event.target.value) }} type="text" name="first_name" placeholder="First Name" />
                    </li>
                    <li className="inputGroup">
                        <label>Last Name</label>
                        <input required onChange={event => { setLastName(event.target.value) }} type="text" name="last_name" placeholder="Last Name" />
                    </li>
                    <li className="inputGroup">
                        <label>Email</label>
                        <input onChange={event => { setEmail(event.target.value) }} type="email" name="email" placeholder="Email Address" />
                    </li>
                    <li className="inputGroup">
                        <label>Password</label>
                        <input required onChange={event => { setPassword(event.target.value) }} type="password" name="password" placeholder="Password" />
                    </li>
                    <li className="inputGroup">
                        <label>Confirm Password</label>
                        <input required onChange={event => { setConfirmation(event.target.value) }} type="password" name="confirmation" placeholder="Confirm Password" />
                    </li>
                    <li className="inputGroup">
                        <label>Profile Picture</label>
                        <input onChange={event => { setProfilePicture(event.target.files[0]) }} type="file" name="profilePicture" />
                    </li>
                    <li className="inputGroup">
                        <label>Account Type</label>
                        <select required onChange={event => { setType(event.target.value) }} name="type">
                            <option disabled selected hidden value="">User Type</option>
                            <option value="patient">Patient</option>
                            <option value="doctor">Doctor</option>
                        </select>
                    </li>
                    {type === "doctor" &&
                        <li className="inputGroup">
                            <label>Specialization</label>
                            <input onChange={event => { setSpecialization(event.target.value) }} type="text" name="specialization" />
                        </li>
                    }
                    {isLoading &&
                        <AnimatedLoaderIcon size="30" />
                    }
                    {errorMessage &&
                        <li>
                            <ErrorMessage message={errorMessage} dismissMessageHandler={() => { SetErrorMessage(null) }} />
                        </li>
                    }
                    <li>
                        <input className="button primary" type="submit" value="Register" />
                    </li>
                </ul>
            </form>
            <div className="cardFooter">
                Already have an account? <Link to="/login">Log In here.</Link>
            </div>
        </div>
    );
}

const RegisterWithRouter = withRouter(Register);
export default RegisterWithRouter;