from django.contrib import admin
from .models import CandidateProfile, InterviewSession, Message, EvaluationReport

admin.site.register(CandidateProfile)
admin.site.register(InterviewSession)
admin.site.register(Message)
admin.site.register(EvaluationReport)