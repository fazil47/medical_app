from django.http import JsonResponse
from django.db import IntegrityError
from django.contrib.auth.decorators import login_required
from django.contrib.auth import authenticate, login, logout
import json
import datetime

from .models import Patient, Doctor, Appointment, User


def RegisterUser(request):
    """Registers a user"""
    if request.method != "POST":
        return JsonResponse({"error": "POST request is required."}, status=400)

    data = request.POST
    profile_picture = request.FILES.get('profile_picture')
    username = data.get("username")
    email = data.get("email")
    password = data.get("password")
    confirmation = data.get("confirmation")
    first_name = data.get("first_name")
    last_name = data.get("last_name")
    type = data.get("type")
    specialization = data.get("specialization")
    if password != confirmation:
        return JsonResponse({"message": "Password and confirmation do not match."}, status=406)

    try:
        user = User.objects.create_user(username=username,
                                        email=email, password=password, profile_picture=profile_picture, first_name=first_name, last_name=last_name, type=type)
        user.save()
    except IntegrityError:
        return JsonResponse({"message": "Account already exists with this username"}, status=409)

    if type == "patient":
        patient = Patient(user=user)
        patient.save()
    elif type == "doctor":
        doctor = Doctor(user=user, specialization=specialization)
        doctor.save()
    else:
        return JsonResponse({"message": "Invalid account type"}, status=406)

    login(request, user)
    return JsonResponse({"message": "User account successfully created."}, status=201)


def LoginUser(request):
    """Logs in a user"""
    if request.method != "POST":
        return JsonResponse({"error": "POST request is required."}, status=400)

    data = json.loads(request.body)
    username = data.get("username")
    password = data.get("password")
    user = authenticate(request, username=username, password=password)

    if user is not None:
        if data.get("type") == "patient":
            patient = Patient.objects.get(user=user)
            if patient is None:
                return JsonResponse({"message": "Username, type and/or password is incorrect"}, status=406)
        elif data.get("type") == "doctor":
            doctor = Doctor.objects.get(user=user)
            if doctor is None:
                return JsonResponse({"message": "Username, type and/or password is incorrect"}, status=406)

        login(request, user)
        return JsonResponse({"message": "User successfully logged in."}, status=202)
    else:
        return JsonResponse({"message": "Username, type and/or password is incorrect"}, status=406)


def LogoutUser(request):
    """Logs out the current user"""
    logout(request)
    return JsonResponse({"message": "Logged out"}, status=202)


@login_required
def CurrentUser(request):
    """Gets details about the current user"""
    user_type = request.user.type
    if user_type == "patient":
        return JsonResponse(Patient.objects.get(user=request.user).full_serialize(), status=200)
    elif user_type == "doctor":
        return JsonResponse(Doctor.objects.get(user=request.user).full_serialize(), status=200)
    else:
        return JsonResponse({"message": f"{request.user.username} is not a patient or a doctor"}, status=401)


@login_required
def RequestAppointment(request):
    """Requests an appointment with a doctor if the user is a patient"""
    if request.method != "POST":
        return JsonResponse({"error": "POST request is required."}, status=400)
    elif request.user.type != "patient":
        return JsonResponse({"error": f"{request.user.username} is not a patient, this is a valid operation only for patients"}, status=400)

    data = json.loads(request.body)
    date = data.get("date")
    request_time_slot = data.get("request_time_slot")
    patient_message = data.get("patient_message")
    doctor_id = data.get("doctor_id")

    date = datetime.datetime.strptime(date, "%Y-%m-%d").date()
    date_today = datetime.datetime.today().date()
    if date < date_today + datetime.timedelta(days=1):
        return JsonResponse({"message": "Appointments must have dates starting tomorrow."}, status=406)
    elif date > date_today + datetime.timedelta(days=8):
        return JsonResponse({"message": "Appointments can only be booked a week in advance."}, status=406)

    if request_time_slot not in Appointment.TIME_SLOTS:
        return JsonResponse({"message": "Invalid time slot."}, status=406)

    doctor_queryset = Doctor.objects.filter(pk=doctor_id)
    if doctor_queryset.count() < 1:
        return JsonResponse({"message": "Invalid Doctor ID."}, status=406)

    appointment = Appointment(
        date=date, request_time_slot=request_time_slot, patient_message=patient_message, patient=Patient.objects.get(user=request.user), doctor=doctor_queryset.first())
    appointment.save()
    return JsonResponse({"message": "Appointment successfully requested."}, status=201)


@login_required
def EditAppointment(request):
    """Edits an appointment if the user is a patient"""
    if request.method != "PUT":
        return JsonResponse({"error": "PUT request is required."}, status=400)
    elif request.user.type != "patient":
        return JsonResponse({"error", f"{request.user.username} is not a patient, this is a valid operation only for patients"}, status=400)

    data = json.loads(request.body)
    date = data.get("date")
    request_time_slot = data.get("request_time_slot")
    patient_message = data.get("patient_message")
    appointment_id = data.get("appointment_id")

    date = datetime.datetime.strptime(date, "%Y-%m-%d").date()
    date_today = datetime.datetime.today().date()
    if date < date_today + datetime.timedelta(days=1):
        return JsonResponse({"message": "Appointments must have dates later than today."}, status=406)
    elif date > date_today + datetime.timedelta(days=8):
        return JsonResponse({"message": "Appointments can only be booked for this week."}, status=406)

    if request_time_slot not in Appointment.TIME_SLOTS:
        return JsonResponse({"message": "Invalid time slot."}, status=406)

    appointment_queryset = Appointment.objects.filter(
        pk=appointment_id, patient=Patient.objects.get(user=request.user))
    if appointment_queryset.count() < 1:
        return JsonResponse({"message": "Invalid Appointment ID."}, status=406)

    appointment = appointment_queryset.first()
    appointment.date = date
    appointment.patient_message = patient_message
    appointment.request_time_slot = request_time_slot
    appointment.save()
    return JsonResponse({"message": "Appointment successfully edited."}, status=202)


@login_required
def DeleteAppointment(request):
    """Deletes an appointment if the user is a patient"""
    if request.method != "DELETE":
        return JsonResponse({"error": "DELETE request is required."}, status=400)
    elif request.user.type != "patient":
        return JsonResponse({"error", f"{request.user.username} is not a patient, this is a valid operation only for patients."}, status=400)

    data = json.loads(request.body)
    appointment_id = data.get("appointment_id")

    appointment_queryset = Appointment.objects.filter(
        pk=appointment_id, patient=Patient.objects.get(user=request.user))
    if appointment_queryset.count() < 1:
        return JsonResponse({"message": "Invalid Appointment."}, status=406)

    appointment_queryset.delete()
    return JsonResponse({"message": "Appointment successfully deleted."}, status=202)


@login_required
def AcceptAppointment(request):
    """Accepts an appointment if the user is a doctor"""
    if request.method != "PUT":
        return JsonResponse({"error": "PUT request is required."}, status=400)
    elif request.user.type != "doctor":
        return JsonResponse({"error", f"{request.user.username} is not a doctor, this is a valid operation only for doctors."}, status=406)

    data = json.loads(request.body)
    doctor_message = data.get("doctor_message")
    appointment_id = data.get("appointment_id")

    try:
        accepted_start_time = datetime.datetime.strptime(
            data.get("accepted_start_time"), "%H:%M").time()
    except ValueError:
        return JsonResponse({"error": "Accepted Start Time is not valid."}, status=406)
    except TypeError:
        return JsonResponse({"error": "Accepted Start Time is required."}, status=406)

    appointment_queryset = Appointment.objects.filter(
        pk=appointment_id, doctor=Doctor.objects.get(user=request.user))
    if appointment_queryset.count() < 1:
        return JsonResponse({"message": "Invalid Appointment."}, status=406)

    appointment = appointment_queryset.first()

    request_time_slot = appointment.request_time_slot
    if request_time_slot != "Any":
        # if the requested time slot is 9:00 - 12:00, first term will be 9:00 and second term will be 12:00
        request_time_extremes = request_time_slot.split(" - ")
        time_slot_start = datetime.datetime.strptime(
            request_time_extremes[0], "%H:%M").time()
        time_slot_end = datetime.datetime.strptime(
            request_time_extremes[1], "%H:%M").time()
    else:
        time_slot_start = datetime.datetime.strptime(
            "9:00", "%H:%M").time()
        time_slot_end = datetime.datetime.strptime(
            "17:00", "%H:%M").time()

    if accepted_start_time < time_slot_start or accepted_start_time >= time_slot_end:
        return JsonResponse({"message": f"accepted_start_time should be on or after {time_slot_start} and be before {time_slot_end} for this appointment."}, status=406)

    appointment.accepted = True
    appointment.accepted_start_time = accepted_start_time
    appointment.doctor_message = doctor_message
    appointment.save()

    return JsonResponse({"message": "Appointment successfully accepted."}, status=202)


@login_required
def RejectAppointment(request):
    """Rejects an appointments if the user is a doctor"""
    if request.method != "PUT":
        return JsonResponse({"error": "PUT request is required."}, status=400)
    elif request.user.type != "doctor":
        return JsonResponse({"error", f"{request.user.username} is not a doctor, this is a valid operation only for doctors."}, status=406)

    data = json.loads(request.body)
    doctor_message = data.get("doctor_message")
    appointment_id = data.get("appointment_id")

    appointment_queryset = Appointment.objects.filter(
        pk=appointment_id, doctor=Doctor.objects.get(user=request.user))
    if appointment_queryset.count() < 1:
        return JsonResponse({"message": "Invalid Appointment."}, status=406)

    appointment = appointment_queryset.first()

    appointment.rejected = True
    appointment.doctor_message = doctor_message
    appointment.save()
    return JsonResponse({"message": "Appointment successfully rejected."}, status=202)


@login_required
def PatientAppointments(request):
    """Returns a list of appointments of a patient"""
    if request.user.type == "patient":
        appointments = Appointment.objects.filter(
            patient=Patient.objects.get(user=request.user))
        appointments = appointments.order_by("date").all()
        return JsonResponse({"appointments": [appointment.serialize_for_patient() for appointment in appointments]}, status=200)
    else:
        return JsonResponse({"message": f"{request.user.username} is not a patient or a doctor"}, status=401)


@login_required
def AcceptedDoctorAppointments(request):
    """Returns a list of accepted appointments of a doctor"""
    if request.user.type == "doctor":
        appointments = Appointment.objects.filter(
            doctor=Doctor.objects.get(user=request.user), accepted=True)
        appointments = appointments.order_by("date").all()
        return JsonResponse({"appointments": [appointment.serialize_for_doctor() for appointment in appointments]}, status=200)
    else:
        return JsonResponse({"message": f"{request.user.username} is not a doctor, this is a valid operation only for doctors"}, status=401)


@login_required
def RequestedDoctorAppointments(request):
    """Returns a list of requested appointments of a doctor"""
    if request.user.type == "doctor":
        appointments = Appointment.objects.filter(
            doctor=Doctor.objects.get(user=request.user), accepted=False, rejected=False)
        appointments = appointments.order_by("date").all()
        return JsonResponse({"appointments": [appointment.serialize_for_doctor() for appointment in appointments]}, status=200)
    else:
        return JsonResponse({"message": f"{request.user.username} is not a doctor, this is a valid operation only for doctors"}, status=401)


def AvailableDoctors(request):
    """Returns a list of doctors a patient currently doesn't have a pending or accepted appointment with"""
    if request.user.type == "patient":
        all_doctors = set(Doctor.objects.all())
        doctors_with_appointment_with_user = set([appointment.doctor for appointment in Patient.objects.get(
            user=request.user).appointments.filter(rejected=False)])
        doctors = all_doctors - doctors_with_appointment_with_user
        return JsonResponse({"doctors": [doctor.public_serialize() for doctor in doctors]}, status=200)
    else:
        return JsonResponse({"message": f"{request.user.username} is not a patient, this is a valid operation only for patients"}, status=400)
