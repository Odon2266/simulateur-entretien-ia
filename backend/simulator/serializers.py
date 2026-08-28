# backend/simulator/serializers.py
from rest_framework import serializers
from django.contrib.auth.models import User
from .models import CandidateProfile, InterviewSession, Message, EvaluationReport


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name']
        read_only_fields = ['id']


class CandidateProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = CandidateProfile
        fields = ['id', 'user', 'api_key', 'cv_file', 'cv_text', 'created_at']
        read_only_fields = ['id', 'user', 'cv_text', 'created_at']


class MessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Message
        fields = ['id', 'session', 'sender', 'content', 'timestamp']
        read_only_fields = ['id', 'timestamp']


class EvaluationReportSerializer(serializers.ModelSerializer):
    class Meta:
        model = EvaluationReport
        fields = ['id', 'session', 'score', 'strengths', 'improvements', 'detailed_feedback', 'created_at']
        read_only_fields = ['id', 'created_at']


class InterviewSessionSerializer(serializers.ModelSerializer):
    messages = MessageSerializer(many=True, read_only=True)
    report = EvaluationReportSerializer(read_only=True)

    class Meta:
        model = InterviewSession
        fields = ['id', 'user', 'job_title', 'job_description', 'status', 'created_at', 'messages', 'report']
        read_only_fields = ['id', 'user', 'status', 'created_at']