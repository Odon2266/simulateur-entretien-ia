import pypdf
from rest_framework import viewsets, status
from rest_framework.views import APIView
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from django.contrib.auth.models import User

# Imports pour Allauth & Google OAuth
from allauth.socialaccount.providers.google.views import GoogleOAuth2Adapter
from allauth.socialaccount.providers.oauth2.client import OAuth2Client
from dj_rest_auth.registration.views import SocialLoginView

from .models import CandidateProfile, InterviewSession, Message, EvaluationReport,PracticeResult
from .serializers import (
    UserSerializer,
    CandidateProfileSerializer,
    InterviewSessionSerializer,
    MessageSerializer,
    EvaluationReportSerializer,
    PracticeResultSerializer
)
from .services import get_ai_response, generate_quiz_with_ai


# ==========================================
# AUTHENTIFICATION & PROFIL
# ==========================================

class GoogleLoginView(SocialLoginView):
    """Endpoint pour valider le token Google venant du frontend"""
    adapter_class = GoogleOAuth2Adapter
    callback_url = "http://localhost:5173"  # URL de ton frontend React
    client_class = OAuth2Client

    def get_response(self):
        # 1. Laisse dj_rest_auth valider le token et faire l'insertion SQL (User)
        response = super().get_response()
        
        # 2. Récupère l'utilisateur qui vient d'être connecté/créé
        user = self.user
        
        # 3. Sécurité : On s'assure que son CandidateProfile est créé
        CandidateProfile.objects.get_or_create(user=user)

        # 4. Construction du nom complet depuis la base de données
        full_name = f"{user.first_name} {user.last_name}".strip() or user.username

        # 5. Injection des données dans la réponse JSON
        response.data['user'] = {
            'id': user.id,
            'email': user.email,
            'name': full_name,
        }
        
        return response


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def update_ollama_key(request):
    """Endpoint pour enregistrer/mettre à jour la clé API Ollama personnelle du candidat"""
    profile, created = CandidateProfile.objects.get_or_create(user=request.user)
    api_key = request.data.get('api_key')
    
    if not api_key:
        return Response({"error": "La clé API est requise."}, status=status.HTTP_400_BAD_REQUEST)
        
    profile.api_key = api_key
    profile.save()
    return Response({"message": "Clé API Ollama enregistrée avec succès !"}, status=status.HTTP_200_OK)


# ==========================================
# GENERATION DE QUIZ TECHNIQUE (OLLAMA)
# ==========================================
class PracticeResultViewSet(viewsets.ModelViewSet):
    serializer_class = PracticeResultSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return PracticeResult.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class QuizGenerateView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        category = request.query_params.get('category', 'React & Frontend')
        count = int(request.query_params.get('count', 20))

        try:
            questions = generate_quiz_with_ai(request.user, category=category, count=count)
            return Response(questions, status=status.HTTP_200_OK)
        except ValueError as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({"error": f"Erreur de génération : {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# ==========================================
# VIEWSETS SIMULATEUR & CV (SÉCURISÉS)
# ==========================================

class CandidateProfileViewSet(viewsets.ModelViewSet):
    queryset = CandidateProfile.objects.all()
    serializer_class = CandidateProfileSerializer
    permission_classes = [IsAuthenticated]
    parser_classes = (MultiPartParser, FormParser, JSONParser)

    def get_object(self):
        profile, _ = CandidateProfile.objects.get_or_create(user=self.request.user)
        return profile

    @action(detail=False, methods=['post'], parser_classes=[MultiPartParser, FormParser])
    def upload_cv(self, request):
        """Endpoint pour téléverser le CV (PDF) et extraire son texte"""
        profile = self.get_object()
        cv_file = request.FILES.get('cv_file')

        if not cv_file:
            return Response({"error": "Aucun fichier CV n'a été fourni."}, status=status.HTTP_400_BAD_REQUEST)

        # 1. Sauvegarde du fichier PDF dans le modèle
        profile.cv_file = cv_file

        # 2. Extraction automatique du texte PDF avec pypdf
        try:
            reader = pypdf.PdfReader(cv_file)
            extracted_text = ""
            for page in reader.pages:
                text = page.extract_text()
                if text:
                    extracted_text += text + "\n"
            
            profile.cv_text = extracted_text.strip()
            profile.save()

            return Response({
                "message": "CV téléversé et analysé avec succès !",
                "profile": CandidateProfileSerializer(profile).data
            }, status=status.HTTP_200_OK)

        except Exception as e:
            profile.save()
            return Response({
                "message": "CV téléversé, mais l'extraction de texte a échoué.",
                "error": str(e)
            }, status=status.HTTP_400_BAD_REQUEST)


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