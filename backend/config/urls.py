# config/urls.py complet

from django.contrib import admin
from django.urls import path, include
# Importe la vue que nous avons créée dans simulator
from simulator.views import GoogleLoginView 

urlpatterns = [
    path('admin/', admin.site.urls),
    
    # Endpoints REST API du simulateur (ton ViewSet, etc.)
    path('api/', include('simulator.urls')),
    
    # Endpoints REST Auth classiques (login/logout/user)
    path('api/auth/', include('dj_rest_auth.urls')),
    
    # Endpoint d'inscription classique
    path('api/auth/registration/', include('dj_rest_auth.registration.urls')),
    
    # Endpoint pour valider le token Google venant du frontend (POST)
    path('api/auth/google/', GoogleLoginView.as_view(), name='google_login'),

    # Routes internes de allauth (nécessaire pour résoudre l'erreur NoReverseMatch)
    path('accounts/', include('allauth.urls')),
]