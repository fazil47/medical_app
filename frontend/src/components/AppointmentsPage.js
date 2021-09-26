import React from 'react';
import Appointment from './Appointment';
import BackIcon from '../icons/BackIcon';
import EditAppointment from './EditAppointment';
import AnimatedLoaderIcon from '../icons/AnimatedLoaderIcon';

export default function AppointmentsPage(props) {
    const [selectableList, SetSelectableList] = React.useState([]);
    const [currentSelection, SetCurrentSelection] = React.useState(null);
    const [currentSelectionDetails, SetCurrentSelectionDetails] = React.useState({});
    const [isEditing, SetIsEditing] = React.useState(false);
    const [isLoading, SetIsLoading] = React.useState(false);

    function ClearSelection() {
        SetCurrentSelection(null);
        SetCurrentSelectionDetails({});
        SetIsEditing(false);
    }

    function RefreshFeed() {
        SetSelectableList([]);

        let request_url;
        if (props.userDetails.type === "patient") {
            request_url = '/api/patient_appointments'
        } else if (props.userDetails.type === "doctor") {
            request_url = '/api/accepted_doctor_appointments'
        }
        if (request_url) {
            SetIsLoading(true);
            fetch(request_url)
                .then(response => response.json())
                .then(result => {
                    SetIsLoading(false);
                    SetSelectableList(result.appointments);
                    SetCurrentSelectionDetails(currentSelection ? result.appointments.find(selection => selection.id === currentSelection) : {});
                })
                .catch(error => console.log(`Error: ${error}`));
        }
    }

    function ResetFeed() {
        ClearSelection();
        RefreshFeed();
    }

    React.useEffect(ResetFeed, [props.userDetails.username]);

    let selectableElements = <></>;
    if (selectableList.length > 0) {
        selectableElements = selectableList.map(selectable => {
            // TODO: auto-delete expired appointments
            let firstSpanContent;
            if (props.userDetails.type === "patient") {
                firstSpanContent = selectable.accepted ? "Accepted" : selectable.rejected ? "Rejected" : "Pending";
            } else if (props.userDetails.type === "doctor") {
                firstSpanContent = selectable.patient_details.first_name + " " + selectable.patient_details.last_name;
            }
            const secondSpanContent = selectable.date + " " + (selectable.accepted ? "at " + selectable.accepted_start_time : "");
            const className = `labelGroup ${currentSelection === selectable.id ? "selectedItem" : "selectableItem"}`;
            return (
                <li key={selectable.id} onClick={() => {
                    SetCurrentSelection(selectable.id);
                    SetCurrentSelectionDetails(selectable);
                    SetIsEditing(false);
                }} className={className}>
                    <label>{firstSpanContent}</label>
                    <label>{secondSpanContent}</label>
                </li>
            );
        })
    } else if (isLoading === false) {
        if (props.userDetails.type === "patient") {
            selectableElements = <>You don't have any appointments now</>
        } else if (props.userDetails.type === "doctor") {
            selectableElements = <>You don't have any accepted appointments now</>
        }
    }

    let detailsPageSideHeaderContent;
    let detailsPageSideHeaderTitle = <div className="cardTitle">Appointment details</div>;
    if (currentSelection === null) {
        detailsPageSideHeaderContent = detailsPageSideHeaderTitle;
    } else {
        detailsPageSideHeaderContent =
            <>
                <div className="button backButton" onClick={() => {
                    SetCurrentSelection(null);
                    SetCurrentSelectionDetails({});
                }}>
                    <BackIcon size="30" />
                </div>
                {detailsPageSideHeaderTitle}
                <div className="backButtonOffset" />
            </>;
    }

    let detailsPageSideBody = <></>;
    if (selectableList.length > 0) {
        if (currentSelection === null) {
            detailsPageSideBody = <div>Select an appointment to view details</div>
        } else if (isEditing === false || props.userDetails.type === "doctor") {
            detailsPageSideBody = <Appointment resetFeedHandler={ResetFeed} userDetails={props.userDetails} editAppointmentHandler={() => { SetIsEditing(true) }} appointmentDetails={currentSelectionDetails} />;
        } else if (props.userDetails.type === "patient") {
            detailsPageSideBody = <EditAppointment refreshFeedHandler={RefreshFeed} appointmentDetails={currentSelectionDetails} cancelEditHandler={() => { SetIsEditing(false) }} />
        }
    }

    return (
        <div id="appointmentsPage" className="page">
            <div className={`pageSide ${currentSelection ? "deselectedPageSide" : "selectedPageSide"}`}>
                <div className="card">
                    <div className="cardHeader">
                        <div className="cardTitle">{props.userDetails.type === "patient" ? "Appointments" : "Accepted Appointments"}</div>
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
    )
}
