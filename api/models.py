from django.db import models
from django.contrib.auth.models import AbstractUser
from django.db.models.deletion import CASCADE


def profile_upload_path(instance, filename):
    return '/'.join(['profile_pictures', instance.username, filename])


class User(AbstractUser):
    profile_picture = models.ImageField(
        null=True, blank=True, upload_to=profile_upload_path)
    type = models.CharField(max_length=64, null=True, blank=True)

    def __str__(self) -> str:
        return f"{self.username} of type {self.type}"


class Patient(models.Model):
    user = models.ForeignKey(User, on_delete=CASCADE, related_name="patients")

    def __str__(self) -> str:
        return f"Patient {self.user.username}"

    def public_serialize(self):
        return {
            "id": self.pk,
            "first_name": self.user.first_name,
            "last_name": self.user.last_name,
            "profile_picture_url": self.user.profile_picture.url if self.user.profile_picture else None,
            "type": "patient",
        }

    def full_serialize(self):
        return {
            "id": self.pk,
            "username": self.user.username,
            "first_name": self.user.first_name,
            "last_name": self.user.last_name,
            "profile_picture_url": self.user.profile_picture.url if self.user.profile_picture else None,
            "type": "patient",
        }


class Doctor(models.Model):
    user = models.ForeignKey(User, on_delete=CASCADE, related_name="doctors")
    specialization = models.CharField(max_length=100)

    def __str__(self) -> str:
        return f"Doctor {self.user.username}"

    def public_serialize(self):
        return {
            "id": self.pk,
            "first_name": self.user.first_name,
            "last_name": self.user.last_name,
            "specialization": self.specialization,
            "profile_picture_url": self.user.profile_picture.url if self.user.profile_picture else None,
            "type": "doctor",
        }

    def full_serialize(self):
        return {
            "id": self.pk,
            "username": self.user.username,
            "first_name": self.user.first_name,
            "last_name": self.user.last_name,
            "specialization": self.specialization,
            "profile_picture_url": self.user.profile_picture.url if self.user.profile_picture else None,
            "type": "doctor",
        }


class Appointment(models.Model):
    TIME_SLOTS = ["9:00 - 12:00", "13:00 - 17:00", "Any"]
    date = models.DateField()
    request_time_slot = models.CharField(max_length=64)
    accepted_start_time = models.TimeField(null=True, blank=True)
    patient = models.ForeignKey(
        Patient, on_delete=CASCADE, related_name="appointments")
    doctor = models.ForeignKey(
        Doctor, on_delete=CASCADE, related_name="appointments")
    accepted = models.BooleanField(default=False)
    rejected = models.BooleanField(default=False)
    patient_message = models.CharField(max_length=280, null=True, blank=True)
    doctor_message = models.CharField(max_length=280, null=True, blank=True)

    class Meta:
        unique_together = ('patient', 'doctor', 'id')

    def __str__(self) -> str:
        return f"{self.patient}'s appointment with {self.doctor} on {self.date}"

    def serialize_for_patient(self):
        return {
            "id": self.pk,
            "doctor_details": self.doctor.public_serialize(),
            "accepted": self.accepted,
            "rejected": self.rejected,
            "date": self.date,
            "request_time_slot": self.request_time_slot,
            "accepted_start_time": self.accepted_start_time,
            "patient_message": self.patient_message,
            "doctor_message": self.doctor_message,
        }

    def serialize_for_doctor(self):
        return {
            "id": self.pk,
            "patient_details": self.patient.public_serialize(),
            "accepted": self.accepted,
            "rejected": self.rejected,
            "date": self.date,
            "request_time_slot": self.request_time_slot,
            "accepted_start_time": self.accepted_start_time,
            "patient_message": self.patient_message,
            "doctor_message": self.doctor_message,
        }
