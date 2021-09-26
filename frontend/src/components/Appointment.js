import React from 'react'
import ProfilePicture from './ProfilePicture'
import { getCookie } from '../utils/getCookie';
import AnimatedLoaderIcon from '../icons/AnimatedLoaderIcon';
import ErrorMessage from './ErrorMessage';

export default function Appointment(props) {
    const [acceptedStartTime, SetAcceptedStartTime] = React.useState();
    const [message, SetMessage] = React.useState('');
    const [errorMessage, SetErrorMessage] = React.useState();
    const [isLoading, SetIsLoading] = React.useState(false);

    function handleAcceptAppointment(event) {
        event.preventDefault();
        SetIsLoading(true);
        if (props.userDetails.type === "doctor") {
            fetch('/api/accept_appointment', {
                method: 'PUT',
                headers: {
                    'X-CSRFToken': getCookie('csrftoken')
                },
                body: JSON.stringify({
                    accepted_start_time: acceptedStartTime,
                    doctor_message: message,
                    appointment_id: props.appointmentDetails.id
                })
            })
                .then(response => {
                    SetIsLoading(false);
                    if (response.status === 202) {
                        props.resetFeedHandler()
                    } else {
                        response.json()
                            .then(result => { SetErrorMessage(result.message) })
                            .catch(error => { console.log(`Error: ${error}`) })
                    }
                })
        }
    }

    function handleRejectAppointment() {
        SetIsLoading(true);
        if (props.userDetails.type === "doctor") {
            fetch('/api/reject_appointment', {
                method: 'PUT',
                headers: {
                    'X-CSRFToken': getCookie('csrftoken')
                },
                body: JSON.stringify({
                    doctor_message: message,
                    appointment_id: props.appointmentDetails.id
                })
            })
                .then(response => {
                    SetIsLoading(false);
                    if (response.status === 202) {
                        props.resetFeedHandler();
                    } else {
                        response.json()
                            .then(result => { SetErrorMessage(result.message) })
                            .catch(error => { console.log(`Error: ${error}`) })
                    }
                })
        }
    }

    function handleDeleteAppointment() {
        SetIsLoading(true);
        if (props.userDetails.type === "patient") {
            fetch('/api/delete_appointment', {
                method: 'DELETE',
                headers: {
                    'X-CSRFToken': getCookie('csrftoken')
                },
                body: JSON.stringify({
                    appointment_id: props.appointmentDetails.id
                })
            })
                .then(response => {
                    SetIsLoading(false);
                    if (response.status === 202) {
                        props.resetFeedHandler()
                    } else {
                        response.json()
                            .then(result => { SetErrorMessage(result.message) })
                            .catch(error => { console.log(`Error: ${error}`) })
                    }
                })

        }
    }

    let appointmentControls;
    if (props.appointmentDetails.accepted === true) {
        appointmentControls = <></>
    }
    else if (props.appointmentDetails.rejected === true) {
        appointmentControls =
            <li className="columnFlex">
                <li>
                    <button className="button danger" onClick={handleDeleteAppointment}>Delete Appointment Request</button>
                </li>
            </li>
    } else if (props.userDetails.type === "patient") {
        appointmentControls =
            <li className="columnFlex">
                <li>
                    <button className="button" onClick={props.editAppointmentHandler}>Edit Appointment Request</button>
                </li>
                <li>
                    <button className="button danger" onClick={handleDeleteAppointment}>Delete Appointment Request</button>
                </li>
            </li>
    } else if (props.userDetails.type === "doctor") {
        appointmentControls = <>
            <li>
                <form className="columnFlex" onSubmit={handleAcceptAppointment}>
                    <div className="inputGroup">
                        <label>Start time (if accepting)</label>
                        <input required value={acceptedStartTime} onChange={event => SetAcceptedStartTime(event.target.value)} type="time" placeholder="Time in hh:mm format (24-hour clock)" />
                    </div>
                    <div className="inputGroup">
                        <label>Message</label>
                        <textarea value={message} placeholder={`Optional message to ${props.appointmentDetails.patient_details.first_name} ${props.appointmentDetails.patient_details.last_name}`} onChange={event => SetMessage(event.target.value)} />
                    </div>
                    <button className="button primary" type="submit">Accept Appointment Request</button>
                </form>
            </li>
            <li>
                <button className="button danger" onClick={handleRejectAppointment}>Reject Appointment Request</button>
            </li>
        </>
    }

    let appointmentExtraDetails = <></>;
    if (props.appointmentDetails.accepted === true) {
        appointmentExtraDetails = <>
            <div className="labelGroup">
                <label>Accepted Start Time (24-hour clock)</label>
                <label>{props.appointmentDetails.accepted_start_time}</label>
            </div>
            {props.appointmentDetails.doctor_message &&
                <div className="labelGroup">
                    <label>Message From Doctor</label>
                    <label>{props.appointmentDetails.doctor_message}</label>
                </div>
            }
        </>
    } else if (props.appointmentDetails.rejected === true && props.appointmentDetails.doctor_message) {
        appointmentExtraDetails = <>
            <div className="labelGroup">
                <label>Message From Doctor</label>
                <label>{props.appointmentDetails.doctor_message}</label>
            </div>
        </>
    } else {
        appointmentExtraDetails = <>
            <div className="labelGroup">
                <label>Requested Time Slot</label>
                <label>{props.appointmentDetails.request_time_slot}</label>
            </div>
            {props.appointmentDetails.patient_message &&
                <div className="labelGroup">
                    <label>Message To Doctor</label>
                    <label>{props.appointmentDetails.patient_message}</label>
                </div>
            }
        </>
    }

    const displayPersonDetails = props.userDetails.type === "patient" ? props.appointmentDetails.doctor_details : props.appointmentDetails.patient_details

    return (
        <>
            <ProfilePicture url={displayPersonDetails.profile_picture_url} />
            <ul>
                <li className="labelGroup">
                    <label>First Name</label>
                    <label>{displayPersonDetails.first_name}</label>
                </li>
                <li className="labelGroup">
                    <label>Last Name</label>
                    <label>{displayPersonDetails.last_name}</label>
                </li>
                {props.userDetails.type === "patient" &&
                    <li className="labelGroup">
                        <label>Specialization</label>
                        <label>{displayPersonDetails.specialization}</label>
                    </li>
                }
                <li className="columnFlex">
                    <div className="labelGroup">
                        <label>Date (YY:MM:DD)</label>
                        <label>{props.appointmentDetails.date}</label>
                    </div>
                    {appointmentExtraDetails}
                </li>
                {isLoading &&
                    <AnimatedLoaderIcon size="30" />
                }
                {errorMessage &&
                    <li>
                        <ErrorMessage message={errorMessage} dismissMessageHandler={() => { SetErrorMessage(null) }} />
                    </li>
                }
                {appointmentControls}
            </ul>
        </>
    )
}
