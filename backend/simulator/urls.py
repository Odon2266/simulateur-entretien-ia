from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    CandidateProfileViewSet,
    InterviewSessionViewSet,
    MessageViewSet,
    EvaluationReportViewSet,
    GoogleLoginView,
    update_ollama_key,
    QuizGenerateView,
    PracticeResultViewSet,
    EvaluateSystemDesignView,
    EvaluateCodeReviewView,
    GenerateCodeReviewView,  # <--- Ajouté ici
)

router = DefaultRouter()
router.register(r'profiles', CandidateProfileViewSet, basename='profile')
router.register(r'sessions', InterviewSessionViewSet, basename='session')
router.register(r'messages', MessageViewSet, basename='message')
router.register(r'reports', EvaluationReportViewSet, basename='report')
router.register(r'practice-results', PracticeResultViewSet, basename='practice-result')

urlpatterns = [
    # Routes du Router DRF (ex: /api/profiles/upload_cv/, /api/sessions/, etc.)
    path('', include(router.urls)),
    
    # Endpoint pour se connecter avec Google
    path('auth/google/', GoogleLoginView.as_view(), name='google_login'),
    
    # Endpoint pour mettre à jour la clé API Ollama du candidat
    path('profile/update-key/', update_ollama_key, name='update_ollama_key'),

    # Endpoint pour générer les questions QCM via Ollama
    path('quiz/', QuizGenerateView.as_view(), name='quiz_generate'),

    # Endpoint pour l'évaluation de System Design via Ollama
    path('system-design/evaluate/', EvaluateSystemDesignView.as_view(), name='system_design_evaluate'),

    # Endpoints pour Code Review (Génération + Évaluation)
    path('generate-code-review/', GenerateCodeReviewView.as_view(), name='generate-code-review'),
    path('evaluate-code-review/', EvaluateCodeReviewView.as_view(), name='evaluate-code-review'),
]