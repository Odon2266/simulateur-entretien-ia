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
router.register(r'profiles', CandidateProfileViewSet)
router.register(r'sessions', InterviewSessionViewSet)
router.register(r'messages', MessageViewSet)
router.register(r'reports', EvaluationReportViewSet)

urlpatterns = [
    # Routes du Router DRF (profiles, sessions, messages, reports)
    path('', include(router.urls)),
    
    # Endpoint pour se connecter avec Google
    path('auth/google/', GoogleLoginView.as_view(), name='google_login'),
    
    # Endpoint pour mettre à jour la clé API Ollama du candidat
    path('profile/update-key/', update_ollama_key, name='update_ollama_key'),
]