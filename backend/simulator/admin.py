from django.contrib import admin
from .models import CandidateProfile, InterviewSession, Message, EvaluationReport, SiteVisit

admin.site.register(CandidateProfile)
admin.site.register(InterviewSession)
admin.site.register(Message)
admin.site.register(EvaluationReport)

@admin.register(SiteVisit)
class SiteVisitAdmin(admin.ModelAdmin):
    list_display = ('timestamp', 'ip_address', 'path')
    list_filter = ('timestamp', 'path')
    search_fields = ('ip_address', 'user_agent')
    readonly_fields = ('timestamp', 'ip_address', 'user_agent', 'path')