from django.contrib import admin
from .models import Events, EventParticipant

# Register your models here.
class EventsAdmin(admin.ModelAdmin):
    list_display = ('id', 'title_jp', 'location', 'date', 'start_time', 'end_time', 'created_by', 'created_at', 'updated_at')
    list_display_links = ('id', 'title_jp')
    search_fields = ('id', 'title_jp')
    ordering = ('id', )

class EventParticipantAdmin(admin.ModelAdmin):
    list_display = ('id', 'event', 'user', 'joined_at')
    ordering = ('event',)

admin.site.register(Events, EventsAdmin)
admin.site.register(EventParticipant, EventParticipantAdmin)