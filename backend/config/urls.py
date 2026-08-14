from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    
    # Endpoints REST API du simulateur
    path('api/', include('simulator.urls')),
    
    # Endpoints REST Auth (login/logout/token)
    path('api/auth/', include('dj_rest_auth.urls')),
    
    # Routes Allauth pour le flux Web Google
    path('accounts/', include('allauth.urls')),
]