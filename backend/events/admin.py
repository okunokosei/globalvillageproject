from django.contrib import admin
from .models import Events, EventImage

# Register your models here.
class EventsAdmin(admin.ModelAdmin):
    list_display = ('id', 'title_jp', 'location', 'date', 'start_time', 'end_time', 'created_by', 'created_at', 'updated_at')
    list_display_links = ('id', 'title_jp')
    search_fields = ('id', 'title_jp')
    ordering = ('date', 'created_at', )

class EventImageAdmin(admin.ModelAdmin):
    list_display = ('id', 'event', 'image')
    list_display_links = ('id', 'event')
    search_fields = ('event',)
    ordering = ('event', )


admin.site.register(Events, EventsAdmin)
admin.site.register(EventImage, EventImageAdmin)

