import React from 'react';
import { withRouter } from 'react-router';
import { useLocation } from 'react-router-dom';

import HomeIcon from '../icons/HomeIcon';
import AppointmentsIcon from '../icons/AppointmentsIcon';
import DoctorIcon from '../icons/DoctorIcon';

function Navbar(props) {
    function matchLocation(toMatch) {
        const currentPath = useLocation().pathname.split('/')[1];
        return toMatch === currentPath;
    }

    return (
        <div id="navbar">
            <button className={matchLocation("") ? "selected" : null} onClick={() => {
                props.history.push("/");
            }}>
                <HomeIcon size="30" />
            </button>
            <button className={matchLocation("appointments") ? "selected" : null} onClick={() => {
                props.history.push("/appointments");
            }}>
                <AppointmentsIcon size="30" />
            </button>
            <button className={matchLocation("add") ? "selected" : null} onClick={() => {
                props.history.push("/add");
            }}>
                <DoctorIcon size="30" />
            </button>
        </div>
    );
}

const NavbarWithRouter = withRouter(Navbar);
export default NavbarWithRouter;