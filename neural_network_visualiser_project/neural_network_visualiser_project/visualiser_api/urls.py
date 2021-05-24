#api urls

from django.contrib import admin
from django.urls import path
from . import views as api_views

urlpatterns = [
    path('get_output/', api_views.get_output),
]