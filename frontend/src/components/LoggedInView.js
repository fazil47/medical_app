import React from 'react';
import { withRouter } from 'react-router';

import Content from './Content';
import Header from './Header';
import Footer from './Footer.js';
import AnimatedLoaderIcon from '../icons/AnimatedLoaderIcon';

function LoggedInView(props) {
    const [isAuthenticated, SetIsAuthenticated] = React.useState(false);
    const [userDetails, SetUserDetails] = React.useState({});
    const [isLoading, SetIsLoading] = React.useState(false)

    React.useEffect(() => {
        SetIsLoading(true);
        fetch('/api/current_user')
            .then(response => {
                if (response.status === 200) {
                    SetIsAuthenticated(true);
                } else {
                    props.history.push("/login");
                }
                return response.json()
            })
            .then(result => {
                SetUserDetails(result);
                SetIsLoading(false);
            })
            .catch(error => console.log(`Error: ${error}`));
    }, []);

    if (isAuthenticated) {
        return (
            <>
                <Header userDetails={userDetails} />
                <Content userDetails={userDetails} />
                <Footer />
            </>
        );
    } else if (isLoading) {
        return (
            <AnimatedLoaderIcon size="60" />
        );
    } else {
        return (
            <></>
        );
    }
}

const LoggedInViewWithRouter = withRouter(LoggedInView);
export default LoggedInViewWithRouter;