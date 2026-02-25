from django.contrib import admin
from .models import NoticeTag, Notice, NoticeImage

# Register your models here.

class NoticeTagAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'slug', 'color_code')
    list_display_links = ('id', 'name')
    search_fields = ('name',)
    ordering = ('id',)

class NoticeAdmin(admin.ModelAdmin):
    list_display = ('id', 'title_jp', 'tag', 'is_pinned', 'created_by', 'created_at', 'updated_at')
    list_display_links = ('id', 'title_jp')
    search_fields = ('title_jp',)
    ordering = ('id',)

class NoticeImageAdmin(admin.ModelAdmin):
    list_display = ('id', 'notice', 'image')
    list_display_links = ('id', 'notice')
    search_fields = ('notice',)
    ordering = ('notice',)

admin.site.register(NoticeTag, NoticeTagAdmin)
admin.site.register(Notice, NoticeAdmin)
admin.site.register(NoticeImage, NoticeImageAdmin)

