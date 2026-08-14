from rest_framework import serializers
from django.contrib.auth.models import User
from .models import CandidateProfile, InterviewSession, Message, EvaluationReport

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email']

class CandidateProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = CandidateProfile
        fields = ['id', 'user', 'api_key', 'cv_file', 'cv_text', 'created_at']

class MessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Message
        fields = ['id', 'session', 'sender', 'content', 'timestamp']

class InterviewSessionSerializer(serializers.ModelSerializer):
    messages = MessageSerializer(many=True, read_only=True)

    class Meta:
        model = InterviewSession
        fields = ['id', 'user', 'job_title', 'job_description', 'status', 'created_at', 'messages']
        read_only_fields = ['user']

class EvaluationReportSerializer(serializers.ModelSerializer):
    class Meta:
        model = EvaluationReport
        fields = ['id', 'session', 'score', 'strengths', 'improvements', 'detailed_feedback', 'created_at']