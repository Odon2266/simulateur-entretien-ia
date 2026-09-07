from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    CandidateProfileViewSet,
    InterviewSessionViewSet,
    MessageViewSet,
    EvaluationReportViewSet,
    GoogleLoginView,
    custom_login_view,
    update_ollama_key,
    QuizGenerateView,
    PracticeResultViewSet,
    EvaluateSystemDesignView,
    EvaluateCodeReviewView,
    GenerateCodeReviewView,
    GenerateAlgoProblemView,
    EvaluateAlgoComplexityView,
    track_visit,
    visit_stats,
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
    
    # Endpoint de connexion personnalisé
    path('auth/custom-login/', custom_login_view, name='custom-login'),

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

    # Endpoints pour Algorithmique & Complexité (Génération + Évaluation)
    path('generate-algo/', GenerateAlgoProblemView.as_view(), name='generate-algo'),
    path('evaluate-algo/', EvaluateAlgoComplexityView.as_view(), name='evaluate-algo'),

    # Endpoints pour le suivi des visites et les statistiques
    path('track-visit/', track_visit, name='track-visit'),
    path('admin/stats/', visit_stats, name='visit-stats'),
]