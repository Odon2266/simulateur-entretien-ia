from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CandidateProfileViewSet, InterviewSessionViewSet, MessageViewSet, EvaluationReportViewSet

router = DefaultRouter()
router.register(r'profiles', CandidateProfileViewSet)
router.register(r'sessions', InterviewSessionViewSet)
router.register(r'messages', MessageViewSet)
router.register(r'reports', EvaluationReportViewSet)

urlpatterns = [
    path('', include(router.urls)),
]