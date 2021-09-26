import React from 'react'
import ProfilePicture from './ProfilePicture'
import { getCookie } from '../utils/getCookie';
import AnimatedLoaderIcon from '../icons/AnimatedLoaderIcon';
import ErrorMessage from './ErrorMessage';

export default function NewAppointment(props) {
    const [date, SetDate] = React.useState();
    const [requestTimeSlot, SetRequestTimeSlot] = React.useState();
    const [patientMessage, SetPatientMessage] = React.useState('');
    const [errorMessage, SetErrorMessage] = React.useState();
    const [isLoading, SetIsLoading] = React.useState(false);

    function handleRequestAppointment(event) {
        event.preventDefault();
        SetIsLoading(true);
        fetch('/api/request_appointment', {
            method: 'POST',
            headers: {
                'X-CSRFToken': getCookie('csrftoken')
            },
            body: JSON.stringify({
                date: date,
                request_time_slot: requestTimeSlot,
                patient_message: patientMessage,
                doctor_id: props.doctorDetails.id
            })
        })
            .then(response => {
                SetIsLoading(false);
                if (response.status === 201) {
                    props.resetFeedHandler();
                } else {
                    response.json()
                        .then(result => { SetErrorMessage(result.message) })
                        .catch(error => { console.log(`Error: ${error}`) })
                }
            })
    }

    return (
        <>
            <ProfilePicture url={props.doctorDetails.profile_picture_url} />
            <ul>
                <li className="labelGroup">
                    <label>First Name</label>
                    <label>{props.doctorDetails.first_name}</label>
                </li>
                <li className="labelGroup">
                    <label>Last Name</label>
                    <label>{props.doctorDetails.last_name}</label>
                </li>
                <li className="labelGroup">
                    <label>Specialization</label>
                    <label>{props.doctorDetails.specialization}</label>
                </li>
                <li>
                    <form className="columnFlex" onSubmit={handleRequestAppointment}>
                        <div className="inputGroup">
                            <label>Date</label>
                            <input value={date} required type="date" name="date" onChange={event => SetDate(event.target.value)} />
                        </div>
                        <div className="inputGroup">
                            <label>Preferred Time Slot</label>
                            <select required name="request_time_slot" onChange={event => SetRequestTimeSlot(event.target.value)}>
                                <option disabled selected hidden value="">Select preferred time slot</option>
                                <option value="Any">Any</option>
                                <option value="9:00 - 12:00">9:00 - 12:00</option>
                                <option value="13:00 - 17:00">13:00 - 17:00</option>
                            </select>
                        </div>
                        <div className="inputGroup">
                            <label>Message</label>
                            <textarea value={patientMessage} placeholder={`Optional message to Dr. ${props.doctorDetails.first_name} ${props.doctorDetails.last_name}`} onChange={event => SetPatientMessage(event.target.value)} />
                        </div>
                        {isLoading &&
                            <AnimatedLoaderIcon size="30" />
                        }
                        {errorMessage &&
                            <ErrorMessage message={errorMessage} dismissMessageHandler={() => { SetErrorMessage(null) }} />
                        }
                        <button className="button primary" type="submit">Request Appointment</button>
                    </form>
                </li>
            </ul>
        </>
    )
}
