import React from 'react'
import { withRouter } from 'react-router';
import { useLocation } from 'react-router-dom';

function NavSelect(props) {
    function matchLocation(toMatch) {
        const currentPath = useLocation().pathname.split('/')[1];
        return toMatch === currentPath;
    }

    return (
        <select id="navSelect" onChange={event => {
            props.history.push(event.target.value)
        }}>
            <option selected={matchLocation("") ? true : false} value="/">Home</option>
            <option selected={matchLocation("appointments") ? true : false} value="/appointments">Appointments</option>
            <option selected={matchLocation("add") ? true : false} value="/add">Add</option>
        </select>
    )
}

const NavSelectWithRouter = withRouter(NavSelect);
export default NavSelectWithRouter;