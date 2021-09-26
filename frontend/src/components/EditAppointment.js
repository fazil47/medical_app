import React from 'react'
import ProfilePicture from './ProfilePicture'
import { getCookie } from '../utils/getCookie';
import AnimatedLoaderIcon from '../icons/AnimatedLoaderIcon';
import ErrorMessage from './ErrorMessage';

export default function EditAppointment(props) {
    const [date, SetDate] = React.useState(props.appointmentDetails.date);
    const [requestTimeSlot, SetRequestTimeSlot] = React.useState(props.appointmentDetails.request_time_slot);
    const [message, SetMessage] = React.useState(props.appointmentDetails.patient_message);
    const [errorMessage, SetErrorMessage] = React.useState();
    const [isLoading, SetIsLoading] = React.useState(false);

    function handleEditAppointment(event) {
        event.preventDefault();
        SetIsLoading(true);
        fetch('/api/edit_appointment', {
            method: 'PUT',
            headers: {
                'X-CSRFToken': getCookie('csrftoken')
            },
            body: JSON.stringify({
                date: date,
                request_time_slot: requestTimeSlot,
                patient_message: message,
                appointment_id: props.appointmentDetails.id
            })
        })
            .then(response => {
                SetIsLoading(false);
                if (response.status === 202) {
                    props.cancelEditHandler();
                    props.refreshFeedHandler();
                } else {
                    response.json()
                        .then(result => { SetErrorMessage(result.message) })
                        .catch(error => { console.log(`Error: ${error}`) })
                }
            })
    }

    return (
        <>
            <ProfilePicture url={props.appointmentDetails.doctor_details.profile_picture_url} />
            <ul>
                <li className="labelGroup">
                    <label>First Name</label>
                    <label>{props.appointmentDetails.doctor_details.first_name}</label>
                </li>
                <li className="labelGroup">
                    <label>Last Name</label>
                    <label>{props.appointmentDetails.doctor_details.last_name}</label>
                </li>
                <li className="labelGroup">
                    <label>Specialization</label>
                    <label>{props.appointmentDetails.doctor_details.specialization}</label>
                </li>
                <li>
                    <form className="columnFlex" onSubmit={handleEditAppointment}>
                        <div className="inputGroup">
                            <label>Date</label>
                            <input value={date} required type="date" name="date" onChange={event => SetDate(event.target.value)} />
                        </div>
                        <div className="inputGroup">
                            <label>Preferred Time Slot</label>
                            <select required name="request_time_slot" value={requestTimeSlot} onChange={event => SetRequestTimeSlot(event.target.value)}>
                                <option disabled selected hidden value="">Select preferred time slot</option>
                                <option value="Any">Any</option>
                                <option value="9:00 - 12:00">9:00 - 12:00</option>
                                <option value="13:00 - 17:00">13:00 - 17:00</option>
                            </select>
                        </div>
                        <div className="inputGroup">
                            <label>Message</label>
                            <textarea value={message} onChange={event => SetMessage(event.target.value)} placeholder={`Optional message to Dr. ${props.appointmentDetails.doctor_details.first_name} ${props.appointmentDetails.doctor_details.last_name}`} />
                        </div>
                        {isLoading &&
                            <AnimatedLoaderIcon size="30" />
                        }
                        {errorMessage &&
                            <ErrorMessage message={errorMessage} dismissMessageHandler={() => { SetErrorMessage(null) }} />
                        }
                        <button className="button primary" type="submit">Save Changes</button>
                        <button className="button danger" onClick={props.cancelEditHandler}>Discard Changes</button>
                    </form>
                </li>
            </ul>
        </>
    )
}
