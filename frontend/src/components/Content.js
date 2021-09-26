import React from 'react';
import { Switch, Route } from 'react-router-dom';
import HomePage from './HomePage';
import AppointmentsPage from './AppointmentsPage';
import AddPage from './AddPage';

export default function Content(props) {
    return (
        <div id="mainSection">
            <Switch>
                <Route path="/" exact >
                    <HomePage userDetails={props.userDetails} />
                </Route>
                <Route path="/appointments">
                    <AppointmentsPage userDetails={props.userDetails} />
                </Route>
                <Route path="/add">
                    <AddPage userDetails={props.userDetails} />
                </Route>
            </Switch>
        </div>
    )
}
