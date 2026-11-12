from django.urls import path

from .views import card_detail


urlpatterns = [
    path("card/", card_detail, name="card-detail"),
]
