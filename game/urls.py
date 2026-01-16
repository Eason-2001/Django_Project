from django.urls import path
from game.views import index, eioeif

urlpatterns = [
        path("",index,name="index"),
        path("eioeif/",eioeif,name="eioeif")
    ]
