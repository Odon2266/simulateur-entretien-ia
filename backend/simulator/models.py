from django.db import models
from django.contrib.auth.models import User

class CandidateProfile(models.Model):
    """Stocke les informations du candidat et sa clé API personnelle (BYOK)"""
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    api_key = models.CharField(max_length=255, blank=True, null=True, help_text="Clé API Gemini/OpenRouter de l'utilisateur")
    cv_file = models.FileField(upload_to='cvs/', blank=True, null=True)
    cv_text = models.TextField(blank=True, null=True, help_text="Texte extrait du CV PDF")
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Profil de {self.user.username}"


class InterviewSession(models.Model):
    """Représente une session d'entretien d'embauche"""
    STATUS_CHOICES = [
        ('PENDING', 'En attente'),
        ('IN_PROGRESS', 'En cours'),
        ('COMPLETED', 'Terminé'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='interviews')
    job_title = models.CharField(max_length=200, help_text="Intitulé du poste (ex: Développeur Full-Stack)")
    job_description = models.TextField(help_text="Fiche de poste / Exigences")
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='PENDING')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Entretien {self.job_title} - {self.user.username} ({self.status})"


class Message(models.Model):
    """Stocke chaque échange (question recruteur / réponse candidat)"""
    SENDER_CHOICES = [
        ('RECRUITER', 'Recruteur IA'),
        ('CANDIDATE', 'Candidat'),
    ]

    session = models.ForeignKey(InterviewSession, on_delete=models.CASCADE, related_name='messages')
    sender = models.CharField(max_length=10, choices=SENDER_CHOICES)
    content = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.sender}: {self.content[:30]}..."


class EvaluationReport(models.Model):
    """Stocke le bilan final généré par l'IA"""
    session = models.OneToOneField(InterviewSession, on_delete=models.CASCADE, related_name='report')
    score = models.IntegerField(help_text="Note globale sur 100")
    strengths = models.JSONField(default=list, help_text="Points forts")
    improvements = models.JSONField(default=list, help_text="Axes d'amélioration")
    detailed_feedback = models.JSONField(default=dict, help_text="Analyse question par question")
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Rapport pour {self.session.job_title} - Score: {self.score}/100"

class PracticeResult(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='practice_results')
    category = models.CharField(max_length=100)
    score = models.IntegerField()
    total_questions = models.IntegerField(default=20)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.user.username} - {self.category} : {self.score}/{self.total_questions}"