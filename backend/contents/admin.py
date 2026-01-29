from django.contrib import admin
from .models import NoticeTag, Notice

# Register your models here.

class NoticeTagAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'slug', 'color_code')

class NoticeAdmin(admin.ModelAdmin):
    list_display = ('id', 'title_jp', 'tag', 'is_pinned', 'created_by', 'created_at', 'updated_at')

admin.site.register(NoticeTag, NoticeTagAdmin)
admin.site.register(Notice, NoticeAdmin)