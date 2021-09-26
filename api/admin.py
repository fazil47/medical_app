from django.contrib import admin
from .models import Patient, Doctor, Appointment, User

# Register your models here.
admin.site.register(User)
admin.site.register(Patient)
admin.site.register(Doctor)
admin.site.register(Appointment)
