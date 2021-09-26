from django.urls import path

from .views import RegisterUser, LoginUser, LogoutUser, CurrentUser, AvailableDoctors, RequestAppointment, PatientAppointments, RequestedDoctorAppointments, AcceptedDoctorAppointments, AcceptAppointment, RejectAppointment, EditAppointment, DeleteAppointment

urlpatterns = [
    # path('patient_list', PatientView.as_view(), name="patient"),
    # path('doctor_list', DoctorView.as_view(), name="doctor"),
    # path('appointment_list', AppointmentView.as_view(), name="appointment"),
    path('register', RegisterUser, name="register"),
    path('login', LoginUser, name="login"),
    path('logout', LogoutUser, name="logout"),
    path('current_user', CurrentUser, name="current_user"),
    path('available_doctors', AvailableDoctors, name="available_doctors"),
    path('request_appointment', RequestAppointment, name="request_appointment"),
    path('accept_appointment', AcceptAppointment, name="accept_appointment"),
    path('reject_appointment', RejectAppointment, name="reject_appointment"),
    path('patient_appointments', PatientAppointments,
         name="patient_appointments"),
    path('requested_doctor_appointments', RequestedDoctorAppointments,
         name="pending_doctor_appointments"),
    path('accepted_doctor_appointments', AcceptedDoctorAppointments,
         name="accepted_doctor_appointments"),
    path('edit_appointment', EditAppointment, name="edit_appointment"),
    path('delete_appointment', DeleteAppointment, name="delete_appointment"),
]
