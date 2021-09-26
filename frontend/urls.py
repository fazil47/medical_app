from django.urls import path
from django.urls.conf import include

from .views import index

urlpatterns = [
    path('', index, name="index"),
    path('add/', index, name="add"),
    path('appointments/', index, name="appointments"),
    path('login/', index, name="login"),
    path('register/', index, name="register")
]
