import React from 'react';
import { render } from 'react-dom';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';

import Register from './Register';
import Login from './Login';
import LoggedInView from './LoggedInView';

export default function App() {
    return (
        <>
            <Router>
                <Switch>
                    <Route path="/login" component={Login} />
                    <Route path="/register" component={Register} />
                    <Route path="/" component={LoggedInView} />
                </Switch>
            </Router>
        </>
    );
}

// TODO: Implement account system
const appDiv = document.querySelector("#app");
render(<App />, appDiv);