import React from 'react';
import BackIcon from '../icons/BackIcon';
import NewAppointment from './NewAppointment';
import Appointment from './Appointment';
import AnimatedLoaderIcon from '../icons/AnimatedLoaderIcon';

// TODO: If an appointments request is made then that doctor should be removed from the add page and redirect to appointments page with that appointment selected

export default function AddPage(props) {
    const [selectableList, SetSelectableList] = React.useState([]);
    const [currentSelection, SetCurrentSelection] = React.useState(null);
    const [currentSelectionDetails, SetCurrentSelectionDetails] = React.useState({});
    const [isLoading, SetIsLoading] = React.useState(false);

    function ClearSelection() {
        SetCurrentSelection(null);
        SetCurrentSelectionDetails({});
    }

    function RefreshFeed() {
        if (props.userDetails.type === 'patient') {
            SetIsLoading(true);
            fetch('/api/available_doctors')
                .then(response => response.json())
                .then(result => {
                    SetIsLoading(false);
                    SetSelectableList(result.doctors)
                })
                .catch(error => console.log(`Error: ${error}`));
        } else if (props.userDetails.type === 'doctor') {
            SetIsLoading(true);
            fetch('/api/requested_doctor_appointments')
                .then(response => response.json())
                .then(result => {
                    SetIsLoading(false);
                    SetSelectableList(result.appointments)
                })
                .catch(error => console.log(`Error: ${error}`));
        }
    }

    function ResetFeed() {
        SetSelectableList([]);
        ClearSelection();
        RefreshFeed();
    }

    React.useEffect(ResetFeed, [props.userDetails.username]);

    let selectableElements = <></>;
    if (selectableList.length > 0) {
        selectableElements = selectableList.map(selectable => {
            const firstSpanContent = props.userDetails.type === "patient" ? selectable.specialization : selectable.date;
            const secondSpanContent = props.userDetails.type === "patient" ? selectable.first_name + " " + selectable.last_name : selectable.patient_details.first_name + " " + selectable.patient_details.last_name;
            const className = `labelGroup ${currentSelection === selectable.id ? "selectedItem" : "selectableItem"}`;
            return (
                <li key={selectable.id} onClick={() => {
                    SetCurrentSelection(selectable.id);
                    SetCurrentSelectionDetails(selectable);
                }} className={className}>
                    <label>{firstSpanContent}</label>
                    <label>{secondSpanContent}</label>
                </li>
            );
        })
    } else if (isLoading === false) {
        if (props.userDetails.type === "patient") {
            selectableElements = <>There are no free doctors right now</>
        } else if (props.userDetails.type === "doctor") {
            selectableElements = <>You don't have any appointment requests right now</>
        }
    }

    let detailsPageSideBody = <></>;
    if (selectableList.length > 0) {
        if (currentSelection === null) {
            detailsPageSideBody = props.userDetails.type === "patient" ? <div>Select a doctor to view details</div> : <div>Select an appointment request to view details</div>
        } else {
            detailsPageSideBody = props.userDetails.type === "patient" ? <NewAppointment resetFeedHandler={ResetFeed} doctorDetails={currentSelectionDetails} /> : <Appointment resetFeedHandler={ResetFeed} userDetails={props.userDetails} appointmentDetails={currentSelectionDetails} />;
        }
    }

    let detailsPageSideHeaderContent;
    let detailsPageSideHeaderTitle = <div className="cardTitle">{props.userDetails.type === 'patient' ? "Doctor Details" : "Patient Details"}</div>;
    if (currentSelection === null) {
        detailsPageSideHeaderContent = detailsPageSideHeaderTitle;
    } else {
        detailsPageSideHeaderContent =
            <>
                <div className="button backButton" onClick={ClearSelection}>
                    <BackIcon size="30" />
                </div>
                {detailsPageSideHeaderTitle}
                <div className="backButtonOffset" />
            </>;
    }

    return (
        <div id="chatPage" className="page">
            <div className={`pageSide ${currentSelection ? "deselectedPageSide" : "selectedPageSide"}`}>
                <div className="card">
                    <div className="cardHeader">
                        <div className="cardTitle">{props.userDetails.type === "patient" ? "Available Doctors" : "Requested Appointments"}</div>
                    </div>
                    <div className="cardBody">
                        <ul className="scrollableList">
                            {isLoading &&
                                <AnimatedLoaderIcon size="30" />
                            }
                            {selectableElements}
                        </ul>
                    </div>
                </div>
            </div>
            <div className="pageMid" />
            <div className={`pageSide ${currentSelection ? "selectedPageSide" : "deselectedPageSide"}`}>
                <div className="card">
                    <div className="cardHeader">
                        {detailsPageSideHeaderContent}
                    </div>
                    <div className="cardBody">
                        {detailsPageSideBody}
                    </div>
                </div>
            </div>
        </div>
    );
}
