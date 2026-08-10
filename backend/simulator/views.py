from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.contrib.auth.models import User

from .models import CandidateProfile, InterviewSession, Message, EvaluationReport
from .serializers import (
    UserSerializer,
    CandidateProfileSerializer,
    InterviewSessionSerializer,
    MessageSerializer,
    EvaluationReportSerializer
)
from .services import get_ai_response


class CandidateProfileViewSet(viewsets.ModelViewSet):
    queryset = CandidateProfile.objects.all()
    serializer_class = CandidateProfileSerializer


class InterviewSessionViewSet(viewsets.ModelViewSet):
    queryset = InterviewSession.objects.all()
    serializer_class = InterviewSessionSerializer

    def get_queryset(self):
        # Filtre les sessions pour ne retourner que celles de l'utilisateur connecté
        if self.request.user.is_authenticated:
            return InterviewSession.objects.filter(user=self.request.user)
        return super().get_queryset()

    @action(detail=True, methods=['post'])
    def send_message(self, request, pk=None):
        session = self.get_object()
        user_text = request.data.get('content', '')

        if not user_text:
            return Response(
                {'error': 'Le contenu du message ne peut pas être vide.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # 1. Enregistrer le message du candidat
        candidate_msg = Message.objects.create(
            session=session,
            sender='CANDIDATE',
            content=user_text
        )

        # 2. Obtenir la réponse générée par l'IA Gemini
        ai_text = get_ai_response(session, user_message=user_text)

        # 3. Enregistrer la réponse du recruteur IA
        ai_msg = Message.objects.create(
            session=session,
            sender='RECRUITER',
            content=ai_text
        )

        return Response({
            'candidate_message': MessageSerializer(candidate_msg).data,
            'ai_message': MessageSerializer(ai_msg).data
        }, status=status.HTTP_201_CREATED)


class MessageViewSet(viewsets.ModelViewSet):
    queryset = Message.objects.all()
    serializer_class = MessageSerializer


class EvaluationReportViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = EvaluationReport.objects.all()
    serializer_class = EvaluationReportSerializer