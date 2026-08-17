from rest_framework import viewsets, status
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth.models import User

# Imports pour Allauth & Google OAuth
from allauth.socialaccount.providers.google.views import GoogleOAuth2Adapter
from allauth.socialaccount.providers.oauth2.client import OAuth2Client
from dj_rest_auth.registration.views import SocialLoginView

from .models import CandidateProfile, InterviewSession, Message, EvaluationReport
from .serializers import (
    UserSerializer,
    CandidateProfileSerializer,
    InterviewSessionSerializer,
    MessageSerializer,
    EvaluationReportSerializer
)
from .services import get_ai_response


# ==========================================
# AUTHENTIFICATION & PROFIL
# ==========================================

class GoogleLoginView(SocialLoginView):
    """Endpoint pour valider le token Google venant du frontend"""
    adapter_class = GoogleOAuth2Adapter
    callback_url = "http://localhost:5173"  # URL de ton frontend React
    client_class = OAuth2Client


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def update_ollama_key(request):
    """Endpoint pour enregistrer/mettre à jour la clé API Ollama personnelle du candidat"""
    # On s'assure que l'utilisateur a un profil
    profile, created = CandidateProfile.objects.get_or_create(user=request.user)
    api_key = request.data.get('api_key')
    
    if not api_key:
        return Response({"error": "La clé API est requise."}, status=status.HTTP_400_BAD_REQUEST)
        
    profile.api_key = api_key
    profile.save()
    return Response({"message": "Clé API Ollama enregistrée avec succès !"}, status=status.HTTP_200_OK)


# ==========================================
# VIEWSETS SIMULATEUR (SÉCURISÉS)
# ==========================================

class CandidateProfileViewSet(viewsets.ModelViewSet):
    queryset = CandidateProfile.objects.all()
    serializer_class = CandidateProfileSerializer
    permission_classes = [IsAuthenticated]


class InterviewSessionViewSet(viewsets.ModelViewSet):
    queryset = InterviewSession.objects.all()
    serializer_class = InterviewSessionSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Filtre les sessions pour ne retourner que celles de l'utilisateur connecté
        return InterviewSession.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        # Associe automatiquement l'utilisateur connecté à la nouvelle session
        serializer.save(user=self.request.user)

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

        # 2. Obtenir la réponse générée par l'IA
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
    permission_classes = [IsAuthenticated]


class EvaluationReportViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = EvaluationReport.objects.all()
    serializer_class = EvaluationReportSerializer
    permission_classes = [IsAuthenticated]