from django.contrib import admin
from .models import Gallery

# Register your models here.

class GalleryAdmin(admin.ModelAdmin):
    list_display = ('id', 'title_jp', 'event_date', 'google_photos_url', 'created_at', 'created_by')
    list_display_links = ('id', 'title_jp')
    search_fields = ('title_jp', 'event_date')
    ordering = ('event_date', )

admin.site.register(Gallery, GalleryAdmin)