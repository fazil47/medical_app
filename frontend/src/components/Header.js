import React from 'react';
import HeartIcon from '../icons/HeartIcon';
import UserAccountPage from './UserAccountPage';
import Navbar from './Navbar';
import NavSelect from './NavSelect';
import DialogBox from './DialogBox';
import ProfilePicture from './ProfilePicture';

export default function Header(props) {
    const [userDialogOpen, setUserDialogOpen] = React.useState(false);

    function handleUserDialogOpen() {
        setUserDialogOpen(true);
    }

    function handleUserDialogClose() {
        setUserDialogOpen(false);
    }

    return (
        <>
            <DialogBox title="My Account" open={userDialogOpen} closeDialogHandler={handleUserDialogClose}>
                <UserAccountPage userDetails={props.userDetails} />
            </DialogBox>
            <div id="header">
                <div id="logoDiv">
                    <button id="logoButton" onClick={() => {
                        window.history.pushState({}, '', '/');
                        window.history.go();
                    }}>
                        <HeartIcon size="30" />
                    </button>
                </div>
                <Navbar />
                <NavSelect />
                <div id="userDiv">
                    <div id="userButton" onClick={handleUserDialogOpen}>
                        {/* <DefaultAccountIcon size="30" /> */}
                        <ProfilePicture url={props.userDetails.profile_picture_url} />
                    </div>
                </div>
            </div>
        </>
    )
}
