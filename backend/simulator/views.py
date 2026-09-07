from datetime import timedelta
import pypdf
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from django.utils import timezone
from rest_framework import viewsets, status
from rest_framework.views import APIView
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny, IsAdminUser
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from rest_framework.authtoken.models import Token

# Imports pour Allauth & Google OAuth
from allauth.socialaccount.providers.google.views import GoogleOAuth2Adapter
from allauth.socialaccount.providers.oauth2.client import OAuth2Client
from dj_rest_auth.registration.views import SocialLoginView

from .models import (
    CandidateProfile, 
    InterviewSession, 
    Message, 
    EvaluationReport, 
    PracticeResult,
    SiteVisit
)
from .serializers import (
    UserSerializer,
    CandidateProfileSerializer,
    InterviewSessionSerializer,
    MessageSerializer,
    EvaluationReportSerializer,
    PracticeResultSerializer, 
)
from .services import (
    get_ai_response, 
    generate_quiz_with_ai, 
    evaluate_system_design_with_ai,
    generate_code_review_with_ai,
    evaluate_code_review_with_ai,
    generate_algo_problem_with_ai,
    evaluate_algo_complexity_with_ai,
)


# ==========================================
# AUTHENTIFICATION & PROFIL
# ==========================================

@api_view(['POST'])
@permission_classes([AllowAny])
def custom_login_view(request):
    """
    Endpoint personnalisé pour la connexion.
    Retourne le token et les droits d'administration (is_staff / is_superuser).
    """
    username_or_email = request.data.get('username') or request.data.get('email')
    password = request.data.get('password')

    if not username_or_email or not password:
        return Response({'detail': 'Veuillez fournir un identifiant et un mot de passe.'}, status=status.HTTP_400_BAD_REQUEST)

    # 1. Tentative d'authentification par username
    user = authenticate(request, username=username_or_email, password=password)

    # 2. Si échoué et contient un '@', recherche par email
    if user is None and '@' in str(username_or_email):
        try:
            user_obj = User.objects.get(email=username_or_email)
            user = authenticate(request, username=user_obj.username, password=password)
        except User.DoesNotExist:
            user = None

    if user is not None:
        token, _ = Token.objects.get_or_create(user=user)
        return Response({
            'token': token.key,
            'user': {
                'id': user.id,
                'username': user.username,
                'email': user.email,
                'is_staff': user.is_staff,
                'is_superuser': user.is_superuser
            }
        }, status=status.HTTP_200_OK)

    return Response({'detail': 'Identifiants invalides.'}, status=status.HTTP_400_BAD_REQUEST)


class GoogleLoginView(SocialLoginView):
    """Endpoint pour valider le token Google venant du frontend"""
    adapter_class = GoogleOAuth2Adapter
    callback_url = "http://localhost:5173"  # URL de votre frontend React
    client_class = OAuth2Client

    def get_response(self):
        response = super().get_response()
        user = self.user
        
        CandidateProfile.objects.get_or_create(user=user)

        full_name = f"{user.first_name} {user.last_name}".strip() or user.username

        response.data['user'] = {
            'id': user.id,
            'email': user.email,
            'name': full_name,
            'is_staff': user.is_staff,
            'is_superuser': user.is_superuser
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
# GESTION DES RÉSULTATS D'ENTRAÎNEMENT
# ==========================================

class PracticeResultViewSet(viewsets.ModelViewSet):
    serializer_class = PracticeResultSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return PracticeResult.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


# ==========================================
# GENERATION DE QUIZ TECHNIQUE (OLLAMA)
# ==========================================

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
# EVALUATION SYSTEM DESIGN (OLLAMA)
# ==========================================

class EvaluateSystemDesignView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        data = request.data

        scenario_title = data.get('scenario_title', '')
        database_choice = data.get('database_choice', '')
        cache_strategy = data.get('cache_strategy', '')
        messaging_strategy = data.get('messaging_strategy', '')
        architecture_details = data.get('architecture_details', '')

        if not architecture_details:
            return Response(
                {"error": "Les détails de l'architecture sont requis."},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            evaluation = evaluate_system_design_with_ai(
                user=request.user,
                scenario_title=scenario_title,
                database_choice=database_choice,
                cache_strategy=cache_strategy,
                messaging_strategy=messaging_strategy,
                architecture_details=architecture_details
            )
            return Response(evaluation, status=status.HTTP_200_OK)
        except ValueError as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({"error": f"Erreur d'évaluation : {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


# ==========================================
# REVUE DE CODE & DEBOGAGE (OLLAMA)
# ==========================================

class GenerateCodeReviewView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        language = request.data.get('language', 'python')

        try:
            code_data = generate_code_review_with_ai(request.user, language=language)
            return Response(code_data, status=status.HTTP_200_OK)
        except ValueError as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({"error": f"Erreur de génération : {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class EvaluateCodeReviewView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        code_snippet = request.data.get('code_snippet', '')
        candidate_analysis = request.data.get('candidate_analysis', '')

        if not code_snippet:
            return Response({"error": "L'extrait de code est requis."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            evaluation = evaluate_code_review_with_ai(request.user, code_snippet, candidate_analysis)
            return Response(evaluation, status=status.HTTP_200_OK)
        except ValueError as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


# ==========================================
# ALGORITHMIQUE & COMPLEXITÉ (OLLAMA)
# ==========================================

class GenerateAlgoProblemView(APIView):
    """Génère un problème d'algorithmique dynamique via IA"""
    permission_classes = [IsAuthenticated]

    def post(self, request):
        topic = request.data.get('topic', 'Structures de données')
        difficulty = request.data.get('difficulty', 'moyen')

        try:
            problem = generate_algo_problem_with_ai(
                user=request.user, 
                topic=topic, 
                difficulty=difficulty
            )
            return Response(problem, status=status.HTTP_200_OK)
        except ValueError as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({"error": f"Erreur de génération : {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class EvaluateAlgoComplexityView(APIView):
    """Évalue le code d'algorithme et la complexité Big-O soumis par le candidat"""
    permission_classes = [IsAuthenticated]

    def post(self, request):
        data = request.data

        problem_statement = data.get('problem_statement', '')
        candidate_code = data.get('candidate_code', '')
        time_complexity = data.get('time_complexity', '')
        space_complexity = data.get('space_complexity', '')

        if not candidate_code or not problem_statement:
            return Response(
                {"error": "L'énoncé du problème et le code du candidat sont requis."},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            evaluation = evaluate_algo_complexity_with_ai(
                user=request.user,
                problem_statement=problem_statement,
                candidate_code=candidate_code,
                time_complexity_claim=time_complexity,
                space_complexity_claim=space_complexity
            )
            return Response(evaluation, status=status.HTTP_200_OK)
        except ValueError as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({"error": f"Erreur d'évaluation : {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


# ==========================================
# VIEWSETS SIMULATEUR & CV
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

        profile.cv_file = cv_file

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
        return InterviewSession.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
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

        candidate_msg = Message.objects.create(
            session=session,
            sender='CANDIDATE',
            content=user_text
        )

        ai_text = get_ai_response(session, user_message=user_text)

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


# ==========================================
# STATISTIQUES & VISITES SITE
# ==========================================

@api_view(['POST'])
@permission_classes([AllowAny])
def track_visit(request):
    """Enregistre une visite envoyée par le frontend"""
    x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
    if x_forwarded_for:
        ip = x_forwarded_for.split(',')[0].strip()
    else:
        ip = request.META.get('REMOTE_ADDR')
        
    user_agent = request.META.get('HTTP_USER_AGENT', '')
    path = request.data.get('path', '/')

    SiteVisit.objects.create(
        ip_address=ip,
        user_agent=user_agent,
        path=path
    )
    return Response({'status': 'tracked'})


@api_view(['GET'])
@permission_classes([IsAdminUser])
def visit_stats(request):
    """Renvoie les statistiques cumulées pour les administrateurs"""
    now = timezone.now()
    today = now.date()
    seven_days_ago = now - timedelta(days=7)

    total_visits = SiteVisit.objects.count()
    today_visits = SiteVisit.objects.filter(timestamp__date=today).count()
    week_visits = SiteVisit.objects.filter(timestamp__gte=seven_days_ago).count()
    unique_visitors = SiteVisit.objects.values('ip_address').distinct().count()

    return Response({
        'total_visits': total_visits,
        'today_visits': today_visits,
        'week_visits': week_visits,
        'unique_visitors': unique_visitors,
    })