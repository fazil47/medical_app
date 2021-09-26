import React from 'react';
import { withRouter } from 'react-router';
import { Link } from 'react-router-dom';
import { getCookie } from '../utils/getCookie';
import AnimatedLoaderIcon from '../icons/AnimatedLoaderIcon';
import ErrorMessage from './ErrorMessage';

function Login(props) {
    const [username, setUsername] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [type, setType] = React.useState("");
    const [errorMessage, SetErrorMessage] = React.useState();
    const [isLoading, SetIsLoading] = React.useState(false);

    function handleSubmit(event) {
        event.preventDefault();
        SetIsLoading(true);
        fetch('/api/login', {
            credentials: 'include',
            mode: 'same-origin',
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'X-CSRFToken': getCookie('csrftoken')
            },
            body: JSON.stringify({
                username: username,
                password: password,
                type: type
            })
        })
            .then(response => {
                SetIsLoading(false);
                if (response.status === 202) {
                    props.history.push("/");
                } else {
                    response.json()
                        .then(result => { SetErrorMessage(result.message) })
                        .catch(console.log);
                }
            })

    }

    return (
        <div className="card">
            <div className="cardHeader">
                <h2 className="cardTitle">Login</h2>
            </div>
            <form className="cardBody" onSubmit={handleSubmit} method="post">
                <ul>
                    <li className="inputGroup">
                        <label>Username</label>
                        <input autofocus onChange={event => { setUsername(event.target.value) }} type="text" name="username" placeholder="Username" />
                    </li>
                    <li className="inputGroup">
                        <label>Password</label>
                        <input onChange={event => { setPassword(event.target.value) }} type="password" name="password" placeholder="Password" />
                    </li>
                    <li className="inputGroup">
                        <label>Account Type</label>
                        <select onChange={event => { setType(event.target.value) }} name="type">
                            <option disabled selected hidden value="">User Type</option>
                            <option value="patient">Patient</option>
                            <option value="doctor">Doctor</option>
                        </select>
                    </li>
                    {isLoading &&
                        <AnimatedLoaderIcon size="30" />
                    }
                    {errorMessage &&
                        <li>
                            <ErrorMessage message={errorMessage} dismissMessageHandler={() => { SetErrorMessage(null) }} />
                        </li>
                    }
                    <li>
                        <input className="button primary" type="submit" value="Login" />
                    </li>
                </ul>
            </form>
            <div className="cardFooter">
                Don't have an account? <Link to="/register">Register here.</Link>
            </div>
        </div>
    );
}

const LoginWithRouter = withRouter(Login);
export default LoginWithRouter;