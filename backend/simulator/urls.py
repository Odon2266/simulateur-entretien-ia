from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    CandidateProfileViewSet,
    InterviewSessionViewSet,
    MessageViewSet,
    EvaluationReportViewSet,
    GoogleLoginView,
    update_ollama_key
)

router = DefaultRouter()
router.register(r'profiles', CandidateProfileViewSet, basename='profile')
router.register(r'sessions', InterviewSessionViewSet, basename='session')
router.register(r'messages', MessageViewSet, basename='message')
router.register(r'reports', EvaluationReportViewSet, basename='report')

urlpatterns = [
    # Routes du Router DRF (ex: /api/profiles/upload_cv/, /api/sessions/, etc.)
    path('', include(router.urls)),
    
    # Endpoint pour se connecter avec Google
    path('auth/google/', GoogleLoginView.as_view(), name='google_login'),
    
    # Endpoint pour mettre à jour la clé API Ollama du candidat
    path('profile/update-key/', update_ollama_key, name='update_ollama_key'),
]